// AWS Bedrock AI Integration for Explanations
// Real implementation calling AWS Bedrock via backend API

import apiClient from './api';

export interface AIExplanationRequest {
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

export interface AIExplanationResponse {
  explanation: string;
  keyPoints: string[];
  nextSteps: string[];
  estimatedTime: string;
}

// Real AWS Bedrock AI-generated explanations via backend
export async function generateAIExplanation(
  request: AIExplanationRequest
): Promise<AIExplanationResponse> {
  try {
    // Call real backend API
    const response = await apiClient.post('/ai/explain-eligibility', {
      schemeId: request.schemeId,
      schemeName: request.schemeName,
      userProfile: request.userProfile,
      eligibilityStatus: request.eligibilityStatus,
      satisfiedCriteria: request.satisfiedCriteria,
      unsatisfiedCriteria: request.unsatisfiedCriteria,
      language: request.language
    });

    return response.data.data;
  } catch (error) {
    console.error('Error calling Bedrock API:', error);
    // Fallback to mock if API fails
    const { schemeName, eligibilityStatus, satisfiedCriteria, unsatisfiedCriteria, language } = request;
    
    if (eligibilityStatus === 'Eligible') {
      return generateEligibleExplanation(schemeName, satisfiedCriteria, language);
    } else {
      return generateIneligibleExplanation(schemeName, unsatisfiedCriteria, language);
    }
  }
}

function generateEligibleExplanation(
  schemeName: string,
  satisfiedCriteria: string[],
  language: 'en' | 'hi'
): AIExplanationResponse {
  if (language === 'hi') {
    return {
      explanation: `बधाई हो! आप ${schemeName} के लिए पात्र हैं। आपकी प्रोफाइल सभी आवश्यक मानदंडों को पूरा करती है। यह योजना आपकी वर्तमान स्थिति के लिए बहुत उपयुक्त है और आपको महत्वपूर्ण लाभ प्रदान कर सकती है।`,
      keyPoints: [
        '✓ आप सभी पात्रता मानदंडों को पूरा करते हैं',
        '✓ आवेदन प्रक्रिया सरल और सीधी है',
        '✓ आप तुरंत आवेदन कर सकते हैं',
        ...satisfiedCriteria.slice(0, 3).map(c => `✓ ${c}`)
      ],
      nextSteps: [
        '1. आवश्यक दस्तावेज़ इकट्ठा करें',
        '2. ऑनलाइन या CSC केंद्र पर आवेदन करें',
        '3. आवेदन संख्या नोट करें',
        '4. आवेदन की स्थिति ट्रैक करें'
      ],
      estimatedTime: '15-30 दिन'
    };
  }

  return {
    explanation: `Congratulations! You are eligible for ${schemeName}. Your profile meets all the required criteria. This scheme is well-suited for your current situation and can provide you with significant benefits. The application process is straightforward, and you can apply immediately.`,
    keyPoints: [
      '✓ You meet all eligibility criteria',
      '✓ Application process is simple and direct',
      '✓ You can apply immediately',
      ...satisfiedCriteria.slice(0, 3).map(c => `✓ ${c}`)
    ],
    nextSteps: [
      '1. Gather required documents (Aadhaar, income proof, etc.)',
      '2. Apply online or visit nearest CSC center',
      '3. Note down your application number',
      '4. Track your application status regularly'
    ],
    estimatedTime: '15-30 days'
  };
}

function generateIneligibleExplanation(
  schemeName: string,
  unsatisfiedCriteria: Array<{ criterion: string; message: string }>,
  language: 'en' | 'hi'
): AIExplanationResponse {
  if (language === 'hi') {
    const reasons = unsatisfiedCriteria.map(c => `• ${c.message}`).join('\n');
    
    return {
      explanation: `आप वर्तमान में ${schemeName} के लिए पात्र नहीं हैं। कुछ मानदंड पूरे नहीं हुए हैं। हालांकि, निराश न हों - अन्य योजनाएं हो सकती हैं जो आपके लिए उपयुक्त हों।`,
      keyPoints: [
        '✗ कुछ पात्रता मानदंड पूरे नहीं हुए',
        ...unsatisfiedCriteria.slice(0, 3).map(c => `✗ ${c.message}`)
      ],
      nextSteps: [
        '1. अन्य उपयुक्त योजनाओं की जांच करें',
        '2. अपनी प्रोफाइल अपडेट करें यदि परिस्थितियां बदलती हैं',
        '3. स्थानीय CSC केंद्र पर सलाह लें',
        '4. नई योजनाओं के लिए अलर्ट सेट करें'
      ],
      estimatedTime: 'तुरंत'
    };
  }

  return {
    explanation: `You are currently not eligible for ${schemeName}. Some criteria are not met. However, don't be discouraged - there may be other schemes that are suitable for you. We recommend exploring alternative schemes that match your profile better.`,
    keyPoints: [
      '✗ Some eligibility criteria not met',
      ...unsatisfiedCriteria.slice(0, 3).map(c => `✗ ${c.message}`)
    ],
    nextSteps: [
      '1. Check other suitable schemes in your results',
      '2. Update your profile if circumstances change',
      '3. Consult with local CSC center for guidance',
      '4. Set up alerts for new schemes'
    ],
    estimatedTime: 'Immediate'
  };
}

// Simulate AWS Bedrock streaming response
export async function* streamAIExplanation(
  request: AIExplanationRequest
): AsyncGenerator<string, void, unknown> {
  const response = await generateAIExplanation(request);
  const fullText = response.explanation;
  
  // Stream word by word for realistic AI effect
  const words = fullText.split(' ');
  for (const word of words) {
    yield word + ' ';
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

// Chat assistant for answering questions about schemes
export async function chatWithAI(
  question: string,
  context: {
    schemeName: string;
    schemeDescription: string;
    benefits: string;
  },
  userProfile: any,
  language: 'en' | 'hi',
  sessionId?: string
): Promise<{ response: string; sessionId: string }> {
  try {
    // Call real backend chat API
    const response = await apiClient.post('/chat/message', {
      message: question,
      userProfile,
      sessionId,
      language,
      context
    });

    return {
      response: response.data.data.response,
      sessionId: response.data.data.sessionId
    };
  } catch (error) {
    console.error('Error calling chat API:', error);
    // Fallback to mock
    const mockResponse = await generateMockChatResponse(question, context, language);
    return {
      response: mockResponse,
      sessionId: sessionId || 'mock-session-' + Date.now()
    };
  }
}

async function generateMockChatResponse(
  question: string,
  context: {
    schemeName: string;
    schemeDescription: string;
    benefits: string;
  },
  language: 'en' | 'hi'
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { schemeName, schemeDescription, benefits } = context;

  // Simple keyword-based responses (in production, this would use AWS Bedrock)
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('how') || lowerQuestion.includes('apply') || lowerQuestion.includes('कैसे')) {
    if (language === 'hi') {
      return `${schemeName} के लिए आवेदन करने के लिए:\n1. आधिकारिक वेबसाइट पर जाएं या निकटतम CSC केंद्र पर जाएं\n2. आवश्यक दस्तावेज़ तैयार रखें (आधार, आय प्रमाण पत्र)\n3. ऑनलाइन फॉर्म भरें या CSC ऑपरेटर की मदद लें\n4. आवेदन संख्या नोट करें और स्थिति ट्रैक करें`;
    }
    return `To apply for ${schemeName}:\n1. Visit the official website or nearest CSC center\n2. Keep required documents ready (Aadhaar, income proof)\n3. Fill the online form or get help from CSC operator\n4. Note your application number and track status`;
  }

  if (lowerQuestion.includes('benefit') || lowerQuestion.includes('लाभ')) {
    if (language === 'hi') {
      return `${schemeName} के मुख्य लाभ:\n${benefits}\n\nयह योजना आपको वित्तीय सहायता और सामाजिक सुरक्षा प्रदान करती है।`;
    }
    return `Key benefits of ${schemeName}:\n${benefits}\n\nThis scheme provides you with financial assistance and social security.`;
  }

  if (lowerQuestion.includes('document') || lowerQuestion.includes('दस्तावेज़')) {
    if (language === 'hi') {
      return `आमतौर पर आवश्यक दस्तावेज़:\n• आधार कार्ड\n• आय प्रमाण पत्र\n• निवास प्रमाण\n• बैंक खाता विवरण\n• पासपोर्ट साइज फोटो\n\nविशिष्ट आवश्यकताओं के लिए योजना विवरण देखें।`;
    }
    return `Commonly required documents:\n• Aadhaar Card\n• Income Certificate\n• Address Proof\n• Bank Account Details\n• Passport Size Photos\n\nCheck scheme details for specific requirements.`;
  }

  if (lowerQuestion.includes('time') || lowerQuestion.includes('समय')) {
    if (language === 'hi') {
      return `आवेदन प्रक्रिया में आमतौर पर 15-30 दिन लगते हैं। कुछ योजनाओं में तेज़ प्रक्रिया हो सकती है। आप अपने आवेदन की स्थिति ऑनलाइन ट्रैक कर सकते हैं।`;
    }
    return `The application process typically takes 15-30 days. Some schemes may have faster processing. You can track your application status online.`;
  }

  // Default response
  if (language === 'hi') {
    return `${schemeName} के बारे में: ${schemeDescription}\n\nलाभ: ${benefits}\n\nअधिक जानकारी के लिए, आप हेल्पलाइन पर संपर्क कर सकते हैं या निकटतम CSC केंद्र पर जा सकते हैं।`;
  }
  return `About ${schemeName}: ${schemeDescription}\n\nBenefits: ${benefits}\n\nFor more information, you can contact the helpline or visit your nearest CSC center.`;
}
