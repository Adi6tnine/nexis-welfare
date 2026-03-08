"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putEligibilityResult = putEligibilityResult;
exports.getEligibilityResult = getEligibilityResult;
exports.queryResultsByUserId = queryResultsByUserId;
exports.putUserProfile = putUserProfile;
exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.deleteUserProfile = deleteUserProfile;
exports.putUserSession = putUserSession;
exports.getUserSession = getUserSession;
exports.putExplanationCache = putExplanationCache;
exports.getExplanationCache = getExplanationCache;
exports.putScheme = putScheme;
exports.getScheme = getScheme;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
// DynamoDB Client Configuration
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.DYNAMODB_ENDPOINT && {
        endpoint: process.env.DYNAMODB_ENDPOINT
    })
});
// Table names from environment variables
const USERS_TABLE = process.env.USERS_TABLE || 'nexis-users-dev';
const ELIGIBILITY_RESULTS_TABLE = process.env.ELIGIBILITY_RESULTS_TABLE || 'nexis-eligibility-results-dev';
const USER_SESSIONS_TABLE = process.env.USER_SESSIONS_TABLE || 'nexis-user-sessions-dev';
const SCHEMES_TABLE = process.env.SCHEMES_TABLE || 'nexis-schemes-dev';
const EXPLANATION_CACHE_TABLE = process.env.EXPLANATION_CACHE_TABLE || 'nexis-explanation-cache-dev';
// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 100; // milliseconds
/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff(operation, retries = MAX_RETRIES) {
    try {
        return await operation();
    }
    catch (error) {
        if (retries > 0 && isRetryableError(error)) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryWithBackoff(operation, retries - 1);
        }
        throw error;
    }
}
/**
 * Check if error is retryable
 */
function isRetryableError(error) {
    const retryableErrors = [
        'ProvisionedThroughputExceededException',
        'ThrottlingException',
        'RequestLimitExceeded',
        'InternalServerError',
        'ServiceUnavailable'
    ];
    return retryableErrors.includes(error.name);
}
/**
 * Store eligibility result in DynamoDB
 */
async function putEligibilityResult(result) {
    const item = {
        ...result,
        ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days TTL
    };
    const command = new client_dynamodb_1.PutItemCommand({
        TableName: ELIGIBILITY_RESULTS_TABLE,
        Item: (0, util_dynamodb_1.marshall)(item, { removeUndefinedValues: true })
    });
    await retryWithBackoff(() => dynamoDBClient.send(command));
}
/**
 * Get eligibility result by resultId
 */
async function getEligibilityResult(resultId) {
    const command = new client_dynamodb_1.GetItemCommand({
        TableName: ELIGIBILITY_RESULTS_TABLE,
        Key: (0, util_dynamodb_1.marshall)({ resultId })
    });
    const response = await retryWithBackoff(() => dynamoDBClient.send(command));
    if (!response.Item) {
        return null;
    }
    return (0, util_dynamodb_1.unmarshall)(response.Item);
}
/**
 * Query eligibility results by userId
 */
async function queryResultsByUserId(userId, limit = 10) {
    const command = new client_dynamodb_1.QueryCommand({
        TableName: ELIGIBILITY_RESULTS_TABLE,
        IndexName: 'userId-timestamp-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
            ':userId': userId
        }),
        ScanIndexForward: false, // Sort by timestamp descending
        Limit: limit
    });
    const response = await retryWithBackoff(() => dynamoDBClient.send(command));
    if (!response.Items || response.Items.length === 0) {
        return [];
    }
    return response.Items.map(item => (0, util_dynamodb_1.unmarshall)(item));
}
/**
 * Store user profile in DynamoDB
 */
async function putUserProfile(userId, profile) {
    const item = {
        userId,
        profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    const command = new client_dynamodb_1.PutItemCommand({
        TableName: USERS_TABLE,
        Item: (0, util_dynamodb_1.marshall)(item, { removeUndefinedValues: true })
    });
    await retryWithBackoff(() => dynamoDBClient.send(command));
}
/**
 * Get user profile by userId
 */
async function getUserProfile(userId) {
    const command = new client_dynamodb_1.GetItemCommand({
        TableName: USERS_TABLE,
        Key: (0, util_dynamodb_1.marshall)({ userId })
    });
    const response = await retryWithBackoff(() => dynamoDBClient.send(command));
    if (!response.Item) {
        return null;
    }
    return (0, util_dynamodb_1.unmarshall)(response.Item);
}
/**
 * Update user profile
 */
async function updateUserProfile(userId, profile) {
    const command = new client_dynamodb_1.UpdateItemCommand({
        TableName: USERS_TABLE,
        Key: (0, util_dynamodb_1.marshall)({ userId }),
        UpdateExpression: 'SET profile = :profile, updatedAt = :updatedAt',
        ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
            ':profile': profile,
            ':updatedAt': new Date().toISOString()
        })
    });
    await retryWithBackoff(() => dynamoDBClient.send(command));
}
/**
 * Delete user profile
 */
async function deleteUserProfile(userId) {
    const command = new client_dynamodb_1.DeleteItemCommand({
        TableName: USERS_TABLE,
        Key: (0, util_dynamodb_1.marshall)({ userId })
    });
    await retryWithBackoff(() => dynamoDBClient.send(command));
}
/**
 * Store conversation session
 */
async function putUserSession(sessionId, session) {
    const item = {
        ...session,
        sessionId,
        ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days TTL
    };
    const command = new client_dynamodb_1.PutItemCommand({
        TableName: USER_SESSIONS_TABLE,
        Item: (0, util_dynamodb_1.marshall)(item, { removeUndefinedValues: true })
    });
    await retryWithBackoff(() => dynamoDBClient.send(command));
}
/**
 * Get conversation session
 */
async function getUserSession(sessionId) {
    const command = new client_dynamodb_1.GetItemCommand({
        TableName: USER_SESSIONS_TABLE,
        Key: (0, util_dynamodb_1.marshall)({ sessionId })
    });
    const response = await retryWithBackoff(() => dynamoDBClient.send(command));
    if (!response.Item) {
        return null;
    }
    return (0, util_dynamodb_1.unmarshall)(response.Item);
}
/**
 * Store AI explanation in cache
 */
async function putExplanationCache(cacheKey, explanation, alternativeSchemes) {
    const item = {
        cacheKey,
        explanation,
        alternativeSchemes,
        generatedAt: new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days TTL
    };
    const command = new client_dynamodb_1.PutItemCommand({
        TableName: EXPLANATION_CACHE_TABLE,
        Item: (0, util_dynamodb_1.marshall)(item, { removeUndefinedValues: true })
    });
    await retryWithBackoff(() => dynamoDBClient.send(command));
}
/**
 * Get AI explanation from cache
 */
async function getExplanationCache(cacheKey) {
    const command = new client_dynamodb_1.GetItemCommand({
        TableName: EXPLANATION_CACHE_TABLE,
        Key: (0, util_dynamodb_1.marshall)({ cacheKey })
    });
    const response = await retryWithBackoff(() => dynamoDBClient.send(command));
    if (!response.Item) {
        return null;
    }
    return (0, util_dynamodb_1.unmarshall)(response.Item);
}
/**
 * Store scheme metadata
 */
async function putScheme(scheme) {
    const item = {
        ...scheme,
        createdAt: scheme.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: (scheme.version || 0) + 1
    };
    const command = new client_dynamodb_1.PutItemCommand({
        TableName: SCHEMES_TABLE,
        Item: (0, util_dynamodb_1.marshall)(item, { removeUndefinedValues: true })
    });
    await retryWithBackoff(() => dynamoDBClient.send(command));
}
/**
 * Get scheme by schemeId
 */
async function getScheme(schemeId) {
    const command = new client_dynamodb_1.GetItemCommand({
        TableName: SCHEMES_TABLE,
        Key: (0, util_dynamodb_1.marshall)({ schemeId })
    });
    const response = await retryWithBackoff(() => dynamoDBClient.send(command));
    if (!response.Item) {
        return null;
    }
    return (0, util_dynamodb_1.unmarshall)(response.Item);
}
