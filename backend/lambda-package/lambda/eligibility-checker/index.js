"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const models_1 = require("../../models");
const s3_1 = require("../../services/s3");
const dynamodb_1 = require("../../services/dynamodb");
const eligibility_1 = require("../../services/eligibility");
/**
 * Eligibility Checker Lambda Handler
 *
 * Evaluates user eligibility against all government schemes
 *
 * @param event - API Gateway event
 * @returns API Gateway response
 */
async function handler(event) {
    const requestId = event.requestContext?.requestId || (0, uuid_1.v4)();
    const timestamp = new Date().toISOString();
    console.log('Eligibility check request received', {
        requestId,
        timestamp
    });
    try {
        // Parse request body
        const requestBody = JSON.parse(event.body);
        // Validate input
        let validatedRequest;
        try {
            validatedRequest = (0, models_1.validateEligibilityCheckRequest)(requestBody);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const validationErrors = (0, models_1.formatValidationErrors)(error);
                console.warn('Validation failed', { requestId, validationErrors });
                return createResponse(400, {
                    statusCode: 400,
                    timestamp,
                    error: {
                        message: 'Invalid input',
                        validationErrors
                    }
                });
            }
            throw error;
        }
        const { userId, profile } = validatedRequest;
        console.log('Processing eligibility check', {
            requestId,
            userId,
            profileSummary: {
                age: profile.age,
                state: profile.state,
                occupation: profile.occupation
            }
        });
        // Fetch all schemes from S3
        let schemes;
        try {
            schemes = await (0, s3_1.fetchAllSchemes)();
            console.log(`Fetched ${schemes.length} schemes from S3`, { requestId });
        }
        catch (error) {
            console.error('Failed to fetch schemes from S3', { requestId, error });
            return createResponse(503, {
                statusCode: 503,
                timestamp,
                error: {
                    message: 'Unable to fetch scheme data. Please try again later.'
                }
            });
        }
        if (schemes.length === 0) {
            console.warn('No schemes available', { requestId });
            return createResponse(200, {
                statusCode: 200,
                timestamp,
                data: {
                    resultId: (0, uuid_1.v4)(),
                    userId,
                    timestamp,
                    profile: {
                        age: profile.age,
                        state: profile.state,
                        occupation: profile.occupation,
                        annualIncome: profile.annualIncome,
                        gender: profile.gender,
                        socialCategory: profile.socialCategory,
                        hasDisability: profile.hasDisability
                    },
                    eligibleSchemes: [],
                    ineligibleSchemes: [],
                    totalSchemes: 0
                }
            });
        }
        // Evaluate eligibility for each scheme
        const eligibleSchemes = [];
        const ineligibleSchemes = [];
        for (const scheme of schemes) {
            const evaluation = (0, eligibility_1.evaluateEligibility)(profile, scheme);
            if (evaluation.isEligible) {
                eligibleSchemes.push({
                    schemeId: scheme.schemeId,
                    schemeName: scheme.schemeName,
                    description: scheme.description,
                    benefits: scheme.benefits,
                    satisfiedCriteria: (0, eligibility_1.getSatisfiedCriteria)(evaluation.results),
                    matchScore: evaluation.matchScore
                });
            }
            else {
                ineligibleSchemes.push({
                    schemeId: scheme.schemeId,
                    schemeName: scheme.schemeName,
                    description: scheme.description,
                    unsatisfiedCriteria: (0, eligibility_1.getUnsatisfiedCriteria)(evaluation.results)
                });
            }
        }
        // Sort eligible schemes by match score (descending)
        eligibleSchemes.sort((a, b) => b.matchScore - a.matchScore);
        // Create result
        const result = {
            resultId: (0, uuid_1.v4)(),
            userId,
            timestamp,
            profile: {
                age: profile.age,
                state: profile.state,
                occupation: profile.occupation,
                annualIncome: profile.annualIncome,
                gender: profile.gender,
                socialCategory: profile.socialCategory,
                hasDisability: profile.hasDisability
            },
            eligibleSchemes,
            ineligibleSchemes,
            totalSchemes: schemes.length
        };
        // Store result in DynamoDB (non-blocking)
        (0, dynamodb_1.putEligibilityResult)(result).catch(error => {
            console.error('Failed to store result in DynamoDB', { requestId, error });
            // Don't fail the request if storage fails
        });
        console.log('Eligibility check completed', {
            requestId,
            eligibleCount: eligibleSchemes.length,
            ineligibleCount: ineligibleSchemes.length,
            totalSchemes: schemes.length
        });
        // Return response
        return createResponse(200, {
            statusCode: 200,
            timestamp,
            data: result
        });
    }
    catch (error) {
        console.error('Unexpected error in eligibility checker', {
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
