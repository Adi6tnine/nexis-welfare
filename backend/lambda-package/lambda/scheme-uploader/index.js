"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
exports.prettyPrintScheme = prettyPrintScheme;
exports.parseScheme = parseScheme;
// @ts-nocheck
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const models_1 = require("../../models");
const s3_1 = require("../../services/s3");
const dynamodb_1 = require("../../services/dynamodb");
/**
 * Scheme Uploader Lambda Handler
 *
 * Handles uploading and validating government scheme documents
 *
 * @param event - API Gateway event
 * @returns API Gateway response
 */
async function handler(event) {
    const requestId = event.requestContext?.requestId || (0, uuid_1.v4)();
    const timestamp = new Date().toISOString();
    console.log('Scheme upload request received', {
        requestId,
        timestamp
    });
    // Only allow POST method
    if (event.httpMethod !== 'POST') {
        return createResponse(405, {
            statusCode: 405,
            timestamp,
            error: {
                message: `Method ${event.httpMethod} not allowed`
            }
        });
    }
    if (!event.body) {
        return createResponse(400, {
            statusCode: 400,
            timestamp,
            error: {
                message: 'Request body is required'
            }
        });
    }
    try {
        // Parse request body
        const requestBody = JSON.parse(event.body);
        // Validate required fields
        if (!requestBody.schemeId) {
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'schemeId is required'
                }
            });
        }
        if (!requestBody.policyDocument) {
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'policyDocument is required'
                }
            });
        }
        // Validate document sizes
        const policySize = Buffer.byteLength(requestBody.policyDocument, 'utf8');
        if (policySize > 50 * 1024) { // 50KB limit
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'Policy document exceeds 50KB limit'
                }
            });
        }
        if (requestBody.faqDocument) {
            const faqSize = Buffer.byteLength(requestBody.faqDocument, 'utf8');
            if (faqSize > 50 * 1024) { // 50KB limit
                return createResponse(400, {
                    statusCode: 400,
                    timestamp,
                    error: {
                        message: 'FAQ document exceeds 50KB limit'
                    }
                });
            }
        }
        // Create scheme object
        const scheme = {
            schemeId: requestBody.schemeId,
            schemeName: requestBody.schemeName,
            description: requestBody.description,
            benefits: requestBody.benefits,
            eligibilityCriteria: requestBody.eligibilityCriteria,
            applicationProcess: requestBody.applicationProcess,
            documents: requestBody.documents,
            officialUrl: requestBody.officialUrl,
            s3PolicyPath: `schemes/${requestBody.schemeId}/policy.txt`,
            s3FaqPath: requestBody.faqDocument
                ? `schemes/${requestBody.schemeId}/faq.txt`
                : undefined,
            createdAt: timestamp,
            updatedAt: timestamp,
            version: 1
        };
        // Validate scheme metadata
        let validatedScheme;
        try {
            validatedScheme = (0, models_1.validateScheme)(scheme);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const validationErrors = (0, models_1.formatValidationErrors)(error);
                console.warn('Scheme validation failed', { requestId, validationErrors });
                return createResponse(400, {
                    statusCode: 400,
                    timestamp,
                    error: {
                        message: 'Invalid scheme data',
                        validationErrors
                    }
                });
            }
            throw error;
        }
        console.log('Uploading scheme documents', {
            requestId,
            schemeId: requestBody.schemeId,
            hasFaq: !!requestBody.faqDocument
        });
        // Upload documents to S3 in parallel
        const uploadPromises = [
            (0, s3_1.uploadSchemeMetadata)(requestBody.schemeId, validatedScheme),
            (0, s3_1.uploadPolicyDocument)(requestBody.schemeId, requestBody.policyDocument)
        ];
        if (requestBody.faqDocument) {
            uploadPromises.push((0, s3_1.uploadFaqDocument)(requestBody.schemeId, requestBody.faqDocument));
        }
        try {
            await Promise.all(uploadPromises);
        }
        catch (error) {
            console.error('Failed to upload documents to S3', { requestId, error });
            return createResponse(503, {
                statusCode: 503,
                timestamp,
                error: {
                    message: 'Failed to upload scheme documents. Please try again later.'
                }
            });
        }
        // Store scheme metadata in DynamoDB
        try {
            await (0, dynamodb_1.putScheme)(validatedScheme);
        }
        catch (error) {
            console.error('Failed to store scheme metadata in DynamoDB', { requestId, error });
            // Continue even if DynamoDB fails - documents are already in S3
        }
        console.log('Scheme uploaded successfully', {
            requestId,
            schemeId: requestBody.schemeId
        });
        return createResponse(201, {
            statusCode: 201,
            timestamp,
            data: {
                schemeId: validatedScheme.schemeId,
                schemeName: validatedScheme.schemeName,
                version: validatedScheme.version,
                s3PolicyPath: validatedScheme.s3PolicyPath,
                s3FaqPath: validatedScheme.s3FaqPath,
                message: 'Scheme uploaded successfully'
            }
        });
    }
    catch (error) {
        console.error('Unexpected error in scheme uploader', {
            requestId,
            error: error.message,
            stack: error.stack
        });
        return createResponse(500, {
            statusCode: 500,
            timestamp,
            error: {
                message: 'An unexpected error occurred. Please try again later.'
            }
        });
    }
}
/**
 * Create Lambda response with proper headers
 */
function createResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify(body)
    };
}
/**
 * Pretty print scheme for round-trip testing
 */
function prettyPrintScheme(scheme) {
    return JSON.stringify(scheme, null, 2);
}
/**
 * Parse scheme from JSON string
 */
function parseScheme(json) {
    return JSON.parse(json);
}
