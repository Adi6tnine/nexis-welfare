// Enhanced User Profile Model V2
export interface UserProfileV2 {
  userId: string;
  
  // Personal Information
  personalInfo: {
    name?: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone?: string;
    email?: string;
  };
  
  // Location
  location: {
    state: string;
    district?: string;
    pincode?: string;
    village?: string;
    isRural: boolean;
  };
  
  // Occupation
  occupation: {
    primary: OccupationType;
    details: FarmerDetails | StudentDetails | WorkerDetails | BusinessDetails | Record<string, any>;
  };
  
  // Economic Status
  economic: {
    annualIncome: number;
    incomeSource: string[];
    bplCard: boolean;
    aplCard: boolean;
  };
  
  // Family Information
  family: {
    size: number;
    dependents: number;
    children: Array<{ age: number; education: string; gender: string }>;
    elderlyMembers: number;
    maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
  };
  
  // Social Category
  socialCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  minority: boolean;
  minorityType?: 'Muslim' | 'Christian' | 'Sikh' | 'Buddhist' | 'Jain' | 'Parsi';
  
  // Disability
  hasDisability: boolean;
  disabilityDetails?: {
    type: string;
    percentage: number;
    certificate: boolean;
  };
  
  // Education
  education: {
    level: 'Illiterate' | 'Primary' | 'Secondary' | 'Higher Secondary' | 'Graduate' | 'Postgraduate';
    currentlyStudying: boolean;
    institution?: string;
    course?: string;
  };
  
  // Documents
  documents: {
    aadhaar: DocumentStatus;
    pan: DocumentStatus;
    rationCard: DocumentStatus;
    incomeCertificate: DocumentStatus;
    casteCertificate: DocumentStatus;
    disabilityCertificate: DocumentStatus;
    landRecords: DocumentStatus;
    bankAccount: DocumentStatus;
  };
  
  // Preferences
  preferences: {
    language: 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as';
    voiceEnabled: boolean;
    notifications: {
      sms: boolean;
      email: boolean;
      push: boolean;
      voice: boolean;
    };
  };
  
  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastActive: string;
    profileCompleteness: number;
    verificationStatus: 'unverified' | 'partial' | 'verified';
    cscOperatorId?: string;
    collectionMethod: 'web' | 'mobile' | 'voice' | 'csc' | 'ussd';
  };
}

export type OccupationType = 
  | 'Farmer'
  | 'Agricultural Worker'
  | 'Student'
  | 'Unemployed'
  | 'Self-Employed'
  | 'Private Sector'
  | 'Government Employee'
  | 'Daily Wage Worker'
  | 'Artisan'
  | 'Fisherman'
  | 'Business Owner'
  | 'Other';

export interface FarmerDetails {
  ownsLand: boolean;
  landSize?: number;
  irrigatedLand?: number;
  crops: string[];
  hasKisanCreditCard: boolean;
  hasSoilHealthCard: boolean;
  registeredFarmer: boolean;
}

export interface StudentDetails {
  level: 'School' | 'College' | 'University';
  institutionType: 'Government' | 'Private' | 'Aided';
  course: string;
  year: number;
  currentScholarships: string[];
  hostelResident: boolean;
}

export interface WorkerDetails {
  workerType: 'Construction' | 'Factory' | 'Domestic' | 'Agricultural' | 'Other';
  registeredWorker: boolean;
  esicMember: boolean;
  epfMember: boolean;
  wageType: 'Daily' | 'Weekly' | 'Monthly';
  averageDailyWage?: number;
}

export interface BusinessDetails {
  businessType: string;
  registered: boolean;
  gstNumber?: string;
  msmeRegistered: boolean;
  annualTurnover?: number;
  employees?: number;
}

export interface DocumentStatus {
  available: boolean;
  number?: string;
  verified: boolean;
  s3Path?: string;
  extractedData?: any;
  uploadedAt?: string;
  verifiedAt?: string;
}
