// Scheme Data Model
export interface Scheme {
  schemeId: string;
  schemeName: string;
  description: string;
  benefits: string;
  eligibilityCriteria: EligibilityCriteria;
  applicationProcess?: string;
  documents?: string[];
  officialUrl?: string;
  s3PolicyPath?: string;
  s3FaqPath?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

// Eligibility Criteria
export interface EligibilityCriteria {
  ageMin?: number;
  ageMax?: number;
  incomeMax?: number;
  states?: string[];
  occupations?: string[];
  gender?: ('Male' | 'Female' | 'Other')[];
  socialCategories?: ('General' | 'OBC' | 'SC' | 'ST')[];
  requiresDisability?: boolean;
}

// Criterion Evaluation Result
export interface CriterionResult {
  criterion: string;
  satisfied: boolean;
  reason?: string;
}

// Scheme with Eligibility Status
export interface SchemeWithEligibility {
  schemeId: string;
  schemeName: string;
  description: string;
  benefits: string;
  isEligible: boolean;
  matchScore?: number;
  satisfiedCriteria?: string[];
  unsatisfiedCriteria?: CriterionResult[];
}
