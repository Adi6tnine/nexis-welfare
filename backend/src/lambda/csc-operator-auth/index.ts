import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { createHash, randomBytes } from 'crypto';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const OPERATORS_TABLE = process.env.OPERATORS_TABLE || 'nexis-csc-operators-dev';
const SESSIONS_TABLE = process.env.SESSIONS_TABLE || 'nexis-csc-sessions-dev';
const MOCK_MODE = process.env.MOCK_CSC_AUTH === 'true';

interface CSCOperator {
  operatorId: string;
  cscId: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  state: string;
  district: string;
  status: 'active' | 'suspended' | 'inactive';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  stats: {
    totalApplications: number;
    totalUsers: number;
    successRate: number;
  };
}

interface CSCSession {
  sessionId: string;
  operatorId: string;
  cscId: string;
  createdAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * CSC Operator Authentication Lambda
 * Handles login, session management, and operator verification
 */
export const handler = async (event: any) => {
  console.log('CSC Auth Event:', JSON.stringify(event, null, 2));

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action } = body;

    switch (action) {
      case 'login':
        return await handleLogin(body);
      case 'verify_session':
        return await handleVerifySession(body);
      case 'logout':
        return await handleLogout(body);
      case 'register':
        return await handleRegister(body);
      case 'get_operator':
        return await handleGetOperator(body);
      default:
        return createResponse(400, { error: { code: 'INVALID_ACTION', message: 'Invalid action' } });
    }
  } catch (error: any) {
    console.error('CSC Auth Error:', error);
    return createResponse(500, {
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Internal server error'
      }
    });
  }
};

async function handleLogin(body: any) {
  const { email, password, cscId } = body;

  if (!email || !password) {
    return createResponse(400, {
      error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required' }
    });
  }

  if (MOCK_MODE) {
    return createMockLoginResponse(email, cscId);
  }

  try {
    // Query operator by email
    const queryResult = await docClient.send(new QueryCommand({
      TableName: OPERATORS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return createResponse(401, {
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const operator = queryResult.Items[0] as CSCOperator;

    // Verify password
    const passwordHash = hashPassword(password);
    if (operator.passwordHash !== passwordHash) {
      return createResponse(401, {
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    // Check operator status
    if (operator.status !== 'active') {
      return createResponse(403, {
        error: { code: 'ACCOUNT_SUSPENDED', message: 'Your account has been suspended. Contact support.' }
      });
    }

    // Create session
    const session = await createSession(operator);

    // Update last login
    await docClient.send(new UpdateCommand({
      TableName: OPERATORS_TABLE,
      Key: { operatorId: operator.operatorId },
      UpdateExpression: 'SET lastLogin = :now',
      ExpressionAttributeValues: {
        ':now': new Date().toISOString()
      }
    }));

    return createResponse(200, {
      success: true,
      data: {
        sessionId: session.sessionId,
        operator: {
          operatorId: operator.operatorId,
          cscId: operator.cscId,
          name: operator.name,
          email: operator.email,
          phone: operator.phone,
          state: operator.state,
          district: operator.district,
          permissions: operator.permissions,
          stats: operator.stats
        },
        expiresAt: session.expiresAt
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

async function handleVerifySession(body: any) {
  const { sessionId } = body;

  if (!sessionId) {
    return createResponse(400, {
      error: { code: 'MISSING_SESSION', message: 'Session ID is required' }
    });
  }

  if (MOCK_MODE) {
    return createMockVerifyResponse(sessionId);
  }

  try {
    const result = await docClient.send(new GetCommand({
      TableName: SESSIONS_TABLE,
      Key: { sessionId }
    }));

    if (!result.Item) {
      return createResponse(401, {
        error: { code: 'INVALID_SESSION', message: 'Session not found or expired' }
      });
    }

    const session = result.Item as CSCSession;

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      return createResponse(401, {
        error: { code: 'SESSION_EXPIRED', message: 'Session has expired. Please login again.' }
      });
    }

    // Get operator details
    const operatorResult = await docClient.send(new GetCommand({
      TableName: OPERATORS_TABLE,
      Key: { operatorId: session.operatorId }
    }));

    if (!operatorResult.Item) {
      return createResponse(404, {
        error: { code: 'OPERATOR_NOT_FOUND', message: 'Operator not found' }
      });
    }

    const operator = operatorResult.Item as CSCOperator;

    return createResponse(200, {
      success: true,
      data: {
        valid: true,
        operator: {
          operatorId: operator.operatorId,
          cscId: operator.cscId,
          name: operator.name,
          email: operator.email,
          permissions: operator.permissions,
          stats: operator.stats
        }
      }
    });
  } catch (error: any) {
    console.error('Verify session error:', error);
    throw error;
  }
}

async function handleLogout(body: any) {
  const { sessionId } = body;

  if (!sessionId) {
    return createResponse(400, {
      error: { code: 'MISSING_SESSION', message: 'Session ID is required' }
    });
  }

  if (MOCK_MODE) {
    return createResponse(200, {
      success: true,
      data: { message: 'Logged out successfully' }
    });
  }

  try {
    // Delete session
    await docClient.send(new UpdateCommand({
      TableName: SESSIONS_TABLE,
      Key: { sessionId },
      UpdateExpression: 'SET expiresAt = :now',
      ExpressionAttributeValues: {
        ':now': new Date().toISOString()
      }
    }));

    return createResponse(200, {
      success: true,
      data: { message: 'Logged out successfully' }
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    throw error;
  }
}

async function handleRegister(body: any) {
  const { cscId, name, email, password, phone, state, district } = body;

  if (!cscId || !name || !email || !password || !phone || !state || !district) {
    return createResponse(400, {
      error: { code: 'MISSING_FIELDS', message: 'All fields are required' }
    });
  }

  if (MOCK_MODE) {
    return createMockRegisterResponse(email, cscId, name);
  }

  try {
    // Check if email already exists
    const existingOperator = await docClient.send(new QueryCommand({
      TableName: OPERATORS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }));

    if (existingOperator.Items && existingOperator.Items.length > 0) {
      return createResponse(409, {
        error: { code: 'EMAIL_EXISTS', message: 'Email already registered' }
      });
    }

    // Create operator
    const operatorId = `op-${Date.now()}-${randomBytes(4).toString('hex')}`;
    const operator: CSCOperator = {
      operatorId,
      cscId,
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
      state,
      district,
      status: 'active',
      permissions: ['create_profile', 'view_schemes', 'submit_application', 'track_application'],
      createdAt: new Date().toISOString(),
      stats: {
        totalApplications: 0,
        totalUsers: 0,
        successRate: 0
      }
    };

    await docClient.send(new PutCommand({
      TableName: OPERATORS_TABLE,
      Item: operator
    }));

    return createResponse(201, {
      success: true,
      data: {
        operatorId: operator.operatorId,
        message: 'Operator registered successfully'
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    throw error;
  }
}

async function handleGetOperator(body: any) {
  const { operatorId } = body;

  if (!operatorId) {
    return createResponse(400, {
      error: { code: 'MISSING_OPERATOR_ID', message: 'Operator ID is required' }
    });
  }

  if (MOCK_MODE) {
    return createMockOperatorResponse(operatorId);
  }

  try {
    const result = await docClient.send(new GetCommand({
      TableName: OPERATORS_TABLE,
      Key: { operatorId }
    }));

    if (!result.Item) {
      return createResponse(404, {
        error: { code: 'OPERATOR_NOT_FOUND', message: 'Operator not found' }
      });
    }

    const operator = result.Item as CSCOperator;

    return createResponse(200, {
      success: true,
      data: {
        operator: {
          operatorId: operator.operatorId,
          cscId: operator.cscId,
          name: operator.name,
          email: operator.email,
          phone: operator.phone,
          state: operator.state,
          district: operator.district,
          status: operator.status,
          permissions: operator.permissions,
          stats: operator.stats,
          createdAt: operator.createdAt,
          lastLogin: operator.lastLogin
        }
      }
    });
  } catch (error: any) {
    console.error('Get operator error:', error);
    throw error;
  }
}

async function createSession(operator: CSCOperator): Promise<CSCSession> {
  const sessionId = `sess-${Date.now()}-${randomBytes(8).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8 hours

  const session: CSCSession = {
    sessionId,
    operatorId: operator.operatorId,
    cscId: operator.cscId,
    createdAt: new Date().toISOString(),
    expiresAt
  };

  await docClient.send(new PutCommand({
    TableName: SESSIONS_TABLE,
    Item: session
  }));

  return session;
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Mock responses for development
function createMockLoginResponse(email: string, cscId?: string) {
  const operatorId = `op-mock-${Date.now()}`;
  const sessionId = `sess-mock-${Date.now()}`;

  return createResponse(200, {
    success: true,
    data: {
      sessionId,
      operator: {
        operatorId,
        cscId: cscId || 'CSC-MH-001',
        name: 'Mock Operator',
        email,
        phone: '+91-9876543210',
        state: 'Maharashtra',
        district: 'Mumbai',
        permissions: ['create_profile', 'view_schemes', 'submit_application', 'track_application'],
        stats: {
          totalApplications: 45,
          totalUsers: 32,
          successRate: 87.5
        }
      },
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  });
}

function createMockVerifyResponse(sessionId: string) {
  return createResponse(200, {
    success: true,
    data: {
      valid: true,
      operator: {
        operatorId: 'op-mock-123',
        cscId: 'CSC-MH-001',
        name: 'Mock Operator',
        email: 'operator@csc.gov.in',
        permissions: ['create_profile', 'view_schemes', 'submit_application', 'track_application'],
        stats: {
          totalApplications: 45,
          totalUsers: 32,
          successRate: 87.5
        }
      }
    }
  });
}

function createMockRegisterResponse(email: string, cscId: string, name: string) {
  return createResponse(201, {
    success: true,
    data: {
      operatorId: `op-mock-${Date.now()}`,
      message: 'Operator registered successfully'
    }
  });
}

function createMockOperatorResponse(operatorId: string) {
  return createResponse(200, {
    success: true,
    data: {
      operator: {
        operatorId,
        cscId: 'CSC-MH-001',
        name: 'Mock Operator',
        email: 'operator@csc.gov.in',
        phone: '+91-9876543210',
        state: 'Maharashtra',
        district: 'Mumbai',
        status: 'active',
        permissions: ['create_profile', 'view_schemes', 'submit_application', 'track_application'],
        stats: {
          totalApplications: 45,
          totalUsers: 32,
          successRate: 87.5
        },
        createdAt: '2026-01-01T00:00:00.000Z',
        lastLogin: new Date().toISOString()
      }
    }
  });
}

function createResponse(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}
