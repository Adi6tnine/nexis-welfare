/**
 * AI Safety Mechanisms
 * 
 * Implements content filtering, approval promise detection, and contradiction detection
 * to ensure AI responses are safe, accurate, and appropriate.
 */

/**
 * Inappropriate content patterns to filter
 */
const INAPPROPRIATE_PATTERNS = [
  // Offensive language
  /\b(hate|racist|sexist|discriminat)\w*/gi,
  
  // Medical advice
  /\b(diagnos|prescrib|treat|cure|medic)\w*/gi,
  
  // Legal advice
  /\b(legal advice|sue|lawsuit|court|lawyer)\w*/gi,
  
  // Financial advice
  /\b(invest|stock|trading|crypto|forex)\w*/gi,
  
  // Personal information requests
  /\b(password|credit card|bank account|ssn|aadhar number)\w*/gi
];

/**
 * Approval promise keywords that should not appear in responses
 */
const APPROVAL_KEYWORDS = [
  'you will get',
  'you will receive',
  'guaranteed',
  'you are approved',
  'approval confirmed',
  'you will be selected',
  'definitely eligible',
  'certainly approved',
  'assured benefits',
  'promised amount'
];

/**
 * Contradiction indicators
 */
const CONTRADICTION_INDICATORS = [
  'however',
  'but',
  'although',
  'on the other hand',
  'contrary to',
  'despite',
  'nevertheless',
  'nonetheless'
];

/**
 * Check if response contains inappropriate content
 */
export function containsInappropriateContent(response: string): {
  isInappropriate: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  for (const pattern of INAPPROPRIATE_PATTERNS) {
    const matches = response.match(pattern);
    if (matches && matches.length > 0) {
      reasons.push(`Contains inappropriate pattern: ${matches[0]}`);
    }
  }

  return {
    isInappropriate: reasons.length > 0,
    reasons
  };
}

/**
 * Detect approval promises in response
 */
export function detectApprovalPromises(response: string): {
  hasPromises: boolean;
  detectedPromises: string[];
} {
  const lowerResponse = response.toLowerCase();
  const detectedPromises: string[] = [];

  for (const keyword of APPROVAL_KEYWORDS) {
    if (lowerResponse.includes(keyword)) {
      detectedPromises.push(keyword);
    }
  }

  return {
    hasPromises: detectedPromises.length > 0,
    detectedPromises
  };
}

/**
 * Detect potential contradictions in response
 */
export function detectContradictions(response: string): {
  hasContradictions: boolean;
  indicators: string[];
} {
  const lowerResponse = response.toLowerCase();
  const indicators: string[] = [];

  for (const indicator of CONTRADICTION_INDICATORS) {
    if (lowerResponse.includes(indicator)) {
      indicators.push(indicator);
    }
  }

  // Check for contradictory statements about eligibility
  const hasEligible = /\b(eligible|qualify|qualifies)\b/i.test(response);
  const hasNotEligible = /\b(not eligible|don't qualify|doesn't qualify|ineligible)\b/i.test(response);

  if (hasEligible && hasNotEligible) {
    indicators.push('contradictory eligibility statements');
  }

  return {
    hasContradictions: indicators.length > 0,
    indicators
  };
}

/**
 * Verify facts against knowledge base
 */
export function verifyFactsAgainstKnowledgeBase(
  response: string,
  knowledgeBaseDocuments: string[]
): {
  isVerified: boolean;
  unverifiedClaims: string[];
} {
  // Extract factual claims from response
  const claims = extractFactualClaims(response);
  const unverifiedClaims: string[] = [];

  for (const claim of claims) {
    let isVerified = false;

    // Check if claim appears in any knowledge base document
    for (const doc of knowledgeBaseDocuments) {
      if (doc.toLowerCase().includes(claim.toLowerCase())) {
        isVerified = true;
        break;
      }
    }

    if (!isVerified) {
      unverifiedClaims.push(claim);
    }
  }

  return {
    isVerified: unverifiedClaims.length === 0,
    unverifiedClaims
  };
}

/**
 * Extract factual claims from response
 */
function extractFactualClaims(response: string): string[] {
  const claims: string[] = [];

  // Extract sentences with specific amounts
  const amountPattern = /[^.!?]*₹\s*[\d,]+[^.!?]*/g;
  const amountMatches = response.match(amountPattern);
  if (amountMatches) {
    claims.push(...amountMatches.map(m => m.trim()));
  }

  // Extract sentences with percentages
  const percentPattern = /[^.!?]*\d+%[^.!?]*/g;
  const percentMatches = response.match(percentPattern);
  if (percentMatches) {
    claims.push(...percentMatches.map(m => m.trim()));
  }

  // Extract sentences with specific dates
  const datePattern = /[^.!?]*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}[^.!?]*/g;
  const dateMatches = response.match(datePattern);
  if (dateMatches) {
    claims.push(...dateMatches.map(m => m.trim()));
  }

  return claims;
}

/**
 * Sanitize response by removing or replacing problematic content
 */
export function sanitizeResponse(response: string): string {
  let sanitized = response;

  // Replace approval promises with conditional language
  for (const keyword of APPROVAL_KEYWORDS) {
    const regex = new RegExp(keyword, 'gi');
    sanitized = sanitized.replace(regex, 'you may be able to get');
  }

  // Remove any HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

/**
 * Comprehensive safety check for AI response
 */
export function performSafetyCheck(
  response: string,
  knowledgeBaseDocuments: string[] = []
): {
  isSafe: boolean;
  issues: string[];
  sanitizedResponse: string;
} {
  const issues: string[] = [];

  // Check for inappropriate content
  const inappropriateCheck = containsInappropriateContent(response);
  if (inappropriateCheck.isInappropriate) {
    issues.push(...inappropriateCheck.reasons);
  }

  // Check for approval promises
  const promiseCheck = detectApprovalPromises(response);
  if (promiseCheck.hasPromises) {
    issues.push(`Contains approval promises: ${promiseCheck.detectedPromises.join(', ')}`);
  }

  // Check for contradictions
  const contradictionCheck = detectContradictions(response);
  if (contradictionCheck.hasContradictions) {
    issues.push(`Contains contradictions: ${contradictionCheck.indicators.join(', ')}`);
  }

  // Verify facts if knowledge base provided
  if (knowledgeBaseDocuments.length > 0) {
    const factCheck = verifyFactsAgainstKnowledgeBase(response, knowledgeBaseDocuments);
    if (!factCheck.isVerified && factCheck.unverifiedClaims.length > 0) {
      issues.push(`Unverified claims: ${factCheck.unverifiedClaims.length} found`);
    }
  }

  // Sanitize response
  const sanitizedResponse = sanitizeResponse(response);

  return {
    isSafe: issues.length === 0,
    issues,
    sanitizedResponse
  };
}

/**
 * Log response for quality monitoring
 */
export function logResponseForMonitoring(
  requestId: string,
  userQuery: string,
  aiResponse: string,
  safetyCheckResult: {
    isSafe: boolean;
    issues: string[];
  },
  metadata: {
    confidence: string;
    sourceCount: number;
    responseTime: number;
  }
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    requestId,
    queryLength: userQuery.length,
    responseLength: aiResponse.length,
    isSafe: safetyCheckResult.isSafe,
    issueCount: safetyCheckResult.issues.length,
    issues: safetyCheckResult.issues,
    confidence: metadata.confidence,
    sourceCount: metadata.sourceCount,
    responseTime: metadata.responseTime
  };

  console.log('AI Response Quality Log', logEntry);

  // In production, this would also send to CloudWatch Logs Insights
  // or a dedicated monitoring service
}

/**
 * Generate safe fallback response
 */
export function generateFallbackResponse(language: 'en' | 'hi' = 'en'): string {
  if (language === 'hi') {
    return 'मुझे खेद है, मैं इस समय आपके प्रश्न का उत्तर नहीं दे सकता। कृपया अपने नजदीकी सरकारी कार्यालय से संपर्क करें या आधिकारिक योजना दस्तावेज़ देखें।';
  }

  return 'I apologize, but I cannot answer your question at this time. Please contact your nearest government office or refer to the official scheme documents for accurate information.';
}
