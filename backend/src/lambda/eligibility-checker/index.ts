// UUID removed
import { z } from 'zod';
import {
  UserProfile,
  EligibilityResult,
  EligibleScheme,
  IneligibleScheme,
  EligibilityCheckResponse,
  validateEligibilityCheckRequest,
  formatValidationErrors
} from '../../models';
import { fetchAllSchemes } from '../../services/s3';
import { putEligibilityResult } from '../../services/dynamodb';
import {
  evaluateEligibility,
  getSatisfiedCriteria,
  getUnsatisfiedCriteria
} from '../../services/eligibility';

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

/**
 * Eligibility Checker Lambda Handler
 * 
 * Evaluates user eligibility against all government schemes
 * 
 * @param event - API Gateway event
 * @returns API Gateway response
 */
export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const requestId = event.requestContext?.requestId || Date.now().toString() + Math.random().toString(36);
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
      validatedRequest = validateEligibilityCheckRequest(requestBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = formatValidationErrors(error);
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
      schemes = await fetchAllSchemes();
      console.log(`Fetched ${schemes.length} schemes from S3`, { requestId });
    } catch (error) {
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
          resultId: Date.now().toString() + Math.random().toString(36),
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
    const eligibleSchemes: EligibleScheme[] = [];
    const ineligibleSchemes: IneligibleScheme[] = [];

    for (const scheme of schemes) {
      const evaluation = evaluateEligibility(profile, scheme);

      if (evaluation.isEligible) {
        eligibleSchemes.push({
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          description: scheme.description,
          benefits: scheme.benefits,
          satisfiedCriteria: getSatisfiedCriteria(evaluation.results),
          matchScore: evaluation.matchScore
        });
      } else {
        ineligibleSchemes.push({
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          description: scheme.description,
          unsatisfiedCriteria: getUnsatisfiedCriteria(evaluation.results)
        });
      }
    }

    // Sort eligible schemes by match score (descending)
    eligibleSchemes.sort((a, b) => b.matchScore - a.matchScore);

    // Create result
    const result: EligibilityResult = {
      resultId: Date.now().toString() + Math.random().toString(36),
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
    putEligibilityResult(result).catch(error => {
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

  } catch (error: any) {
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
function createResponse(statusCode: number, body: EligibilityCheckResponse): LambdaResponse {
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
