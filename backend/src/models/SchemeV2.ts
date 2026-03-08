// Enhanced Scheme Model V2
export interface SchemeV2 {
  schemeId: string;
  schemeName: string;
  nameTranslations: Record<string, string>;
  description: string;
  ministry: string;
  state?: string;
  category: SchemeCategory;
  
  // Benefits
  benefits: {
    type: 'Financial' | 'Subsidy' | 'Pension' | 'Insurance' | 'Training' | 'Other';
    amount?: number;
    frequency?: 'One-time' | 'Monthly' | 'Quarterly' | 'Yearly';
    duration?: string;
    description: string;
  };
  
  // Enhanced Eligibility Rules
  eligibilityRules: {
    ageMin?: number;
    ageMax?: number;
    incomeMax?: number;
    incomeMin?: number;
    states?: string[];
    districts?: string[];
    ruralOnly?: boolean;
    urbanOnly?: boolean;
    occupations?: string[];
    excludedOccupations?: string[];
    gender?: ('Male' | 'Female' | 'Other')[];
    socialCategories?: ('General' | 'OBC' | 'SC' | 'ST' | 'EWS')[];
    minority?: boolean;
    minorityTypes?: string[];
    requiresDisability?: boolean;
    disabilityTypes?: string[];
    minDisabilityPercentage?: number;
    maxFamilyIncome?: number;
    maxFamilySize?: number;
    requiresChildren?: boolean;
    childrenAgeMax?: number;
    minEducation?: string;
    maxEducation?: string;
    currentlyStudying?: boolean;
    requiredDocuments: string[];
    optionalDocuments: string[];
    customRules?: CustomRule[];
    excludeIf?: ExclusionRule[];
  };
  
  // Application Process
  applicationProcess: {
    mode: 'Online' | 'Offline' | 'Both';
    steps: string[];
    estimatedTime: string;
    applicationUrl?: string;
    helplineNumber?: string;
  };
  
  // S3 Paths
  s3Paths: {
    policy: string;
    faq: string;
    guidelines?: string;
    forms?: string;
  };
  
  // Metadata
  metadata: {
    popularity: number;
    successRate: number;
    averageProcessingTime: number;
    lastUpdated: string;
    status: 'Active' | 'Inactive' | 'Archived';
    tags: string[];
  };
}

export type SchemeCategory = 
  | 'Agriculture'
  | 'Education'
  | 'Health'
  | 'Housing'
  | 'Employment'
  | 'Social Welfare'
  | 'Women & Child'
  | 'Senior Citizen'
  | 'Disability'
  | 'Financial Inclusion'
  | 'Skill Development'
  | 'Other';

export interface CustomRule {
  ruleId: string;
  description: string;
  condition: string;
  errorMessage: string;
}

export interface ExclusionRule {
  condition: string;
  reason: string;
}

export interface EligibilityResultV2 {
  schemeId: string;
  schemeName: string;
  status: 'Eligible' | 'Not Eligible' | 'Potentially Eligible' | 'Insufficient Data';
  matchScore: number;
  confidence: 'High' | 'Medium' | 'Low';
  satisfiedCriteria: CriterionDetail[];
  unsatisfiedCriteria: UnsatisfiedCriterion[];
  missingData: MissingDataItem[];
  recommendations: string[];
  alternativeSchemes: string[];
  estimatedEligibilityDate?: string;
}

export interface CriterionDetail {
  criterion: string;
  value: any;
  requirement: any;
  message: string;
}

export interface UnsatisfiedCriterion {
  criterion: string;
  currentValue: any;
  requiredValue: any;
  gap: string;
  message: string;
  fixable: boolean;
  howToFix?: string;
}

export interface MissingDataItem {
  field: string;
  importance: 'Critical' | 'Important' | 'Optional';
  message: string;
}

export interface TimelinePrediction {
  schemeId: string;
  schemeName: string;
  date: string;
  event: string;
  probability: number;
  action: string;
}
