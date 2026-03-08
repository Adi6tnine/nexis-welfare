"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const uuid_1 = require("uuid");
const dynamodb_1 = require("../../services/dynamodb");
const s3_1 = require("../../services/s3");
const dynamodb_2 = require("../../services/dynamodb");
const bedrock_1 = require("../../services/bedrock");
/**
 * AI Explanation Lambda Handler
 *
 * Generates plain-language explanations of eligibility decisions using Amazon Bedrock
 *
 * @param event - API Gateway event
 * @returns API Gateway response
 */
async function handler(event) {
    const requestId = event.requestContext?.requestId || (0, uuid_1.v4)();
    const timestamp = new Date().toISOString();
    console.log('AI explanation request received', {
        requestId,
        timestamp
    });
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
        // Parse and validate request
        const request = JSON.parse(event.body);
        if (!request.resultId) {
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'resultId is required'
                }
            });
        }
        if (!request.schemeId) {
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'schemeId is required'
                }
            });
        }
        const language = request.language || 'en';
        if (!['en', 'hi'].includes(language)) {
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'language must be "en" or "hi"'
                }
            });
        }
        console.log('Processing explanation request', {
            requestId,
            resultId: request.resultId,
            schemeId: request.schemeId,
            language
        });
        // Check cache first
        const cacheKey = `${request.resultId}#${request.schemeId}#${language}`;
        const cachedExplanation = await (0, dynamodb_2.getExplanationCache)(cacheKey);
        if (cachedExplanation) {
            console.log('Returning cached explanation', { requestId, cacheKey });
            return createResponse(200, {
                statusCode: 200,
                timestamp,
                data: {
                    explanation: cachedExplanation.explanation,
                    alternativeSchemes: cachedExplanation.alternativeSchemes || [],
                    generatedAt: cachedExplanation.generatedAt,
                    cached: true
                }
            });
        }
        // Fetch eligibility result
        const eligibilityResult = await (0, dynamodb_1.getEligibilityResult)(request.resultId);
        if (!eligibilityResult) {
            console.warn('Eligibility result not found', { requestId, resultId: request.resultId });
            return createResponse(404, {
                statusCode: 404,
                timestamp,
                error: {
                    message: 'Eligibility result not found'
                }
            });
        }
        // Find the scheme in the result
        const eligibleScheme = eligibilityResult.eligibleSchemes.find(s => s.schemeId === request.schemeId);
        const ineligibleScheme = eligibilityResult.ineligibleSchemes.find(s => s.schemeId === request.schemeId);
        if (!eligibleScheme && !ineligibleScheme) {
            console.warn('Scheme not found in result', { requestId, schemeId: request.schemeId });
            return createResponse(404, {
                statusCode: 404,
                timestamp,
                error: {
                    message: 'Scheme not found in eligibility result'
                }
            });
        }
        const isEligible = !!eligibleScheme;
        const scheme = eligibleScheme || ineligibleScheme;
        // Fetch full scheme details
        const schemeDetails = await (0, s3_1.fetchSchemeDocument)(request.schemeId);
        if (!schemeDetails) {
            console.warn('Scheme details not found', { requestId, schemeId: request.schemeId });
            return createResponse(404, {
                statusCode: 404,
                timestamp,
                error: {
                    message: 'Scheme details not found'
                }
            });
        }
        // Prepare criteria for explanation
        const criteria = isEligible
            ? eligibleScheme.satisfiedCriteria
            : ineligibleScheme.unsatisfiedCriteria.map(c => c.reason);
        // Generate explanation using Bedrock
        let explanation;
        try {
            explanation = await (0, bedrock_1.generateEligibilityExplanation)(scheme.schemeName, scheme.description, isEligible, eligibilityResult.profile, criteria, language);
            // Safety check: detect approval promises
            if ((0, bedrock_1.containsApprovalPromise)(explanation)) {
                console.warn('Approval promise detected in explanation', { requestId });
                explanation = explanation.replace(/you will (get|receive)/gi, 'you may be able to get');
            }
        }
        catch (error) {
            console.error('Error generating explanation', { requestId, error });
            return createResponse(503, {
                statusCode: 503,
                timestamp,
                error: {
                    message: 'Unable to generate explanation. Please try again later.'
                }
            });
        }
        // Find alternative schemes if ineligible
        const alternativeSchemes = [];
        if (!isEligible && eligibilityResult.eligibleSchemes.length > 0) {
            // Suggest top 3 eligible schemes
            alternativeSchemes.push(...eligibilityResult.eligibleSchemes
                .slice(0, 3)
                .map(s => s.schemeId));
        }
        // Cache the explanation
        await (0, dynamodb_2.putExplanationCache)(cacheKey, explanation, alternativeSchemes).catch(error => {
            console.error('Failed to cache explanation', { requestId, error });
            // Don't fail the request if caching fails
        });
        console.log('Explanation generated successfully', {
            requestId,
            explanationLength: explanation.length,
            alternativeCount: alternativeSchemes.length
        });
        return createResponse(200, {
            statusCode: 200,
            timestamp,
            data: {
                explanation,
                alternativeSchemes,
                generatedAt: timestamp,
                cached: false
            }
        });
    }
    catch (error) {
        console.error('Unexpected error in AI explanation', {
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
