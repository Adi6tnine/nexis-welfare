"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
// @ts-nocheck
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const models_1 = require("../../models");
const dynamodb_1 = require("../../services/dynamodb");
/**
 * Profile Manager Lambda Handler
 *
 * Handles CRUD operations for user profiles
 *
 * Routes:
 * - POST /profiles - Create new profile
 * - GET /profiles/{userId} - Get profile by ID
 * - PUT /profiles/{userId} - Update profile
 * - DELETE /profiles/{userId} - Delete profile
 *
 * @param event - API Gateway event
 * @returns API Gateway response
 */
async function handler(event) {
    const requestId = event.requestContext?.requestId || (0, uuid_1.v4)();
    const timestamp = new Date().toISOString();
    const method = event.httpMethod;
    console.log('Profile manager request received', {
        requestId,
        method,
        path: event.path,
        timestamp
    });
    try {
        // Route to appropriate handler based on HTTP method
        switch (method) {
            case 'POST':
                return await handleCreateProfile(event, requestId, timestamp);
            case 'GET':
                return await handleGetProfile(event, requestId, timestamp);
            case 'PUT':
                return await handleUpdateProfile(event, requestId, timestamp);
            case 'DELETE':
                return await handleDeleteProfile(event, requestId, timestamp);
            default:
                return createResponse(405, {
                    statusCode: 405,
                    timestamp,
                    error: {
                        message: `Method ${method} not allowed`
                    }
                });
        }
    }
    catch (error) {
        console.error('Unexpected error in profile manager', {
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
 * Handle POST /profiles - Create new profile
 */
async function handleCreateProfile(event, requestId, timestamp) {
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
        const requestBody = JSON.parse(event.body);
        const { profile } = requestBody;
        if (!profile) {
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'Profile data is required'
                }
            });
        }
        // Validate profile
        let validatedProfile;
        try {
            validatedProfile = (0, models_1.validateUserProfile)(profile);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const validationErrors = (0, models_1.formatValidationErrors)(error);
                console.warn('Profile validation failed', { requestId, validationErrors });
                return createResponse(400, {
                    statusCode: 400,
                    timestamp,
                    error: {
                        message: 'Invalid profile data',
                        validationErrors
                    }
                });
            }
            throw error;
        }
        // Generate userId
        const userId = (0, uuid_1.v4)();
        // Add metadata
        const profileWithMetadata = {
            ...validatedProfile,
            userId,
            createdAt: timestamp,
            updatedAt: timestamp
        };
        // Store in DynamoDB
        await (0, dynamodb_1.putUserProfile)(userId, profileWithMetadata);
        console.log('Profile created successfully', { requestId, userId });
        return createResponse(201, {
            statusCode: 201,
            timestamp,
            data: {
                userId,
                profile: profileWithMetadata,
                message: 'Profile created successfully'
            }
        });
    }
    catch (error) {
        console.error('Error creating profile', { requestId, error });
        throw error;
    }
}
/**
 * Handle GET /profiles/{userId} - Get profile by ID
 */
async function handleGetProfile(event, requestId, timestamp) {
    const userId = event.pathParameters?.userId;
    if (!userId) {
        return createResponse(400, {
            statusCode: 400,
            timestamp,
            error: {
                message: 'userId path parameter is required'
            }
        });
    }
    try {
        // Fetch profile from DynamoDB
        const userRecord = await (0, dynamodb_1.getUserProfile)(userId);
        if (!userRecord) {
            console.warn('Profile not found', { requestId, userId });
            return createResponse(404, {
                statusCode: 404,
                timestamp,
                error: {
                    message: 'Profile not found'
                }
            });
        }
        console.log('Profile retrieved successfully', { requestId, userId });
        return createResponse(200, {
            statusCode: 200,
            timestamp,
            data: {
                userId: userRecord.userId,
                profile: userRecord.profile,
                createdAt: userRecord.createdAt,
                updatedAt: userRecord.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Error retrieving profile', { requestId, userId, error });
        throw error;
    }
}
/**
 * Handle PUT /profiles/{userId} - Update profile
 */
async function handleUpdateProfile(event, requestId, timestamp) {
    const userId = event.pathParameters?.userId;
    if (!userId) {
        return createResponse(400, {
            statusCode: 400,
            timestamp,
            error: {
                message: 'userId path parameter is required'
            }
        });
    }
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
        // Check if profile exists
        const existingRecord = await (0, dynamodb_1.getUserProfile)(userId);
        if (!existingRecord) {
            console.warn('Profile not found for update', { requestId, userId });
            return createResponse(404, {
                statusCode: 404,
                timestamp,
                error: {
                    message: 'Profile not found'
                }
            });
        }
        const requestBody = JSON.parse(event.body);
        const { profile } = requestBody;
        if (!profile) {
            return createResponse(400, {
                statusCode: 400,
                timestamp,
                error: {
                    message: 'Profile data is required'
                }
            });
        }
        // Validate profile
        let validatedProfile;
        try {
            validatedProfile = (0, models_1.validateUserProfile)(profile);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const validationErrors = (0, models_1.formatValidationErrors)(error);
                console.warn('Profile validation failed', { requestId, validationErrors });
                return createResponse(400, {
                    statusCode: 400,
                    timestamp,
                    error: {
                        message: 'Invalid profile data',
                        validationErrors
                    }
                });
            }
            throw error;
        }
        // Add metadata
        const profileWithMetadata = {
            ...validatedProfile,
            userId,
            createdAt: existingRecord.createdAt,
            updatedAt: timestamp
        };
        // Update in DynamoDB
        await (0, dynamodb_1.updateUserProfile)(userId, profileWithMetadata);
        console.log('Profile updated successfully', { requestId, userId });
        return createResponse(200, {
            statusCode: 200,
            timestamp,
            data: {
                userId,
                profile: profileWithMetadata,
                message: 'Profile updated successfully'
            }
        });
    }
    catch (error) {
        console.error('Error updating profile', { requestId, userId, error });
        throw error;
    }
}
/**
 * Handle DELETE /profiles/{userId} - Delete profile
 */
async function handleDeleteProfile(event, requestId, timestamp) {
    const userId = event.pathParameters?.userId;
    if (!userId) {
        return createResponse(400, {
            statusCode: 400,
            timestamp,
            error: {
                message: 'userId path parameter is required'
            }
        });
    }
    try {
        // Check if profile exists
        const existingRecord = await (0, dynamodb_1.getUserProfile)(userId);
        if (!existingRecord) {
            console.warn('Profile not found for deletion', { requestId, userId });
            return createResponse(404, {
                statusCode: 404,
                timestamp,
                error: {
                    message: 'Profile not found'
                }
            });
        }
        // Delete from DynamoDB
        await (0, dynamodb_1.deleteUserProfile)(userId);
        console.log('Profile deleted successfully', { requestId, userId });
        return createResponse(200, {
            statusCode: 200,
            timestamp,
            data: {
                userId,
                message: 'Profile deleted successfully'
            }
        });
    }
    catch (error) {
        console.error('Error deleting profile', { requestId, userId, error });
        throw error;
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
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        body: JSON.stringify(body)
    };
}
