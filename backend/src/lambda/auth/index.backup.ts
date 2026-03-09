import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// DynamoDB Client
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS || 'nexis-users';
const JWT_SECRET = process.env.JWT_SECRET || 'nexis-secret-key-change-in-production';
const JWT_EXPIRY = '7d'; // 7 days

interface LambdaEvent {
  body: string;
  headers?: Record<string, string>;
  requestContext?: {
    requestId: string;
  };
  httpMethod: string;
  path: string;
}

interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

interface User {
  userId: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  createdAt: string;
  lastLogin: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Auth Lambda Handler
 * Handles user registration, login, verification, and profile management
 */
export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const requestId = event.requestContext?.requestId || Date.now().toString();
  const timestamp = new Date().toISOString();

  console.log('Auth request received', {
    requestId,
    method: event.httpMethod,
    path: event.path,
    timestamp
  });

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'OK' });
  }

  try {
    // Route based on path
    const path = event.path;

    if (path.includes('/register') && event.httpMethod === 'POST') {
      return await handleRegister(event, requestId, timestamp);
    }

    if (path.includes('/login') && event.httpMethod === 'POST') {
      return await handleLogin(event, requestId, timestamp);
    }

    if (path.includes('/verify') && event.httpMethod === 'GET') {
      return await handleVerify(event, requestId, timestamp);
    }

    if (path.includes('/profile') && event.httpMethod === 'PUT') {
      return await handleUpdateProfile(event, requestId, timestamp);
    }

    if (path.includes('/forgot-password') && event.httpMethod === 'POST') {
      return await handleForgotPassword(event, requestId, timestamp);
    }

    if (path.includes('/reset-password') && event.httpMethod === 'POST') {
      return await handleResetPassword(event, requestId, timestamp);
    }

    return createResponse(404, {
      statusCode: 404,
      timestamp,
      error: { message: 'Endpoint not found' }
    });

  } catch (error: any) {
    console.error('Unexpected error in auth handler', {
      requestId,
      error: error.message,
      stack: error.stack
    });

    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Internal server error' }
    });
  }
}

/**
 * Handle user registration
 */
async function handleRegister(
  event: LambdaEvent,
  requestId: string,
  timestamp: string
): Promise<LambdaResponse> {
  if (!event.body) {
    return createResponse(400, {
      statusCode: 400,
      timestamp,
      error: { message: 'Request body is required' }
    });
  }

  try {
    const request: RegisterRequest = JSON.parse(event.body);

    // Validate required fields
    if (!request.email || !request.password || !request.name) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'Email, password, and name are required' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'Invalid email format' }
      });
    }

    // Validate password length
    if (request.password.length < 6) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'Password must be at least 6 characters' }
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(request.email);
    if (existingUser) {
      return createResponse(409, {
        statusCode: 409,
        timestamp,
        error: { message: 'User with this email already exists' }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(request.password, 10);

    // Create user
    const userId = generateUserId();
    const user: User = {
      userId,
      email: request.email.toLowerCase(),
      passwordHash,
      name: request.name,
      phone: request.phone,
      createdAt: timestamp,
      lastLogin: timestamp
    };

    // Save to DynamoDB
    await docClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(userId)'
    }));

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Calculate expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    console.log('User registered successfully', {
      requestId,
      userId: user.userId,
      email: user.email
    });

    // Return user data (without password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;

    return createResponse(201, {
      statusCode: 201,
      timestamp,
      data: {
        user: userWithoutPassword,
        token,
        expiresAt
      }
    });

  } catch (error: any) {
    console.error('Error in handleRegister', {
      requestId,
      error: error.message
    });

    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Registration failed' }
    });
  }
}

/**
 * Handle user login
 */
async function handleLogin(
  event: LambdaEvent,
  requestId: string,
  timestamp: string
): Promise<LambdaResponse> {
  if (!event.body) {
    return createResponse(400, {
      statusCode: 400,
      timestamp,
      error: { message: 'Request body is required' }
    });
  }

  try {
    const request: LoginRequest = JSON.parse(event.body);

    // Validate required fields
    if (!request.email || !request.password) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'Email and password are required' }
      });
    }

    // Get user by email
    const user = await getUserByEmail(request.email);
    if (!user) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'Invalid email or password' }
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(request.password, user.passwordHash);
    if (!passwordValid) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'Invalid email or password' }
      });
    }

    // Update last login
    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: {
        ':lastLogin': timestamp
      }
    }));

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Calculate expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    console.log('User logged in successfully', {
      requestId,
      userId: user.userId,
      email: user.email
    });

    // Return user data (without password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;
    userWithoutPassword.lastLogin = timestamp;

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: {
        user: userWithoutPassword,
        token,
        expiresAt
      }
    });

  } catch (error: any) {
    console.error('Error in handleLogin', {
      requestId,
      error: error.message
    });

    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Login failed' }
    });
  }
}

/**
 * Handle token verification
 */
async function handleVerify(
  event: LambdaEvent,
  requestId: string,
  timestamp: string
): Promise<LambdaResponse> {
  try {
    const token = extractToken(event);
    if (!token) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'No token provided' }
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // Get user
    const user = await getUserById(decoded.userId);
    if (!user) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'User not found' }
      });
    }

    console.log('Token verified successfully', {
      requestId,
      userId: user.userId
    });

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: {
        valid: true,
        userId: user.userId,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error('Error in handleVerify', {
      requestId,
      error: error.message
    });

    return createResponse(401, {
      statusCode: 401,
      timestamp,
      error: { message: 'Invalid or expired token' }
    });
  }
}

/**
 * Handle profile update
 */
async function handleUpdateProfile(
  event: LambdaEvent,
  requestId: string,
  timestamp: string
): Promise<LambdaResponse> {
  if (!event.body) {
    return createResponse(400, {
      statusCode: 400,
      timestamp,
      error: { message: 'Request body is required' }
    });
  }

  try {
    const token = extractToken(event);
    if (!token) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'No token provided' }
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const updates = JSON.parse(event.body);

    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    if (updates.name) {
      updateExpressions.push('name = :name');
      expressionAttributeValues[':name'] = updates.name;
    }

    if (updates.phone !== undefined) {
      updateExpressions.push('phone = :phone');
      expressionAttributeValues[':phone'] = updates.phone;
    }

    if (updateExpressions.length === 0) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'No valid fields to update' }
      });
    }

    // Update user
    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues
    }));

    // Get updated user
    const user = await getUserById(decoded.userId);
    if (!user) {
      return createResponse(404, {
        statusCode: 404,
        timestamp,
        error: { message: 'User not found' }
      });
    }

    console.log('Profile updated successfully', {
      requestId,
      userId: user.userId
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error: any) {
    console.error('Error in handleUpdateProfile', {
      requestId,
      error: error.message
    });

    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Profile update failed' }
    });
  }
}

/**
 * Handle forgot password (placeholder)
 */
async function handleForgotPassword(
  event: LambdaEvent,
  requestId: string,
  timestamp: string
): Promise<LambdaResponse> {
  // TODO: Implement email sending with reset token
  console.log('Forgot password requested', { requestId });

  return createResponse(200, {
    statusCode: 200,
    timestamp,
    data: {
      message: 'Password reset email sent (not implemented yet)'
    }
  });
}

/**
 * Handle reset password (placeholder)
 */
async function handleResetPassword(
  event: LambdaEvent,
  requestId: string,
  timestamp: string
): Promise<LambdaResponse> {
  // TODO: Implement password reset with token
  console.log('Reset password requested', { requestId });

  return createResponse(200, {
    statusCode: 200,
    timestamp,
    data: {
      message: 'Password reset successful (not implemented yet)'
    }
  });
}

/**
 * Helper: Get user by email
 */
async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email.toLowerCase()
      }
    }));

    return result.Items && result.Items.length > 0 ? result.Items[0] as User : null;
  } catch (error) {
    console.error('Error getting user by email', { email, error });
    return null;
  }
}

/**
 * Helper: Get user by ID
 */
async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId }
    }));

    return result.Item as User || null;
  } catch (error) {
    console.error('Error getting user by ID', { userId, error });
    return null;
  }
}

/**
 * Helper: Generate user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Helper: Extract JWT token from headers
 */
function extractToken(event: LambdaEvent): string | null {
  const authHeader = event.headers?.['Authorization'] || event.headers?.['authorization'];
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}

/**
 * Helper: Create Lambda response
 */
function createResponse(statusCode: number, body: any): LambdaResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}
