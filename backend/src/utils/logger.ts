/**
 * Structured logging utility for NEXIS backend
 * Provides consistent log format with PII redaction
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  schemeId?: string;
  operation?: string;
  duration?: number;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

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
function redactPII(value: any): any {
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
    const redacted: any = {};
    for (const [key, val] of Object.entries(value)) {
      // Redact sensitive field names
      if (['password', 'token', 'secret', 'apiKey', 'accessToken'].includes(key)) {
        redacted[key] = '***REDACTED***';
      } else {
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
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
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
function log(entry: LogEntry): void {
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
export class Logger {
  private defaultContext: LogContext;

  constructor(defaultContext: LogContext = {}) {
    this.defaultContext = defaultContext;
  }

  /**
   * Add context to all subsequent logs
   */
  withContext(context: LogContext): Logger {
    return new Logger({ ...this.defaultContext, ...context });
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    log(createLogEntry(
      LogLevel.DEBUG,
      message,
      { ...this.defaultContext, ...context }
    ));
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    log(createLogEntry(
      LogLevel.INFO,
      message,
      { ...this.defaultContext, ...context }
    ));
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    log(createLogEntry(
      LogLevel.WARN,
      message,
      { ...this.defaultContext, ...context }
    ));
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    log(createLogEntry(
      LogLevel.ERROR,
      message,
      { ...this.defaultContext, ...context },
      error
    ));
  }

  /**
   * Log Lambda invocation start
   */
  logInvocationStart(event: any): void {
    this.info('Lambda invocation started', {
      operation: 'invocation_start',
      eventType: event.httpMethod || event.Records?.[0]?.eventName || 'unknown'
    });
  }

  /**
   * Log Lambda invocation end
   */
  logInvocationEnd(duration: number, statusCode?: number): void {
    this.info('Lambda invocation completed', {
      operation: 'invocation_end',
      duration,
      statusCode
    });
  }

  /**
   * Log API request
   */
  logApiRequest(method: string, path: string, requestId: string): void {
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
  logApiResponse(statusCode: number, duration: number, requestId: string): void {
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
  logDynamoDBOperation(operation: string, tableName: string, duration: number): void {
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
  logS3Operation(operation: string, bucket: string, key: string, duration: number): void {
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
  logBedrockCall(modelId: string, promptLength: number, responseLength: number, duration: number): void {
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
  logEligibilityCheck(userId: string, schemeCount: number, eligibleCount: number, duration: number): void {
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
  logSafetyViolation(violationType: string, content: string): void {
    this.warn('AI safety violation detected', {
      operation: 'safety_violation',
      violationType,
      contentLength: content.length
    });
  }
}

/**
 * Create a logger instance
 */
export function createLogger(context?: LogContext): Logger {
  return new Logger(context);
}

/**
 * Default logger instance
 */
export const logger = createLogger();
