import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import * as crypto from 'crypto';

// DynamoDB Client
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS || 'nexis-users-dev';
const JWT_SECRET = process.env.JWT_SECRET || 'nexis-secret-key-change-in-production';
const JWT_EXPIRY_DAYS = 7;

interface LambdaEvent {
  body: string;
  headers?: Record<string, string>;
  requestContext?: { requestId: string };
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

// Simple hash function (replace bcrypt for now)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
}

// Simple JWT creation (basic implementation)
function createJWT(userId: string, email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    userId,
    email,
    exp: Date.now() + (JWT_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  
  return `${header}.${payload}.${signature}`;
}

// Verify JWT
function verifyJWT(token: string): { userId: string; email: string } | null {
  try {
    const [header, payload, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
    
    if (signature !== expectedSignature) return null;
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    if (decoded.exp < Date.now()) return null;
    
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const requestId = event.requestContext?.requestId || Date.now().toString();
  const timestamp = new Date().toISOString();

  console.log('Auth request', { requestId, method: event.httpMethod, path: event.path });

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'OK' });
  }

  try {
    const path = event.path;

    if (path.includes('/register') && event.httpMethod === 'POST') {
      return await handleRegister(event, timestamp);
    }

    if (path.includes('/login') && event.httpMethod === 'POST') {
      return await handleLogin(event, timestamp);
    }

    if (path.includes('/verify') && event.httpMethod === 'GET') {
      return await handleVerify(event, timestamp);
    }

    if (path.includes('/profile') && event.httpMethod === 'PUT') {
      return await handleUpdateProfile(event, timestamp);
    }

    return createResponse(404, {
      statusCode: 404,
      timestamp,
      error: { message: 'Endpoint not found' }
    });

  } catch (error: any) {
    console.error('Error:', error);
    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Internal server error' }
    });
  }
}

async function handleRegister(event: LambdaEvent, timestamp: string): Promise<LambdaResponse> {
  if (!event.body) {
    return createResponse(400, {
      statusCode: 400,
      timestamp,
      error: { message: 'Request body required' }
    });
  }

  try {
    const { email, password, name, phone } = JSON.parse(event.body);

    if (!email || !password || !name) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'Email, password, and name are required' }
      });
    }

    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return createResponse(409, {
        statusCode: 409,
        timestamp,
        error: { message: 'User already exists' }
      });
    }

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const user: User = {
      userId,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      name,
      phone,
      createdAt: timestamp,
      lastLogin: timestamp
    };

    await docClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: user
    }));

    const token = createJWT(userId, email);
    const expiresAt = new Date(Date.now() + JWT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const { passwordHash: _, ...userWithoutPassword } = user;

    return createResponse(201, {
      statusCode: 201,
      timestamp,
      data: { user: userWithoutPassword, token, expiresAt }
    });

  } catch (error: any) {
    console.error('Register error:', error);
    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Registration failed' }
    });
  }
}

async function handleLogin(event: LambdaEvent, timestamp: string): Promise<LambdaResponse> {
  if (!event.body) {
    return createResponse(400, {
      statusCode: 400,
      timestamp,
      error: { message: 'Request body required' }
    });
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return createResponse(400, {
        statusCode: 400,
        timestamp,
        error: { message: 'Email and password required' }
      });
    }

    const user = await getUserByEmail(email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'Invalid credentials' }
      });
    }

    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: { ':lastLogin': timestamp }
    }));

    const token = createJWT(user.userId, user.email);
    const expiresAt = new Date(Date.now() + JWT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const { passwordHash: _, ...userWithoutPassword } = user;
    userWithoutPassword.lastLogin = timestamp;

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: { user: userWithoutPassword, token, expiresAt }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Login failed' }
    });
  }
}

async function handleVerify(event: LambdaEvent, timestamp: string): Promise<LambdaResponse> {
  try {
    const token = extractToken(event);
    if (!token) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'No token provided' }
      });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'Invalid token' }
      });
    }

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: { valid: true, userId: decoded.userId, email: decoded.email }
    });

  } catch (error: any) {
    console.error('Verify error:', error);
    return createResponse(401, {
      statusCode: 401,
      timestamp,
      error: { message: 'Invalid token' }
    });
  }
}

async function handleUpdateProfile(event: LambdaEvent, timestamp: string): Promise<LambdaResponse> {
  if (!event.body) {
    return createResponse(400, {
      statusCode: 400,
      timestamp,
      error: { message: 'Request body required' }
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

    const decoded = verifyJWT(token);
    if (!decoded) {
      return createResponse(401, {
        statusCode: 401,
        timestamp,
        error: { message: 'Invalid token' }
      });
    }

    const updates = JSON.parse(event.body);
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

    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues
    }));

    const user = await getUserById(decoded.userId);
    if (!user) {
      return createResponse(404, {
        statusCode: 404,
        timestamp,
        error: { message: 'User not found' }
      });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;

    return createResponse(200, {
      statusCode: 200,
      timestamp,
      data: { user: userWithoutPassword }
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    return createResponse(500, {
      statusCode: 500,
      timestamp,
      error: { message: 'Profile update failed' }
    });
  }
}

async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email.toLowerCase() }
    }));

    return result.Items && result.Items.length > 0 ? result.Items[0] as User : null;
  } catch (error) {
    console.error('Get user by email error:', error);
    return null;
  }
}

async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId }
    }));

    return result.Item as User || null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
}

function extractToken(event: LambdaEvent): string | null {
  const authHeader = event.headers?.['Authorization'] || event.headers?.['authorization'];
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}

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
