import { generateEligibilityExplanation } from '../../services/bedrock';

interface LambdaEvent {
  body: string;
  headers?: Record<string, string>;
  requestContext?: {
    requestId: string;
  };
}

interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

interface ExplanationRequest {
  schemeId: string;
  schemeName: string;
  userProfile: {
    age: number;
    occupation: string;
    income: number;
    state: string;
  };
  eligibilityStatus: 'Eligible' | 'Not Eligible';
  satisfiedCriteria: string[];
  unsatisfiedCriteria: Array<{ criterion: string; message: string }>;
  language: 'en' | 'hi';
}

export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const requestId = event.requestContext?.requestId || Date.now().toString();
  const timestamp = new Date().toISOString();

  console.log('AI Explanation V2 request received', { requestId, timestamp });

  if (!event.body) {
    return createResponse(400, {
      statusCode: 400,
      timestamp,
      error: { message: 'Request body is required' }
    });
  }

  try {
    const request: ExplanationRequest = JSON.parse(event.body);

    // Validate required fields
    if (!request.schemeName || !request.userProfile || !request.eligibilityStatus) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'Missing required fields' }
      });
    }

    const language = request.language || 'en';
    const isEligible = request.eligibilityStatus === 'Eligible';

    // Prepare criteria
    const criteria = isEligible
      ? request.satisfiedCriteria
      : request.unsatisfiedCriteria.map(c => c.message);

    // Generate explanation using Bedrock
    const explanation = await generateEligibilityExplanation(
      request.schemeName,
      `Government scheme providing benefits to eligible citizens`,
      isEligible,
      {
        age: request.userProfile.age,
        state: request.userProfile.state,
        occupation: request.userProfile.occupation,
        annualIncome: request.userProfile.income,
        gender: 'Not specified',
        socialCategory: 'Not specified',
        hasDisability: false
      },
      criteria,
      language
    );

    // Generate key points
    const keyPoints = isEligible
      ? [
          '✓ You meet all eligibility criteria',
          '✓ Application process is simple and direct',
          '✓ You can apply immediately',
          ...request.satisfiedCriteria.slice(0, 3).map(c => `✓ ${c}`)
        ]
      : [
          '✗ Some eligibility criteria not met',
          ...request.unsatisfiedCriteria.slice(0, 3).map(c => `✗ ${c.message}`)
        ];

    // Generate next steps
    const nextSteps = isEligible
      ? language === 'hi'
        ? [
            '1. आवश्यक दस्तावेज़ इकट्ठा करें',
            '2. ऑनलाइन या CSC केंद्र पर आवेदन करें',
            '3. आवेदन संख्या नोट करें',
            '4. आवेदन की स्थिति ट्रैक करें'
          ]
        : [
            '1. Gather required documents (Aadhaar, income proof, etc.)',
            '2. Apply online or visit nearest CSC center',
            '3. Note down your application number',
            '4. Track your application status regularly'
          ]
      : language === 'hi'
      ? [
          '1. अन्य उपयुक्त योजनाओं की जांच करें',
          '2. अपनी प्रोफाइल अपडेट करें यदि परिस्थितियां बदलती हैं',
          '3. स्थानीय CSC केंद्र पर सलाह लें',
          '4. नई योजनाओं के लिए अलर्ट सेट करें'
        ]
      : [
          '1. Check other suitable schemes in your results',
          '2. Update your profile if circumstances change',
          '3. Consult with local CSC center for guidance',
          '4. Set up alerts for new schemes'
        ];

    const estimatedTime = isEligible
      ? language === 'hi'
        ? '15-30 दिन'
        : '15-30 days'
      : language === 'hi'
      ? 'तुरंत'
      : 'Immediate';

    console.log('AI explanation generated successfully', {
      requestId,
      explanationLength: explanation.length
    });

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: {
        explanation,
        keyPoints,
        nextSteps,
        estimatedTime
      }
    });

  } catch (error: any) {
    console.error('Error generating AI explanation', {
      requestId,
      error: error.message,
      stack: error.stack
    });

    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Failed to generate explanation' }
    });
  }
}

function createResponse(statusCode: number, body: any): LambdaResponse {
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
