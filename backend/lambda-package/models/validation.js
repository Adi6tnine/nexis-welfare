"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityCheckRequestSchema = exports.SchemeSchema = exports.EligibilityCriteriaSchema = exports.UserProfileSchema = void 0;
exports.validateUserProfile = validateUserProfile;
exports.validateScheme = validateScheme;
exports.validateEligibilityCheckRequest = validateEligibilityCheckRequest;
exports.formatValidationErrors = formatValidationErrors;
// @ts-nocheck
const zod_1 = require("zod");
const UserProfile_1 = require("./UserProfile");
// User Profile Validation Schema
exports.UserProfileSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    age: zod_1.z.number()
        .int('Age must be a whole number')
        .min(0, 'Age must be at least 0')
        .max(120, 'Age must be at most 120'),
    state: zod_1.z.enum(UserProfile_1.VALID_STATES, {
        errorMap: () => ({ message: 'Invalid state code' })
    }),
    occupation: zod_1.z.enum(UserProfile_1.VALID_OCCUPATIONS, {
        errorMap: () => ({ message: 'Invalid occupation' })
    }),
    annualIncome: zod_1.z.number()
        .nonnegative('Annual income must be non-negative'),
    gender: zod_1.z.enum(['Male', 'Female', 'Other'], {
        errorMap: () => ({ message: 'Gender must be Male, Female, or Other' })
    }),
    socialCategory: zod_1.z.enum(['General', 'OBC', 'SC', 'ST'], {
        errorMap: () => ({ message: 'Social category must be General, OBC, SC, or ST' })
    }),
    hasDisability: zod_1.z.boolean({
        errorMap: () => ({ message: 'hasDisability must be a boolean' })
    }),
    createdAt: zod_1.z.string().datetime().optional(),
    updatedAt: zod_1.z.string().datetime().optional(),
    language: zod_1.z.enum(['en', 'hi']).optional()
});
// Eligibility Criteria Validation Schema
exports.EligibilityCriteriaSchema = zod_1.z.object({
    ageMin: zod_1.z.number().int().min(0).max(120).optional(),
    ageMax: zod_1.z.number().int().min(0).max(120).optional(),
    incomeMax: zod_1.z.number().nonnegative().optional(),
    states: zod_1.z.array(zod_1.z.string()).optional(),
    occupations: zod_1.z.array(zod_1.z.string()).optional(),
    gender: zod_1.z.array(zod_1.z.enum(['Male', 'Female', 'Other'])).optional(),
    socialCategories: zod_1.z.array(zod_1.z.enum(['General', 'OBC', 'SC', 'ST'])).optional(),
    requiresDisability: zod_1.z.boolean().optional()
}).refine((data) => {
    if (data.ageMin !== undefined && data.ageMax !== undefined) {
        return data.ageMin <= data.ageMax;
    }
    return true;
}, { message: 'ageMin must be less than or equal to ageMax' });
// Scheme Validation Schema
exports.SchemeSchema = zod_1.z.object({
    schemeId: zod_1.z.string()
        .min(1, 'Scheme ID is required')
        .max(50, 'Scheme ID must be at most 50 characters')
        .regex(/^[a-zA-Z0-9-]+$/, 'Scheme ID must contain only alphanumeric characters and hyphens'),
    schemeName: zod_1.z.string()
        .min(1, 'Scheme name is required')
        .max(200, 'Scheme name must be at most 200 characters'),
    description: zod_1.z.string()
        .min(1, 'Description is required')
        .max(1000, 'Description must be at most 1000 characters'),
    benefits: zod_1.z.string()
        .min(1, 'Benefits description is required')
        .max(1000, 'Benefits must be at most 1000 characters'),
    eligibilityCriteria: exports.EligibilityCriteriaSchema,
    applicationProcess: zod_1.z.string().max(2000).optional(),
    documents: zod_1.z.array(zod_1.z.string()).optional(),
    officialUrl: zod_1.z.string().url().optional(),
    s3PolicyPath: zod_1.z.string().optional(),
    s3FaqPath: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime().optional(),
    updatedAt: zod_1.z.string().datetime().optional(),
    version: zod_1.z.number().int().positive().optional()
});
// Eligibility Check Request Schema
exports.EligibilityCheckRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    profile: exports.UserProfileSchema
});
// Validation Helper Functions
function validateUserProfile(data) {
    return exports.UserProfileSchema.parse(data);
}
function validateScheme(data) {
    return exports.SchemeSchema.parse(data);
}
function validateEligibilityCheckRequest(data) {
    return exports.EligibilityCheckRequestSchema.parse(data);
}
// Extract validation errors for user-friendly messages
function formatValidationErrors(error) {
    const errors = {};
    error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
    });
    return errors;
}
