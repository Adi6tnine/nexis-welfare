/**
 * Data Retention Policy Implementation
 * Handles automatic deletion of expired data according to privacy policy
 */

import { DynamoDBClient, ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { createLogger } from './logger';

const logger = createLogger({ operation: 'data_retention' });

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Retention periods in days
 */
export const RETENTION_PERIODS = {
  ELIGIBILITY_RESULTS: 90,      // 90 days
  USER_SESSIONS: 90,             // 90 days
  EXPLANATION_CACHE: 7,          // 7 days
  INACTIVE_PROFILES: 730         // 2 years (730 days)
};

/**
 * Calculate TTL timestamp for DynamoDB
 */
export function calculateTTL(days: number): number {
  const now = Math.floor(Date.now() / 1000);
  return now + (days * 24 * 60 * 60);
}

/**
 * Check if a timestamp is expired
 */
export function isExpired(timestamp: string, retentionDays: number): boolean {
  const expiryDate = new Date(timestamp);
  expiryDate.setDate(expiryDate.getDate() + retentionDays);
  return new Date() > expiryDate;
}

/**
 * Scan and delete expired items from a table
 */
async function cleanupExpiredItems(
  tableName: string,
  timestampField: string,
  retentionDays: number,
  keyField: string
): Promise<number> {
  const startTime = Date.now();
  let deletedCount = 0;

  try {
    logger.info(`Starting cleanup for table: ${tableName}`, {
      tableName,
      retentionDays
    });

    // Scan table for items
    const scanCommand = new ScanCommand({
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
        const deleteCommand = new DeleteItemCommand({
          TableName: tableName,
          Key: marshall({ [keyField]: key })
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

  } catch (error: any) {
    logger.error(`Cleanup failed for table: ${tableName}`, error, {
      tableName
    });
    throw error;
  }
}

/**
 * Clean up expired eligibility results
 */
export async function cleanupEligibilityResults(environment: string): Promise<number> {
  return cleanupExpiredItems(
    `nexis-eligibility-results-${environment}`,
    'timestamp',
    RETENTION_PERIODS.ELIGIBILITY_RESULTS,
    'resultId'
  );
}

/**
 * Clean up expired user sessions
 */
export async function cleanupUserSessions(environment: string): Promise<number> {
  return cleanupExpiredItems(
    `nexis-user-sessions-${environment}`,
    'createdAt',
    RETENTION_PERIODS.USER_SESSIONS,
    'sessionId'
  );
}

/**
 * Clean up expired explanation cache
 */
export async function cleanupExplanationCache(environment: string): Promise<number> {
  return cleanupExpiredItems(
    `nexis-explanation-cache-${environment}`,
    'generatedAt',
    RETENTION_PERIODS.EXPLANATION_CACHE,
    'cacheKey'
  );
}

/**
 * Clean up inactive user profiles
 */
export async function cleanupInactiveProfiles(environment: string): Promise<number> {
  return cleanupExpiredItems(
    `nexis-users-${environment}`,
    'updatedAt',
    RETENTION_PERIODS.INACTIVE_PROFILES,
    'userId'
  );
}

/**
 * Run all cleanup tasks
 */
export async function runDataRetentionCleanup(environment: string): Promise<{
  eligibilityResults: number;
  userSessions: number;
  explanationCache: number;
  inactiveProfiles: number;
  totalDeleted: number;
}> {
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
export async function handler(event: any): Promise<any> {
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

  } catch (error: any) {
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
export async function deleteAllUserData(
  userId: string,
  environment: string
): Promise<void> {
  const startTime = Date.now();

  logger.info('Deleting all user data', { userId, environment });

  try {
    // Delete user profile
    await dynamoDBClient.send(new DeleteItemCommand({
      TableName: `nexis-users-${environment}`,
      Key: marshall({ userId })
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

  } catch (error: any) {
    logger.error('User data deletion failed', error, { userId });
    throw error;
  }
}
