"use strict";
/**
 * Structured logging utility for NEXIS backend
 * Provides consistent log format with PII redaction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
exports.createLogger = createLogger;
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * PII patterns to redact from logs
 */
const PII_PATTERNS = [
    // Aadhar number (12 digits)
    { pattern: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '****-****-****' },
    // PAN card (ABCDE1234F)
    { pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g, replacement: '*****1234*' },
    // Email addresses
    { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '***@***.***' },
    // Phone numbers (10 digits)
    { pattern: /\b\d{10}\b/g, replacement: '**********' },
    // Bank account numbers (9-18 digits)
    { pattern: /\b\d{9,18}\b/g, replacement: '************' }
];
/**
 * Redact PII from log messages and context
 */
function redactPII(value) {
    if (typeof value === 'string') {
        let redacted = value;
        for (const { pattern, replacement } of PII_PATTERNS) {
            redacted = redacted.replace(pattern, replacement);
        }
        return redacted;
    }
    if (Array.isArray(value)) {
        return value.map(redactPII);
    }
    if (typeof value === 'object' && value !== null) {
        const redacted = {};
        for (const [key, val] of Object.entries(value)) {
            // Redact sensitive field names
            if (['password', 'token', 'secret', 'apiKey', 'accessToken'].includes(key)) {
                redacted[key] = '***REDACTED***';
            }
            else {
                redacted[key] = redactPII(val);
            }
        }
        return redacted;
    }
    return value;
}
/**
 * Create structured log entry
 */
function createLogEntry(level, message, context, error) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message: redactPII(message),
        ...(context && { context: redactPII(context) })
    };
    if (error) {
        entry.error = {
            name: error.name,
            message: redactPII(error.message),
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
        };
    }
    return entry;
}
/**
 * Log to console in structured JSON format
 */
function log(entry) {
    const output = JSON.stringify(entry);
    switch (entry.level) {
        case LogLevel.ERROR:
            console.error(output);
            break;
        case LogLevel.WARN:
            console.warn(output);
            break;
        case LogLevel.DEBUG:
            if (process.env.LOG_LEVEL === 'DEBUG') {
                console.debug(output);
            }
            break;
        default:
            console.log(output);
    }
}
/**
 * Logger class with convenience methods
 */
class Logger {
    constructor(defaultContext = {}) {
        this.defaultContext = defaultContext;
    }
    /**
     * Add context to all subsequent logs
     */
    withContext(context) {
        return new Logger({ ...this.defaultContext, ...context });
    }
    /**
     * Log debug message
     */
    debug(message, context) {
        log(createLogEntry(LogLevel.DEBUG, message, { ...this.defaultContext, ...context }));
    }
    /**
     * Log info message
     */
    info(message, context) {
        log(createLogEntry(LogLevel.INFO, message, { ...this.defaultContext, ...context }));
    }
    /**
     * Log warning message
     */
    warn(message, context) {
        log(createLogEntry(LogLevel.WARN, message, { ...this.defaultContext, ...context }));
    }
    /**
     * Log error message
     */
    error(message, error, context) {
        log(createLogEntry(LogLevel.ERROR, message, { ...this.defaultContext, ...context }, error));
    }
    /**
     * Log Lambda invocation start
     */
    logInvocationStart(event) {
        this.info('Lambda invocation started', {
            operation: 'invocation_start',
            eventType: event.httpMethod || event.Records?.[0]?.eventName || 'unknown'
        });
    }
    /**
     * Log Lambda invocation end
     */
    logInvocationEnd(duration, statusCode) {
        this.info('Lambda invocation completed', {
            operation: 'invocation_end',
            duration,
            statusCode
        });
    }
    /**
     * Log API request
     */
    logApiRequest(method, path, requestId) {
        this.info('API request received', {
            operation: 'api_request',
            method,
            path,
            requestId
        });
    }
    /**
     * Log API response
     */
    logApiResponse(statusCode, duration, requestId) {
        this.info('API response sent', {
            operation: 'api_response',
            statusCode,
            duration,
            requestId
        });
    }
    /**
     * Log DynamoDB operation
     */
    logDynamoDBOperation(operation, tableName, duration) {
        this.info('DynamoDB operation', {
            operation: 'dynamodb',
            action: operation,
            tableName,
            duration
        });
    }
    /**
     * Log S3 operation
     */
    logS3Operation(operation, bucket, key, duration) {
        this.info('S3 operation', {
            operation: 's3',
            action: operation,
            bucket,
            key,
            duration
        });
    }
    /**
     * Log Bedrock API call
     */
    logBedrockCall(modelId, promptLength, responseLength, duration) {
        this.info('Bedrock API call', {
            operation: 'bedrock',
            modelId,
            promptLength,
            responseLength,
            duration
        });
    }
    /**
     * Log eligibility check
     */
    logEligibilityCheck(userId, schemeCount, eligibleCount, duration) {
        this.info('Eligibility check completed', {
            operation: 'eligibility_check',
            userId,
            schemeCount,
            eligibleCount,
            duration
        });
    }
    /**
     * Log AI safety violation
     */
    logSafetyViolation(violationType, content) {
        this.warn('AI safety violation detected', {
            operation: 'safety_violation',
            violationType,
            contentLength: content.length
        });
    }
}
exports.Logger = Logger;
/**
 * Create a logger instance
 */
function createLogger(context) {
    return new Logger(context);
}
/**
 * Default logger instance
 */
exports.logger = createLogger();
