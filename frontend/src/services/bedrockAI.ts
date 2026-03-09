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
    eligibleSchemes?: string;
    eligibleCount?: number;
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
    console.log('Using fallback mock responses (backend not available)');
    // Fallback to mock with enhanced context
    const mockResponse = await generateMockChatResponse(question, context, userProfile, language);
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
    eligibleSchemes?: string;
    eligibleCount?: number;
  },
  userProfile: any,
  language: 'en' | 'hi'
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { schemeName, schemeDescription, benefits, eligibleSchemes, eligibleCount } = context;
  const lowerQuestion = question.toLowerCase();

  // Enhanced responses using user profile
  const userName = userProfile?.name || '';
  const userAge = userProfile?.age || '';
  const userState = userProfile?.state || '';
  const userOccupation = userProfile?.occupation || '';

  // Greeting and general questions
  if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('नमस्ते')) {
    if (language === 'hi') {
      return `नमस्ते${userName ? ' ' + userName : ''}! मैं NEXIS AI सहायक हूँ। ${userAge ? `मैं देख रहा हूँ कि आप ${userAge} साल के हैं` : ''} ${userState ? `और ${userState} से हैं` : ''}। ${eligibleCount ? `आप ${eligibleCount} योजनाओं के लिए पात्र हैं।` : ''} मैं आपकी कैसे मदद कर सकता हूँ?`;
    }
    return `Hello${userName ? ' ' + userName : ''}! I'm NEXIS AI Assistant. ${userAge ? `I see you're ${userAge} years old` : ''} ${userState ? `from ${userState}` : ''}. ${eligibleCount ? `You're eligible for ${eligibleCount} schemes.` : ''} How can I help you today?`;
  }

  // Eligible schemes question
  if (lowerQuestion.includes('eligible') || lowerQuestion.includes('qualify') || lowerQuestion.includes('पात्र')) {
    if (language === 'hi') {
      return `${userName ? userName + ', ' : ''}आप ${eligibleCount || 'कई'} सरकारी योजनाओं के लिए पात्र हैं! ${eligibleSchemes ? `\n\nमुख्य योजनाएं:\n${eligibleSchemes}` : ''}\n\nये योजनाएं आपकी उम्र (${userAge} साल), व्यवसाय (${userOccupation}), और राज्य (${userState}) के आधार पर चुनी गई हैं। प्रत्येक योजना के विवरण के लिए "Details" बटन पर क्लिक करें।`;
    }
    return `${userName ? userName + ', ' : ''}You're eligible for ${eligibleCount || 'several'} government schemes! ${eligibleSchemes ? `\n\nKey schemes:\n${eligibleSchemes}` : ''}\n\nThese schemes are selected based on your age (${userAge} years), occupation (${userOccupation}), and state (${userState}). Click "Details" button for each scheme to learn more.`;
  }

  // How to apply
  if (lowerQuestion.includes('how') || lowerQuestion.includes('apply') || lowerQuestion.includes('कैसे') || lowerQuestion.includes('आवेदन')) {
    if (language === 'hi') {
      return `${schemeName} के लिए आवेदन करने के लिए:\n\n1. आधिकारिक वेबसाइट पर जाएं या निकटतम CSC केंद्र पर जाएं\n2. आवश्यक दस्तावेज़ तैयार रखें:\n   • आधार कार्ड\n   • आय प्रमाण पत्र\n   • निवास प्रमाण\n   • बैंक खाता विवरण\n3. ऑनलाइन फॉर्म भरें या CSC ऑपरेटर की मदद लें\n4. आवेदन संख्या नोट करें और स्थिति ट्रैक करें\n\nआवेदन प्रक्रिया में आमतौर पर 15-30 दिन लगते हैं।`;
    }
    return `To apply for ${schemeName}:\n\n1. Visit the official website or nearest CSC center\n2. Keep required documents ready:\n   • Aadhaar Card\n   • Income Certificate\n   • Address Proof\n   • Bank Account Details\n3. Fill the online form or get help from CSC operator\n4. Note your application number and track status\n\nThe application process typically takes 15-30 days.`;
  }

  // Benefits question
  if (lowerQuestion.includes('benefit') || lowerQuestion.includes('लाभ') || lowerQuestion.includes('advantage')) {
    if (language === 'hi') {
      return `${schemeName} के मुख्य लाभ:\n\n${benefits}\n\nयह योजना ${userOccupation ? userOccupation + ' जैसे लोगों' : 'आप जैसे लोगों'} के लिए विशेष रूप से डिज़ाइन की गई है। यह वित्तीय सहायता और सामाजिक सुरक्षा प्रदान करती है।`;
    }
    return `Key benefits of ${schemeName}:\n\n${benefits}\n\nThis scheme is specifically designed for people like you${userOccupation ? ' (' + userOccupation + ')' : ''}. It provides financial assistance and social security.`;
  }

  // Documents question
  if (lowerQuestion.includes('document') || lowerQuestion.includes('दस्तावेज़') || lowerQuestion.includes('paper')) {
    if (language === 'hi') {
      return `आमतौर पर आवश्यक दस्तावेज़:\n\n• आधार कार्ड (अनिवार्य)\n• आय प्रमाण पत्र\n• निवास प्रमाण (${userState} का)\n• बैंक खाता विवरण\n• पासपोर्ट साइज फोटो\n• ${userAge && userAge < 18 ? 'जन्म प्रमाण पत्र' : 'आयु प्रमाण'}\n\nविशिष्ट आवश्यकताओं के लिए योजना विवरण देखें। सभी दस्तावेज़ों की स्व-सत्यापित प्रतियां रखें।`;
    }
    return `Commonly required documents:\n\n• Aadhaar Card (mandatory)\n• Income Certificate\n• Address Proof (from ${userState})\n• Bank Account Details\n• Passport Size Photos\n• ${userAge && userAge < 18 ? 'Birth Certificate' : 'Age Proof'}\n\nCheck scheme details for specific requirements. Keep self-attested copies of all documents.`;
  }

  // Time/duration question
  if (lowerQuestion.includes('time') || lowerQuestion.includes('समय') || lowerQuestion.includes('long') || lowerQuestion.includes('duration')) {
    if (language === 'hi') {
      return `आवेदन प्रक्रिया समयरेखा:\n\n• आवेदन जमा: तुरंत (ऑनलाइन) या 1 दिन (CSC)\n• दस्तावेज़ सत्यापन: 3-7 दिन\n• अनुमोदन: 7-15 दिन\n• लाभ वितरण: 15-30 दिन\n\nकुल समय: लगभग 15-30 दिन\n\nआप अपने आवेदन की स्थिति ऑनलाइन ट्रैक कर सकते हैं। कुछ योजनाओं में तेज़ प्रक्रिया हो सकती है।`;
    }
    return `Application process timeline:\n\n• Application submission: Instant (online) or 1 day (CSC)\n• Document verification: 3-7 days\n• Approval: 7-15 days\n• Benefit disbursement: 15-30 days\n\nTotal time: Approximately 15-30 days\n\nYou can track your application status online. Some schemes may have faster processing.`;
  }

  // Help/support question
  if (lowerQuestion.includes('help') || lowerQuestion.includes('support') || lowerQuestion.includes('मदद') || lowerQuestion.includes('सहायता')) {
    if (language === 'hi') {
      return `मैं आपकी निम्नलिखित में मदद कर सकता हूँ:\n\n• पात्र योजनाओं के बारे में जानकारी\n• आवेदन प्रक्रिया की व्याख्या\n• आवश्यक दस्तावेज़ों की सूची\n• लाभों का विवरण\n• समय-सीमा और ट्रैकिंग\n• CSC केंद्र खोजना\n\nआप मुझसे कुछ भी पूछ सकते हैं! उदाहरण:\n"मैं किन योजनाओं के लिए पात्र हूँ?"\n"PM Kisan के लिए कैसे आवेदन करें?"\n"कौन से दस्तावेज़ चाहिए?"`;
    }
    return `I can help you with:\n\n• Information about eligible schemes\n• Application process explanation\n• Required documents list\n• Benefits details\n• Timeline and tracking\n• Finding CSC centers\n\nFeel free to ask me anything! Examples:\n"What schemes am I eligible for?"\n"How to apply for PM Kisan?"\n"What documents do I need?"`;
  }

  // Default response with context
  if (language === 'hi') {
    return `${schemeName} के बारे में:\n\n${schemeDescription}\n\n**मुख्य लाभ:**\n${benefits}\n\n${userAge && userOccupation ? `यह योजना ${userAge} साल की उम्र और ${userOccupation} व्यवसाय वाले लोगों के लिए उपयुक्त है।` : ''}\n\nअधिक जानकारी के लिए, आप:\n• हेल्पलाइन पर संपर्क कर सकते हैं\n• निकटतम CSC केंद्र पर जा सकते हैं\n• आधिकारिक वेबसाइट देख सकते हैं\n\nक्या आप आवेदन प्रक्रिया के बारे में जानना चाहेंगे?`;
  }
  return `About ${schemeName}:\n\n${schemeDescription}\n\n**Key Benefits:**\n${benefits}\n\n${userAge && userOccupation ? `This scheme is suitable for people aged ${userAge} years with ${userOccupation} occupation.` : ''}\n\nFor more information, you can:\n• Contact the helpline\n• Visit your nearest CSC center\n• Check the official website\n\nWould you like to know about the application process?`;
}
