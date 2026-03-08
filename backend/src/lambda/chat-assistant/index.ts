// UUID removed
import { getUserSession, putUserSession } from '../../services/dynamodb';
import {
  generateChatResponse,
  sanitizeUserInput,
  containsApprovalPromise,
  generateFollowUpSuggestions
} from '../../services/bedrock';
import { retrieveRelevantDocuments } from '../../services/rag';

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
    response: string;
    sources: string[];
    confidence: 'high' | 'medium' | 'low';
    followUpSuggestions: string[];
    sessionId: string;
  };
  error?: {
    message: string;
  };
}

// Request body type
interface ChatRequest {
  sessionId?: string;
  message: string;
  userProfile: {
    age: number;
    state: string;
    occupation: string;
    annualIncome: number;
    gender: string;
    socialCategory: string;
    hasDisability: boolean;
  };
  language?: 'en' | 'hi';
}

// Conversation message
interface ConversationMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

/**
 * Chat Assistant Lambda Handler
 * 
 * Provides conversational AI assistance for scheme-related queries using RAG
 * 
 * @param event - API Gateway event
 * @returns API Gateway response
 */
export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const requestId = event.requestContext?.requestId || Date.now().toString() + Math.random().toString(36);
  const timestamp = new Date().toISOString();

  console.log('Chat assistant request received', {
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
    const request: ChatRequest = JSON.parse(event.body);

    if (!request.message) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: {
          message: 'message is required'
        }
      });
    }

    if (!request.userProfile) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: {
          message: 'userProfile is required'
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

    // Sanitize user message
    const sanitizedMessage = sanitizeUserInput(request.message);

    if (sanitizedMessage.length === 0) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: {
          message: 'message cannot be empty after sanitization'
        }
      });
    }

    // Get or create session
    let sessionId = request.sessionId || Date.now().toString() + Math.random().toString(36);
    let conversationHistory: ConversationMessage[] = [];

    if (request.sessionId) {
      const session = await getUserSession(request.sessionId);
      if (session) {
        conversationHistory = session.conversationHistory || [];
        console.log('Retrieved conversation history', {
          requestId,
          sessionId,
          messageCount: conversationHistory.length
        });
      } else {
        console.warn('Session not found, creating new session', {
          requestId,
          sessionId: request.sessionId
        });
        sessionId = Date.now().toString() + Math.random().toString(36);
      }
    }

    console.log('Processing chat message', {
      requestId,
      sessionId,
      messageLength: sanitizedMessage.length,
      language
    });

    // Retrieve relevant documents using RAG
    let retrievedDocuments: string[] = [];
    let sources: string[] = [];

    try {
      retrievedDocuments = await retrieveRelevantDocuments(
        sanitizedMessage,
        {
          state: request.userProfile.state,
          occupation: request.userProfile.occupation,
          socialCategory: request.userProfile.socialCategory
        },
        3 // Max 3 documents
      );

      sources = retrievedDocuments.map((_, index) => `Document ${index + 1}`);

      console.log('Retrieved documents for RAG', {
        requestId,
        documentCount: retrievedDocuments.length
      });
    } catch (error) {
      console.error('Error retrieving documents', { requestId, error });
      // Continue without documents
    }

    // Generate response using Bedrock
    let aiResponse: { response: string; confidence: 'high' | 'medium' | 'low' };

    try {
      aiResponse = await generateChatResponse(
        sanitizedMessage,
        {
          age: request.userProfile.age,
          state: request.userProfile.state,
          occupation: request.userProfile.occupation,
          annualIncome: request.userProfile.annualIncome,
          socialCategory: request.userProfile.socialCategory
        },
        conversationHistory,
        retrievedDocuments,
        language
      );

      // Safety check: detect approval promises
      if (containsApprovalPromise(aiResponse.response)) {
        console.warn('Approval promise detected in chat response', { requestId });
        aiResponse.response = aiResponse.response.replace(
          /you will (get|receive)/gi,
          'you may be able to get'
        );
      }

    } catch (error: any) {
      console.error('Error generating chat response', { requestId, error });
      return createResponse(503, {
        statusCode: 503,
        timestamp,
        error: {
          message: 'Unable to generate response. Please try again later.'
        }
      });
    }

    // Generate follow-up suggestions
    const followUpSuggestions = generateFollowUpSuggestions(
      sanitizedMessage,
      request.userProfile
    );

    // Update conversation history
    conversationHistory.push({
      role: 'user',
      message: sanitizedMessage,
      timestamp
    });

    conversationHistory.push({
      role: 'assistant',
      message: aiResponse.response,
      timestamp
    });

    // Keep only last 10 messages (5 exchanges)
    const MAX_MESSAGES = 10;
    if (conversationHistory.length > MAX_MESSAGES) {
      conversationHistory = conversationHistory.slice(-MAX_MESSAGES);
    }

    // Store updated session
    await putUserSession(sessionId, {
      conversationHistory,
      createdAt: conversationHistory[0]?.timestamp || timestamp,
      lastActivity: timestamp
    }).catch(error => {
      console.error('Failed to store session', { requestId, error });
      // Don't fail the request if storage fails
    });

    console.log('Chat response generated successfully', {
      requestId,
      sessionId,
      responseLength: aiResponse.response.length,
      confidence: aiResponse.confidence,
      sourceCount: sources.length
    });

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: {
        response: aiResponse.response,
        sources,
        confidence: aiResponse.confidence,
        followUpSuggestions,
        sessionId
      }
    });

  } catch (error: any) {
    console.error('Unexpected error in chat assistant', {
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
