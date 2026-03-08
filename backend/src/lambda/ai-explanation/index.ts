// UUID removed
import { getEligibilityResult } from '../../services/dynamodb';
import { fetchSchemeDocument } from '../../services/s3';
import {
  getExplanationCache,
  putExplanationCache
} from '../../services/dynamodb';
import {
  generateEligibilityExplanation,
  sanitizeUserInput,
  containsApprovalPromise
} from '../../services/bedrock';

// Lambda handler event type
interface LambdaEvent {
  body: string;
  headers?: Record<string, string>;
  requestContext?: {
    requestId: string;
  };
}

// Lambda handler response type
interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

// API Response format
interface APIResponse {
  statusCode: number;
  timestamp: string;
  data?: {
    explanation: string;
    alternativeSchemes?: string[];
    generatedAt: string;
    cached?: boolean;
  };
  error?: {
    message: string;
  };
}

// Request body type
interface ExplanationRequest {
  resultId: string;
  schemeId: string;
  language?: 'en' | 'hi';
}

/**
 * AI Explanation Lambda Handler
 * 
 * Generates plain-language explanations of eligibility decisions using Amazon Bedrock
 * 
 * @param event - API Gateway event
 * @returns API Gateway response
 */
export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const requestId = event.requestContext?.requestId || Date.now().toString() + Math.random().toString(36);
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
    const request: ExplanationRequest = JSON.parse(event.body);

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
    const cachedExplanation = await getExplanationCache(cacheKey);

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
    const eligibilityResult = await getEligibilityResult(request.resultId);

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
    const eligibleScheme = eligibilityResult.eligibleSchemes.find(
      s => s.schemeId === request.schemeId
    );
    const ineligibleScheme = eligibilityResult.ineligibleSchemes.find(
      s => s.schemeId === request.schemeId
    );

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
    const schemeDetails = await fetchSchemeDocument(request.schemeId);

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
      ? eligibleScheme!.satisfiedCriteria
      : ineligibleScheme!.unsatisfiedCriteria.map(c => c.reason);

    // Generate explanation using Bedrock
    let explanation: string;
    try {
      explanation = await generateEligibilityExplanation(
        scheme.schemeName,
        scheme.description,
        isEligible,
        eligibilityResult.profile,
        criteria,
        language
      );

      // Safety check: detect approval promises
      if (containsApprovalPromise(explanation)) {
        console.warn('Approval promise detected in explanation', { requestId });
        explanation = explanation.replace(
          /you will (get|receive)/gi,
          'you may be able to get'
        );
      }

    } catch (error: any) {
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
    const alternativeSchemes: string[] = [];
    if (!isEligible && eligibilityResult.eligibleSchemes.length > 0) {
      // Suggest top 3 eligible schemes
      alternativeSchemes.push(
        ...eligibilityResult.eligibleSchemes
          .slice(0, 3)
          .map(s => s.schemeId)
      );
    }

    // Cache the explanation
    await putExplanationCache(cacheKey, explanation, alternativeSchemes).catch(error => {
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

  } catch (error: any) {
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
function createResponse(statusCode: number, body: APIResponse): LambdaResponse {
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
