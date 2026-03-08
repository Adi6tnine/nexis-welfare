// User Profile Data Model
export interface UserProfile {
  userId?: string;
  age: number;
  state: string;
  occupation: string;
  annualIncome: number;
  gender: 'Male' | 'Female' | 'Other';
  socialCategory: 'General' | 'OBC' | 'SC' | 'ST';
  hasDisability: boolean;
  createdAt?: string;
  updatedAt?: string;
  language?: 'en' | 'hi';
}

// Valid Indian state codes
export const VALID_STATES = [
  'AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CT', 'DD', 'DL', 'DN', 'GA', 'GJ',
  'HP', 'HR', 'JH', 'JK', 'KA', 'KL', 'LA', 'LD', 'MH', 'ML', 'MN', 'MP',
  'MZ', 'NL', 'OR', 'PB', 'PY', 'RJ', 'SK', 'TN', 'TG', 'TR', 'UP', 'UT', 'WB'
] as const;

// Valid occupation categories
export const VALID_OCCUPATIONS = [
  'Farmer',
  'Agricultural Worker',
  'Student',
  'Unemployed',
  'Self-Employed',
  'Private Sector',
  'Government Employee',
  'Daily Wage Worker',
  'Artisan',
  'Fisherman',
  'Other'
] as const;

export type StateCode = typeof VALID_STATES[number];
export type Occupation = typeof VALID_OCCUPATIONS[number];
