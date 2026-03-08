"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const uuid_1 = require("uuid");
const dynamodb_1 = require("../../services/dynamodb");
const bedrock_1 = require("../../services/bedrock");
const rag_1 = require("../../services/rag");
/**
 * Chat Assistant Lambda Handler
 *
 * Provides conversational AI assistance for scheme-related queries using RAG
 *
 * @param event - API Gateway event
 * @returns API Gateway response
 */
async function handler(event) {
    const requestId = event.requestContext?.requestId || (0, uuid_1.v4)();
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
        const request = JSON.parse(event.body);
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
        const sanitizedMessage = (0, bedrock_1.sanitizeUserInput)(request.message);
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
        let sessionId = request.sessionId || (0, uuid_1.v4)();
        let conversationHistory = [];
        if (request.sessionId) {
            const session = await (0, dynamodb_1.getUserSession)(request.sessionId);
            if (session) {
                conversationHistory = session.conversationHistory || [];
                console.log('Retrieved conversation history', {
                    requestId,
                    sessionId,
                    messageCount: conversationHistory.length
                });
            }
            else {
                console.warn('Session not found, creating new session', {
                    requestId,
                    sessionId: request.sessionId
                });
                sessionId = (0, uuid_1.v4)();
            }
        }
        console.log('Processing chat message', {
            requestId,
            sessionId,
            messageLength: sanitizedMessage.length,
            language
        });
        // Retrieve relevant documents using RAG
        let retrievedDocuments = [];
        let sources = [];
        try {
            retrievedDocuments = await (0, rag_1.retrieveRelevantDocuments)(sanitizedMessage, {
                state: request.userProfile.state,
                occupation: request.userProfile.occupation,
                socialCategory: request.userProfile.socialCategory
            }, 3 // Max 3 documents
            );
            sources = retrievedDocuments.map((_, index) => `Document ${index + 1}`);
            console.log('Retrieved documents for RAG', {
                requestId,
                documentCount: retrievedDocuments.length
            });
        }
        catch (error) {
            console.error('Error retrieving documents', { requestId, error });
            // Continue without documents
        }
        // Generate response using Bedrock
        let aiResponse;
        try {
            aiResponse = await (0, bedrock_1.generateChatResponse)(sanitizedMessage, {
                age: request.userProfile.age,
                state: request.userProfile.state,
                occupation: request.userProfile.occupation,
                annualIncome: request.userProfile.annualIncome,
                socialCategory: request.userProfile.socialCategory
            }, conversationHistory, retrievedDocuments, language);
            // Safety check: detect approval promises
            if ((0, bedrock_1.containsApprovalPromise)(aiResponse.response)) {
                console.warn('Approval promise detected in chat response', { requestId });
                aiResponse.response = aiResponse.response.replace(/you will (get|receive)/gi, 'you may be able to get');
            }
        }
        catch (error) {
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
        const followUpSuggestions = (0, bedrock_1.generateFollowUpSuggestions)(sanitizedMessage, request.userProfile);
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
        await (0, dynamodb_1.putUserSession)(sessionId, {
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
    }
    catch (error) {
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
