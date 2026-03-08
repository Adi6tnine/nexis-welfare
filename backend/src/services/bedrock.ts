import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput
} from '@aws-sdk/client-bedrock-runtime';

// Bedrock Client Configuration
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || 'us-east-1'
});

// Model configuration
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';
const MAX_TOKENS = 1000;
const TEMPERATURE = 0.7;

// Mock mode for local development
const MOCK_BEDROCK = process.env.MOCK_BEDROCK === 'true';

/**
 * Invoke Claude 3 Haiku model with a prompt
 */
export async function invokeClaudeModel(
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = MAX_TOKENS
): Promise<string> {
  // Mock response for local development
  if (MOCK_BEDROCK) {
    console.log('MOCK MODE: Returning simulated Bedrock response');
    return generateMockResponse(prompt);
  }

  try {
    // Prepare request body for Claude 3
    const requestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: maxTokens,
      temperature: TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      ...(systemPrompt && { system: systemPrompt })
    };

    const input: InvokeModelCommandInput = {
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    };

    console.log('Invoking Bedrock model', {
      modelId: MODEL_ID,
      promptLength: prompt.length,
      maxTokens
    });

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);

    // Parse response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    if (!responseBody.content || responseBody.content.length === 0) {
      throw new Error('Empty response from Bedrock');
    }

    const generatedText = responseBody.content[0].text;

    console.log('Bedrock response received', {
      responseLength: generatedText.length,
      stopReason: responseBody.stop_reason
    });

    return generatedText;

  } catch (error: any) {
    console.error('Error invoking Bedrock model', {
      error: error.message,
      modelId: MODEL_ID
    });
    throw new Error(`Bedrock invocation failed: ${error.message}`);
  }
}

/**
 * Generate explanation for eligibility decision
 */
export async function generateEligibilityExplanation(
  schemeName: string,
  schemeDescription: string,
  isEligible: boolean,
  userProfile: {
    age: number;
    state: string;
    occupation: string;
    annualIncome: number;
    gender: string;
    socialCategory: string;
    hasDisability: boolean;
  },
  criteria: string[],
  language: 'en' | 'hi' = 'en'
): Promise<string> {
  const languageName = language === 'hi' ? 'Hindi' : 'English';
  const status = isEligible ? 'eligible' : 'not eligible';

  const systemPrompt = `You are a helpful assistant explaining government welfare scheme eligibility to Indian citizens with low digital literacy. Use simple, everyday language. Be encouraging and empathetic. Keep responses under 150 words.`;

  const prompt = `
User Profile:
- Age: ${userProfile.age} years
- State: ${userProfile.state}
- Occupation: ${userProfile.occupation}
- Annual Income: ₹${userProfile.annualIncome.toLocaleString('en-IN')}
- Gender: ${userProfile.gender}
- Social Category: ${userProfile.socialCategory}
- Has Disability: ${userProfile.hasDisability ? 'Yes' : 'No'}

Scheme: ${schemeName}
Description: ${schemeDescription}

Status: User is ${status} for this scheme.

${isEligible 
  ? `Satisfied Criteria:\n${criteria.map(c => `- ${c}`).join('\n')}\n\nExplain in simple ${languageName} why this user qualifies for this scheme. Be encouraging and explain the benefits they can receive.`
  : `Unsatisfied Criteria:\n${criteria.map(c => `- ${c}`).join('\n')}\n\nExplain in simple ${languageName} why this user does not qualify for this scheme. Be empathetic and suggest what would need to change for them to qualify.`
}

Use short sentences. Avoid jargon. Be helpful and friendly.`;

  return await invokeClaudeModel(prompt, systemPrompt);
}

/**
 * Generate chat response with RAG context
 */
export async function generateChatResponse(
  userQuery: string,
  userProfile: {
    age: number;
    state: string;
    occupation: string;
    annualIncome: number;
    socialCategory: string;
  },
  conversationHistory: Array<{ role: string; message: string }>,
  retrievedDocuments: string[],
  language: 'en' | 'hi' = 'en'
): Promise<{ response: string; confidence: 'high' | 'medium' | 'low' }> {
  const languageName = language === 'hi' ? 'Hindi' : 'English';

  const systemPrompt = `You are NEXIS, an AI assistant helping Indian citizens understand government welfare schemes. 

CRITICAL RULES:
1. Answer ONLY based on the retrieved documents provided
2. If the documents don't contain the answer, say "I don't have that information in my knowledge base"
3. NEVER make promises about scheme approval or benefit amounts
4. NEVER provide medical, legal, or financial advice
5. Use simple ${languageName} suitable for users with low digital literacy
6. Keep responses under 200 words
7. Use short sentences and everyday language`;

  const conversationContext = conversationHistory.length > 0
    ? `\n\nPrevious Conversation:\n${conversationHistory.slice(-5).map(msg => `${msg.role}: ${msg.message}`).join('\n')}`
    : '';

  const documentsContext = retrievedDocuments.length > 0
    ? `\n\nRetrieved Documents:\n${retrievedDocuments.map((doc, i) => `Document ${i + 1}:\n${doc}`).join('\n\n')}`
    : '\n\nNo relevant documents found.';

  const prompt = `
User Context:
- Age: ${userProfile.age}, State: ${userProfile.state}
- Occupation: ${userProfile.occupation}
- Income: ₹${userProfile.annualIncome.toLocaleString('en-IN')}
- Category: ${userProfile.socialCategory}
${conversationContext}
${documentsContext}

User Question: ${userQuery}

Provide a helpful answer in ${languageName}.`;

  const response = await invokeClaudeModel(prompt, systemPrompt, 800);

  // Determine confidence level based on response content
  const confidence = determineConfidence(response, retrievedDocuments.length);

  return { response, confidence };
}

/**
 * Determine confidence level of AI response
 */
function determineConfidence(response: string, documentCount: number): 'high' | 'medium' | 'low' {
  const lowConfidenceIndicators = [
    "I don't have",
    "I'm not sure",
    "I cannot confirm",
    "may vary",
    "might be",
    "possibly"
  ];

  const hasLowConfidenceIndicator = lowConfidenceIndicators.some(
    indicator => response.toLowerCase().includes(indicator.toLowerCase())
  );

  if (hasLowConfidenceIndicator || documentCount === 0) {
    return 'low';
  }

  if (documentCount >= 2) {
    return 'high';
  }

  return 'medium';
}

/**
 * Generate mock response for local development
 */
function generateMockResponse(prompt: string): string {
  if (prompt.includes('eligible')) {
    return 'Based on your profile, you qualify for this scheme because you meet all the required criteria. This scheme can provide you with financial assistance and other benefits. To apply, please visit your nearest Common Service Center with the required documents.';
  }

  if (prompt.includes('chat') || prompt.includes('question')) {
    return 'Thank you for your question. Based on the available information, government welfare schemes are designed to help citizens like you. For specific details about eligibility and benefits, please check the official scheme documents or visit your local government office.';
  }

  return 'This is a mock response for local development. In production, this would be generated by Amazon Bedrock using Claude 3 Haiku.';
}

/**
 * Sanitize user input to prevent prompt injection
 */
export function sanitizeUserInput(input: string): string {
  // Remove potential prompt injection patterns
  let sanitized = input
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();

  // Limit length
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }

  return sanitized;
}

/**
 * Check for approval promises in AI response
 */
export function containsApprovalPromise(response: string): boolean {
  const approvalKeywords = [
    'you will get',
    'you will receive',
    'guaranteed',
    'you are approved',
    'approval confirmed',
    'you will be selected',
    'definitely eligible'
  ];

  const lowerResponse = response.toLowerCase();
  return approvalKeywords.some(keyword => lowerResponse.includes(keyword));
}

/**
 * Extract follow-up suggestions from context
 */
export function generateFollowUpSuggestions(
  userQuery: string,
  userProfile: any
): string[] {
  const suggestions: string[] = [];

  if (userQuery.toLowerCase().includes('eligib')) {
    suggestions.push('What documents do I need to apply?');
    suggestions.push('How long does the application process take?');
  }

  if (userQuery.toLowerCase().includes('apply')) {
    suggestions.push('Where is the nearest application center?');
    suggestions.push('Can I apply online?');
  }

  if (userQuery.toLowerCase().includes('benefit')) {
    suggestions.push('When will I receive the benefits?');
    suggestions.push('How much financial assistance can I get?');
  }

  // Default suggestions if none matched
  if (suggestions.length === 0) {
    suggestions.push('What schemes am I eligible for?');
    suggestions.push('How do I check my application status?');
    suggestions.push('What are the eligibility criteria?');
  }

  return suggestions.slice(0, 3);
}
