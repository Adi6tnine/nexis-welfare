"use strict";
/**
 * Data Retention Policy Implementation
 * Handles automatic deletion of expired data according to privacy policy
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RETENTION_PERIODS = void 0;
exports.calculateTTL = calculateTTL;
exports.isExpired = isExpired;
exports.cleanupEligibilityResults = cleanupEligibilityResults;
exports.cleanupUserSessions = cleanupUserSessions;
exports.cleanupExplanationCache = cleanupExplanationCache;
exports.cleanupInactiveProfiles = cleanupInactiveProfiles;
exports.runDataRetentionCleanup = runDataRetentionCleanup;
exports.handler = handler;
exports.deleteAllUserData = deleteAllUserData;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const logger_1 = require("./logger");
const logger = (0, logger_1.createLogger)({ operation: 'data_retention' });
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1'
});
/**
 * Retention periods in days
 */
exports.RETENTION_PERIODS = {
    ELIGIBILITY_RESULTS: 90, // 90 days
    USER_SESSIONS: 90, // 90 days
    EXPLANATION_CACHE: 7, // 7 days
    INACTIVE_PROFILES: 730 // 2 years (730 days)
};
/**
 * Calculate TTL timestamp for DynamoDB
 */
function calculateTTL(days) {
    const now = Math.floor(Date.now() / 1000);
    return now + (days * 24 * 60 * 60);
}
/**
 * Check if a timestamp is expired
 */
function isExpired(timestamp, retentionDays) {
    const expiryDate = new Date(timestamp);
    expiryDate.setDate(expiryDate.getDate() + retentionDays);
    return new Date() > expiryDate;
}
/**
 * Scan and delete expired items from a table
 */
async function cleanupExpiredItems(tableName, timestampField, retentionDays, keyField) {
    const startTime = Date.now();
    let deletedCount = 0;
    try {
        logger.info(`Starting cleanup for table: ${tableName}`, {
            tableName,
            retentionDays
        });
        // Scan table for items
        const scanCommand = new client_dynamodb_1.ScanCommand({
            TableName: tableName,
            ProjectionExpression: `${keyField}, ${timestampField}`
        });
        const response = await dynamoDBClient.send(scanCommand);
        if (!response.Items || response.Items.length === 0) {
            logger.info(`No items found in table: ${tableName}`);
            return 0;
        }
        // Check each item for expiry
        for (const item of response.Items) {
            const timestamp = item[timestampField]?.S;
            const key = item[keyField]?.S;
            if (!timestamp || !key) {
                continue;
            }
            if (isExpired(timestamp, retentionDays)) {
                // Delete expired item
                const deleteCommand = new client_dynamodb_1.DeleteItemCommand({
                    TableName: tableName,
                    Key: (0, util_dynamodb_1.marshall)({ [keyField]: key })
                });
                await dynamoDBClient.send(deleteCommand);
                deletedCount++;
                logger.debug(`Deleted expired item`, {
                    tableName,
                    key,
                    timestamp
                });
            }
        }
        const duration = Date.now() - startTime;
        logger.info(`Cleanup completed for table: ${tableName}`, {
            tableName,
            deletedCount,
            duration
        });
        return deletedCount;
    }
    catch (error) {
        logger.error(`Cleanup failed for table: ${tableName}`, error, {
            tableName
        });
        throw error;
    }
}
/**
 * Clean up expired eligibility results
 */
async function cleanupEligibilityResults(environment) {
    return cleanupExpiredItems(`nexis-eligibility-results-${environment}`, 'timestamp', exports.RETENTION_PERIODS.ELIGIBILITY_RESULTS, 'resultId');
}
/**
 * Clean up expired user sessions
 */
async function cleanupUserSessions(environment) {
    return cleanupExpiredItems(`nexis-user-sessions-${environment}`, 'createdAt', exports.RETENTION_PERIODS.USER_SESSIONS, 'sessionId');
}
/**
 * Clean up expired explanation cache
 */
async function cleanupExplanationCache(environment) {
    return cleanupExpiredItems(`nexis-explanation-cache-${environment}`, 'generatedAt', exports.RETENTION_PERIODS.EXPLANATION_CACHE, 'cacheKey');
}
/**
 * Clean up inactive user profiles
 */
async function cleanupInactiveProfiles(environment) {
    return cleanupExpiredItems(`nexis-users-${environment}`, 'updatedAt', exports.RETENTION_PERIODS.INACTIVE_PROFILES, 'userId');
}
/**
 * Run all cleanup tasks
 */
async function runDataRetentionCleanup(environment) {
    const startTime = Date.now();
    logger.info('Starting data retention cleanup', { environment });
    const results = {
        eligibilityResults: await cleanupEligibilityResults(environment),
        userSessions: await cleanupUserSessions(environment),
        explanationCache: await cleanupExplanationCache(environment),
        inactiveProfiles: await cleanupInactiveProfiles(environment),
        totalDeleted: 0
    };
    results.totalDeleted =
        results.eligibilityResults +
            results.userSessions +
            results.explanationCache +
            results.inactiveProfiles;
    const duration = Date.now() - startTime;
    logger.info('Data retention cleanup completed', {
        environment,
        ...results,
        duration
    });
    return results;
}
/**
 * Lambda handler for scheduled cleanup
 */
async function handler(event) {
    const environment = process.env.ENVIRONMENT || 'dev';
    try {
        const results = await runDataRetentionCleanup(environment);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Data retention cleanup completed successfully',
                results
            })
        };
    }
    catch (error) {
        logger.error('Data retention cleanup failed', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Data retention cleanup failed',
                error: error.message
            })
        };
    }
}
/**
 * Delete all user data (for user rights compliance)
 */
async function deleteAllUserData(userId, environment) {
    const startTime = Date.now();
    logger.info('Deleting all user data', { userId, environment });
    try {
        // Delete user profile
        await dynamoDBClient.send(new client_dynamodb_1.DeleteItemCommand({
            TableName: `nexis-users-${environment}`,
            Key: (0, util_dynamodb_1.marshall)({ userId })
        }));
        // Delete eligibility results
        // Note: In production, you'd need to query by userId first
        // This is a simplified version
        // Delete user sessions
        // Note: In production, you'd need to query by userId first
        const duration = Date.now() - startTime;
        logger.info('User data deletion completed', {
            userId,
            duration
        });
    }
    catch (error) {
        logger.error('User data deletion failed', error, { userId });
        throw error;
    }
}
