import { SchemeWithEligibility } from './Scheme';

// Eligibility Check Result
export interface EligibilityResult {
  resultId: string;
  userId?: string;
  timestamp: string;
  profile: {
    age: number;
    state: string;
    occupation: string;
    annualIncome: number;
    gender: string;
    socialCategory: string;
    hasDisability: boolean;
  };
  eligibleSchemes: EligibleScheme[];
  ineligibleSchemes: IneligibleScheme[];
  totalSchemes: number;
  ttl?: number;
}

// Eligible Scheme Details
export interface EligibleScheme {
  schemeId: string;
  schemeName: string;
  description: string;
  benefits: string;
  satisfiedCriteria: string[];
  matchScore: number;
}

// Ineligible Scheme Details
export interface IneligibleScheme {
  schemeId: string;
  schemeName: string;
  description: string;
  unsatisfiedCriteria: {
    criterion: string;
    reason: string;
  }[];
}

// API Response Format
export interface EligibilityCheckResponse {
  statusCode: number;
  timestamp: string;
  data?: EligibilityResult;
  error?: {
    message: string;
    validationErrors?: Record<string, string>;
  };
}
