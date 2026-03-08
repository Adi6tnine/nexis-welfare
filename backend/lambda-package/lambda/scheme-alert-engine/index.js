"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// @ts-nocheck
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const eligibility_v2_1 = require("../../services/eligibility-v2");
const client = new client_dynamodb_1.DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const PROFILES_TABLE = process.env.PROFILES_TABLE || 'nexis-user-profiles-dev';
const SCHEMES_TABLE = process.env.SCHEMES_TABLE || 'nexis-schemes-dev';
const ALERTS_TABLE = process.env.ALERTS_TABLE || 'nexis-alerts-dev';
const MOCK_MODE = process.env.MOCK_ALERTS === 'true';
/**
 * Scheme Alert Engine Lambda
 * Monitors user profiles and schemes to generate proactive alerts
 */
const handler = async (event) => {
    console.log('Alert Engine Event:', JSON.stringify(event, null, 2));
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { action } = body;
        switch (action) {
            case 'check_new_schemes':
                return await checkNewSchemes(body);
            case 'check_eligibility_changes':
                return await checkEligibilityChanges(body);
            case 'get_user_alerts':
                return await getUserAlerts(body);
            case 'mark_read':
                return await markAlertRead(body);
            case 'dismiss_alert':
                return await dismissAlert(body);
            default:
                return createResponse(400, { error: { code: 'INVALID_ACTION', message: 'Invalid action' } });
        }
    }
    catch (error) {
        console.error('Alert Engine Error:', error);
        return createResponse(500, {
            error: {
                code: 'INTERNAL_ERROR',
                message: error.message || 'Internal server error'
            }
        });
    }
};
exports.handler = handler;
async function checkNewSchemes(body) {
    const { userId } = body;
    if (!userId) {
        return createResponse(400, {
            error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
    }
    if (MOCK_MODE) {
        return createMockNewSchemesResponse(userId);
    }
    try {
        // Get user profile
        const profileResult = await docClient.send(new lib_dynamodb_1.GetCommand({
            TableName: PROFILES_TABLE,
            Key: { userId }
        }));
        if (!profileResult.Item) {
            return createResponse(404, {
                error: { code: 'PROFILE_NOT_FOUND', message: 'User profile not found' }
            });
        }
        const userProfile = profileResult.Item;
        // Get schemes added in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const schemesResult = await docClient.send(new lib_dynamodb_1.ScanCommand({
            TableName: SCHEMES_TABLE,
            FilterExpression: 'createdAt > :sevenDaysAgo',
            ExpressionAttributeValues: {
                ':sevenDaysAgo': sevenDaysAgo
            }
        }));
        const newSchemes = schemesResult.Items || [];
        const alerts = [];
        // Check eligibility for each new scheme
        for (const scheme of newSchemes) {
            const eligibility = await (0, eligibility_v2_1.evaluateEligibilityV2)(userProfile, scheme);
            if (eligibility.status === 'eligible' || eligibility.status === 'potentially_eligible') {
                const alert = {
                    alertId: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    userId,
                    type: 'new_scheme',
                    priority: eligibility.status === 'eligible' ? 'high' : 'medium',
                    title: `New Scheme: ${scheme.name}`,
                    message: `A new scheme "${scheme.name}" has been launched and you may be eligible! Match score: ${Math.round(eligibility.matchScore)}%`,
                    schemeId: scheme.schemeId,
                    schemeName: scheme.name,
                    actionUrl: `/schemes/${scheme.schemeId}`,
                    actionText: 'View Details',
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                    read: false,
                    metadata: {
                        matchScore: eligibility.matchScore,
                        confidence: eligibility.confidence
                    }
                };
                // Save alert
                await docClient.send(new lib_dynamodb_1.PutCommand({
                    TableName: ALERTS_TABLE,
                    Item: alert
                }));
                alerts.push(alert);
            }
        }
        return createResponse(200, {
            success: true,
            data: {
                alertsCreated: alerts.length,
                alerts
            }
        });
    }
    catch (error) {
        console.error('Check new schemes error:', error);
        throw error;
    }
}
async function checkEligibilityChanges(body) {
    const { userId } = body;
    if (!userId) {
        return createResponse(400, {
            error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
    }
    if (MOCK_MODE) {
        return createMockEligibilityChangesResponse(userId);
    }
    try {
        // Get user profile
        const profileResult = await docClient.send(new lib_dynamodb_1.GetCommand({
            TableName: PROFILES_TABLE,
            Key: { userId }
        }));
        if (!profileResult.Item) {
            return createResponse(404, {
                error: { code: 'PROFILE_NOT_FOUND', message: 'User profile not found' }
            });
        }
        const userProfile = profileResult.Item;
        const alerts = [];
        // Check for upcoming age-based eligibility
        if (userProfile.age) {
            const currentAge = userProfile.age;
            // Check for schemes that become eligible at age 60 (senior citizen)
            if (currentAge >= 58 && currentAge < 60) {
                const yearsUntil60 = 60 - currentAge;
                const alert = {
                    alertId: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    userId,
                    type: 'eligibility_change',
                    priority: 'medium',
                    title: 'Upcoming Eligibility: Senior Citizen Schemes',
                    message: `You will become eligible for senior citizen schemes in ${yearsUntil60} year(s). Start preparing your documents now!`,
                    actionUrl: '/schemes?category=senior-citizen',
                    actionText: 'View Schemes',
                    createdAt: new Date().toISOString(),
                    read: false,
                    metadata: {
                        currentAge,
                        targetAge: 60,
                        yearsRemaining: yearsUntil60
                    }
                };
                await docClient.send(new lib_dynamodb_1.PutCommand({
                    TableName: ALERTS_TABLE,
                    Item: alert
                }));
                alerts.push(alert);
            }
        }
        // Check for document expiration
        if (userProfile.documents) {
            for (const [docType, docData] of Object.entries(userProfile.documents)) {
                if (docData.expiryDate) {
                    const expiryDate = new Date(docData.expiryDate);
                    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
                        const alert = {
                            alertId: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            userId,
                            type: 'document_required',
                            priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
                            title: `Document Expiring Soon: ${docType}`,
                            message: `Your ${docType} will expire in ${daysUntilExpiry} days. Renew it to maintain eligibility for schemes.`,
                            actionUrl: '/documents',
                            actionText: 'Update Document',
                            createdAt: new Date().toISOString(),
                            read: false,
                            metadata: {
                                documentType: docType,
                                expiryDate: docData.expiryDate,
                                daysRemaining: daysUntilExpiry
                            }
                        };
                        await docClient.send(new lib_dynamodb_1.PutCommand({
                            TableName: ALERTS_TABLE,
                            Item: alert
                        }));
                        alerts.push(alert);
                    }
                }
            }
        }
        return createResponse(200, {
            success: true,
            data: {
                alertsCreated: alerts.length,
                alerts
            }
        });
    }
    catch (error) {
        console.error('Check eligibility changes error:', error);
        throw error;
    }
}
async function getUserAlerts(body) {
    const { userId, unreadOnly = false } = body;
    if (!userId) {
        return createResponse(400, {
            error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
    }
    if (MOCK_MODE) {
        return createMockUserAlertsResponse(userId, unreadOnly);
    }
    try {
        const queryParams = {
            TableName: ALERTS_TABLE,
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false // Most recent first
        };
        if (unreadOnly) {
            queryParams.FilterExpression = '#read = :false';
            queryParams.ExpressionAttributeNames = { '#read': 'read' };
            queryParams.ExpressionAttributeValues[':false'] = false;
        }
        const result = await docClient.send(new lib_dynamodb_1.QueryCommand(queryParams));
        const alerts = (result.Items || []);
        // Filter out expired alerts
        const now = new Date();
        const activeAlerts = alerts.filter(alert => !alert.expiresAt || new Date(alert.expiresAt) > now);
        return createResponse(200, {
            success: true,
            data: {
                alerts: activeAlerts,
                unreadCount: activeAlerts.filter(a => !a.read).length,
                totalCount: activeAlerts.length
            }
        });
    }
    catch (error) {
        console.error('Get user alerts error:', error);
        throw error;
    }
}
async function markAlertRead(body) {
    const { alertId, userId } = body;
    if (!alertId || !userId) {
        return createResponse(400, {
            error: { code: 'MISSING_FIELDS', message: 'Alert ID and User ID are required' }
        });
    }
    if (MOCK_MODE) {
        return createResponse(200, {
            success: true,
            data: { message: 'Alert marked as read' }
        });
    }
    try {
        await docClient.send(new lib_dynamodb_1.PutCommand({
            TableName: ALERTS_TABLE,
            Item: {
                alertId,
                userId,
                read: true,
                readAt: new Date().toISOString()
            }
        }));
        return createResponse(200, {
            success: true,
            data: { message: 'Alert marked as read' }
        });
    }
    catch (error) {
        console.error('Mark alert read error:', error);
        throw error;
    }
}
async function dismissAlert(body) {
    const { alertId } = body;
    if (!alertId) {
        return createResponse(400, {
            error: { code: 'MISSING_ALERT_ID', message: 'Alert ID is required' }
        });
    }
    if (MOCK_MODE) {
        return createResponse(200, {
            success: true,
            data: { message: 'Alert dismissed' }
        });
    }
    try {
        // Set expiration to now
        await docClient.send(new lib_dynamodb_1.PutCommand({
            TableName: ALERTS_TABLE,
            Item: {
                alertId,
                expiresAt: new Date().toISOString()
            }
        }));
        return createResponse(200, {
            success: true,
            data: { message: 'Alert dismissed' }
        });
    }
    catch (error) {
        console.error('Dismiss alert error:', error);
        throw error;
    }
}
// Mock responses for development
function createMockNewSchemesResponse(userId) {
    const mockAlerts = [
        {
            alertId: 'alert-mock-1',
            userId,
            type: 'new_scheme',
            priority: 'high',
            title: 'New Scheme: PM Kisan Samman Nidhi',
            message: 'A new scheme "PM Kisan Samman Nidhi" has been launched and you are eligible! Match score: 95%',
            schemeId: 'pm-kisan',
            schemeName: 'PM Kisan Samman Nidhi',
            actionUrl: '/schemes/pm-kisan',
            actionText: 'View Details',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            read: false,
            metadata: {
                matchScore: 95,
                confidence: 0.92
            }
        }
    ];
    return createResponse(200, {
        success: true,
        data: {
            alertsCreated: mockAlerts.length,
            alerts: mockAlerts
        }
    });
}
function createMockEligibilityChangesResponse(userId) {
    const mockAlerts = [
        {
            alertId: 'alert-mock-2',
            userId,
            type: 'eligibility_change',
            priority: 'medium',
            title: 'Upcoming Eligibility: Senior Citizen Schemes',
            message: 'You will become eligible for senior citizen schemes in 2 year(s). Start preparing your documents now!',
            actionUrl: '/schemes?category=senior-citizen',
            actionText: 'View Schemes',
            createdAt: new Date().toISOString(),
            read: false,
            metadata: {
                currentAge: 58,
                targetAge: 60,
                yearsRemaining: 2
            }
        }
    ];
    return createResponse(200, {
        success: true,
        data: {
            alertsCreated: mockAlerts.length,
            alerts: mockAlerts
        }
    });
}
function createMockUserAlertsResponse(userId, unreadOnly) {
    const allAlerts = [
        {
            alertId: 'alert-mock-1',
            userId,
            type: 'new_scheme',
            priority: 'high',
            title: 'New Scheme: PM Kisan Samman Nidhi',
            message: 'A new scheme "PM Kisan Samman Nidhi" has been launched and you are eligible!',
            schemeId: 'pm-kisan',
            schemeName: 'PM Kisan Samman Nidhi',
            actionUrl: '/schemes/pm-kisan',
            actionText: 'View Details',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false
        },
        {
            alertId: 'alert-mock-2',
            userId,
            type: 'deadline_reminder',
            priority: 'high',
            title: 'Application Deadline Approaching',
            message: 'Your application for "Pradhan Mantri Awas Yojana" is due in 3 days!',
            schemeId: 'pmay',
            schemeName: 'Pradhan Mantri Awas Yojana',
            actionUrl: '/applications/app-123',
            actionText: 'Complete Application',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            read: false
        },
        {
            alertId: 'alert-mock-3',
            userId,
            type: 'status_update',
            priority: 'medium',
            title: 'Application Status Updated',
            message: 'Your application for "Ayushman Bharat" has been approved!',
            schemeId: 'ayushman-bharat',
            schemeName: 'Ayushman Bharat',
            actionUrl: '/applications/app-456',
            actionText: 'View Status',
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            read: true
        }
    ];
    const filteredAlerts = unreadOnly ? allAlerts.filter(a => !a.read) : allAlerts;
    return createResponse(200, {
        success: true,
        data: {
            alerts: filteredAlerts,
            unreadCount: allAlerts.filter(a => !a.read).length,
            totalCount: allAlerts.length
        }
    });
}
function createResponse(statusCode, body) {
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
