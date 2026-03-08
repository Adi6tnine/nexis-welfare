// @ts-nocheck
import { z } from 'zod';
import { VALID_STATES, VALID_OCCUPATIONS } from './UserProfile';

// User Profile Validation Schema
export const UserProfileSchema = z.object({
  userId: z.string().uuid().optional(),
  age: z.number()
    .int('Age must be a whole number')
    .min(0, 'Age must be at least 0')
    .max(120, 'Age must be at most 120'),
  state: z.enum(VALID_STATES as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid state code' })
  }),
  occupation: z.enum(VALID_OCCUPATIONS as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid occupation' })
  }),
  annualIncome: z.number()
    .nonnegative('Annual income must be non-negative'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Gender must be Male, Female, or Other' })
  }),
  socialCategory: z.enum(['General', 'OBC', 'SC', 'ST'], {
    errorMap: () => ({ message: 'Social category must be General, OBC, SC, or ST' })
  }),
  hasDisability: z.boolean({
    errorMap: () => ({ message: 'hasDisability must be a boolean' })
  }),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  language: z.enum(['en', 'hi']).optional()
});

// Eligibility Criteria Validation Schema
export const EligibilityCriteriaSchema = z.object({
  ageMin: z.number().int().min(0).max(120).optional(),
  ageMax: z.number().int().min(0).max(120).optional(),
  incomeMax: z.number().nonnegative().optional(),
  states: z.array(z.string()).optional(),
  occupations: z.array(z.string()).optional(),
  gender: z.array(z.enum(['Male', 'Female', 'Other'])).optional(),
  socialCategories: z.array(z.enum(['General', 'OBC', 'SC', 'ST'])).optional(),
  requiresDisability: z.boolean().optional()
}).refine(
  (data) => {
    if (data.ageMin !== undefined && data.ageMax !== undefined) {
      return data.ageMin <= data.ageMax;
    }
    return true;
  },
  { message: 'ageMin must be less than or equal to ageMax' }
);

// Scheme Validation Schema
export const SchemeSchema = z.object({
  schemeId: z.string()
    .min(1, 'Scheme ID is required')
    .max(50, 'Scheme ID must be at most 50 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Scheme ID must contain only alphanumeric characters and hyphens'),
  schemeName: z.string()
    .min(1, 'Scheme name is required')
    .max(200, 'Scheme name must be at most 200 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  benefits: z.string()
    .min(1, 'Benefits description is required')
    .max(1000, 'Benefits must be at most 1000 characters'),
  eligibilityCriteria: EligibilityCriteriaSchema,
  applicationProcess: z.string().max(2000).optional(),
  documents: z.array(z.string()).optional(),
  officialUrl: z.string().url().optional(),
  s3PolicyPath: z.string().optional(),
  s3FaqPath: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  version: z.number().int().positive().optional()
});

// Eligibility Check Request Schema
export const EligibilityCheckRequestSchema = z.object({
  userId: z.string().uuid().optional(),
  profile: UserProfileSchema
});

// Validation Helper Functions
export function validateUserProfile(data: unknown) {
  return UserProfileSchema.parse(data);
}

export function validateScheme(data: unknown) {
  return SchemeSchema.parse(data);
}

export function validateEligibilityCheckRequest(data: unknown) {
  return EligibilityCheckRequestSchema.parse(data);
}

// Extract validation errors for user-friendly messages
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}
