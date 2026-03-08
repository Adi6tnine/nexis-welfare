import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { EligibilityResult } from '../models';

// DynamoDB Client Configuration
const dynamoDBClient = new DynamoDBClient({
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
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
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
function isRetryableError(error: any): boolean {
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
export async function putEligibilityResult(result: EligibilityResult): Promise<void> {
  const item = {
    ...result,
    ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days TTL
  };

  const command = new PutItemCommand({
    TableName: ELIGIBILITY_RESULTS_TABLE,
    Item: marshall(item, { removeUndefinedValues: true })
  });

  await retryWithBackoff(() => dynamoDBClient.send(command));
}

/**
 * Get eligibility result by resultId
 */
export async function getEligibilityResult(resultId: string): Promise<EligibilityResult | null> {
  const command = new GetItemCommand({
    TableName: ELIGIBILITY_RESULTS_TABLE,
    Key: marshall({ resultId })
  });

  const response = await retryWithBackoff(() => dynamoDBClient.send(command));

  if (!response.Item) {
    return null;
  }

  return unmarshall(response.Item) as EligibilityResult;
}

/**
 * Query eligibility results by userId
 */
export async function queryResultsByUserId(
  userId: string,
  limit = 10
): Promise<EligibilityResult[]> {
  const command = new QueryCommand({
    TableName: ELIGIBILITY_RESULTS_TABLE,
    IndexName: 'userId-timestamp-index',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: marshall({
      ':userId': userId
    }),
    ScanIndexForward: false, // Sort by timestamp descending
    Limit: limit
  });

  const response = await retryWithBackoff(() => dynamoDBClient.send(command));

  if (!response.Items || response.Items.length === 0) {
    return [];
  }

  return response.Items.map(item => unmarshall(item) as EligibilityResult);
}

/**
 * Store user profile in DynamoDB
 */
export async function putUserProfile(userId: string, profile: any): Promise<void> {
  const item = {
    userId,
    profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const command = new PutItemCommand({
    TableName: USERS_TABLE,
    Item: marshall(item, { removeUndefinedValues: true })
  });

  await retryWithBackoff(() => dynamoDBClient.send(command));
}

/**
 * Get user profile by userId
 */
export async function getUserProfile(userId: string): Promise<any | null> {
  const command = new GetItemCommand({
    TableName: USERS_TABLE,
    Key: marshall({ userId })
  });

  const response = await retryWithBackoff(() => dynamoDBClient.send(command));

  if (!response.Item) {
    return null;
  }

  return unmarshall(response.Item);
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, profile: any): Promise<void> {
  const command = new UpdateItemCommand({
    TableName: USERS_TABLE,
    Key: marshall({ userId }),
    UpdateExpression: 'SET profile = :profile, updatedAt = :updatedAt',
    ExpressionAttributeValues: marshall({
      ':profile': profile,
      ':updatedAt': new Date().toISOString()
    })
  });

  await retryWithBackoff(() => dynamoDBClient.send(command));
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  const command = new DeleteItemCommand({
    TableName: USERS_TABLE,
    Key: marshall({ userId })
  });

  await retryWithBackoff(() => dynamoDBClient.send(command));
}

/**
 * Store conversation session
 */
export async function putUserSession(sessionId: string, session: any): Promise<void> {
  const item = {
    ...session,
    sessionId,
    ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days TTL
  };

  const command = new PutItemCommand({
    TableName: USER_SESSIONS_TABLE,
    Item: marshall(item, { removeUndefinedValues: true })
  });

  await retryWithBackoff(() => dynamoDBClient.send(command));
}

/**
 * Get conversation session
 */
export async function getUserSession(sessionId: string): Promise<any | null> {
  const command = new GetItemCommand({
    TableName: USER_SESSIONS_TABLE,
    Key: marshall({ sessionId })
  });

  const response = await retryWithBackoff(() => dynamoDBClient.send(command));

  if (!response.Item) {
    return null;
  }

  return unmarshall(response.Item);
}

/**
 * Store AI explanation in cache
 */
export async function putExplanationCache(
  cacheKey: string,
  explanation: string,
  alternativeSchemes: string[]
): Promise<void> {
  const item = {
    cacheKey,
    explanation,
    alternativeSchemes,
    generatedAt: new Date().toISOString(),
    ttl: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days TTL
  };

  const command = new PutItemCommand({
    TableName: EXPLANATION_CACHE_TABLE,
    Item: marshall(item, { removeUndefinedValues: true })
  });

  await retryWithBackoff(() => dynamoDBClient.send(command));
}

/**
 * Get AI explanation from cache
 */
export async function getExplanationCache(cacheKey: string): Promise<any | null> {
  const command = new GetItemCommand({
    TableName: EXPLANATION_CACHE_TABLE,
    Key: marshall({ cacheKey })
  });

  const response = await retryWithBackoff(() => dynamoDBClient.send(command));

  if (!response.Item) {
    return null;
  }

  return unmarshall(response.Item);
}

/**
 * Store scheme metadata
 */
export async function putScheme(scheme: any): Promise<void> {
  const item = {
    ...scheme,
    createdAt: scheme.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: (scheme.version || 0) + 1
  };

  const command = new PutItemCommand({
    TableName: SCHEMES_TABLE,
    Item: marshall(item, { removeUndefinedValues: true })
  });

  await retryWithBackoff(() => dynamoDBClient.send(command));
}

/**
 * Get scheme by schemeId
 */
export async function getScheme(schemeId: string): Promise<any | null> {
  const command = new GetItemCommand({
    TableName: SCHEMES_TABLE,
    Key: marshall({ schemeId })
  });

  const response = await retryWithBackoff(() => dynamoDBClient.send(command));

  if (!response.Item) {
    return null;
  }

  return unmarshall(response.Item);
}
