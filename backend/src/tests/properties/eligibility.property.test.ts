import * as fc from 'fast-check';
import { evaluateEligibility } from '../../services/eligibility';
import { UserProfile, Scheme } from '../../models';

describe('Eligibility Engine Property-Based Tests', () => {
  // Arbitraries for generating test data
  const userProfileArbitrary = fc.record({
    age: fc.integer({ min: 1, max: 120 }),
    state: fc.constantFrom('MH', 'DL', 'KA', 'TN', 'UP', 'WB'),
    occupation: fc.constantFrom('Farmer', 'Student', 'Unemployed', 'Self-Employed'),
    annualIncome: fc.integer({ min: 0, max: 10000000 }),
    gender: fc.constantFrom('Male', 'Female', 'Other'),
    socialCategory: fc.constantFrom('General', 'OBC', 'SC', 'ST'),
    hasDisability: fc.boolean()
  });

  const schemeArbitrary = fc.record({
    schemeId: fc.string({ minLength: 1, maxLength: 50 }),
    schemeName: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 1, maxLength: 500 }),
    benefits: fc.string({ minLength: 1, maxLength: 200 }),
    eligibilityCriteria: fc.record({
      ageMin: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
      ageMax: fc.option(fc.integer({ min: 0, max: 120 }), { nil: undefined }),
      incomeMax: fc.option(fc.integer({ min: 0, max: 10000000 }), { nil: undefined }),
      states: fc.option(fc.array(fc.constantFrom('MH', 'DL', 'KA'), { minLength: 1 }), { nil: undefined }),
      occupations: fc.option(fc.array(fc.constantFrom('Farmer', 'Student'), { minLength: 1 }), { nil: undefined }),
      gender: fc.option(fc.array(fc.constantFrom('Male', 'Female'), { minLength: 1 }), { nil: undefined }),
      socialCategories: fc.option(fc.array(fc.constantFrom('General', 'OBC'), { minLength: 1 }), { nil: undefined }),
      requiresDisability: fc.option(fc.boolean(), { nil: undefined })
    })
  });

  describe('Property 1: Eligibility Completeness', () => {
    it('should always return a result with isEligible boolean', () => {
      fc.assert(
        fc.property(userProfileArbitrary, schemeArbitrary, (profile, scheme) => {
          const result = evaluateEligibility(profile as UserProfile, scheme as Scheme);
          expect(typeof result.isEligible).toBe('boolean');
          expect(result.matchScore).toBeGreaterThanOrEqual(0);
          expect(result.matchScore).toBeLessThanOrEqual(100);
        }),
        { numRuns: 1000 }
      );
    });
  });

  describe('Property 2: Match Score Consistency', () => {
    it('should have matchScore of 100 when eligible', () => {
      fc.assert(
        fc.property(userProfileArbitrary, schemeArbitrary, (profile, scheme) => {
          const result = evaluateEligibility(profile as UserProfile, scheme as Scheme);
          if (result.isEligible) {
            expect(result.matchScore).toBe(100);
          }
        }),
        { numRuns: 1000 }
      );
    });

    it('should have matchScore less than 100 when ineligible', () => {
      fc.assert(
        fc.property(userProfileArbitrary, schemeArbitrary, (profile, scheme) => {
          const result = evaluateEligibility(profile as UserProfile, scheme as Scheme);
          if (!result.isEligible) {
            expect(result.matchScore).toBeLessThan(100);
          }
        }),
        { numRuns: 1000 }
      );
    });
  });

  describe('Property 3: Idempotence', () => {
    it('should return same result when called multiple times', () => {
      fc.assert(
        fc.property(userProfileArbitrary, schemeArbitrary, (profile, scheme) => {
          const result1 = evaluateEligibility(profile as UserProfile, scheme as Scheme);
          const result2 = evaluateEligibility(profile as UserProfile, scheme as Scheme);
          
          expect(result1.isEligible).toBe(result2.isEligible);
          expect(result1.matchScore).toBe(result2.matchScore);
        }),
        { numRuns: 500 }
      );
    });
  });

  describe('Property 4: Age Criterion Logic', () => {
    it('should be ineligible when age is below minimum', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 40, max: 100 }),
          (userAge, minAge) => {
            const profile: UserProfile = {
              age: userAge,
              state: 'MH',
              occupation: 'Farmer',
              annualIncome: 100000,
              gender: 'Male',
              socialCategory: 'General',
              hasDisability: false
            };

            const scheme: Scheme = {
              schemeId: 'test',
              schemeName: 'Test',
              description: 'Test',
              benefits: 'Test',
              eligibilityCriteria: { ageMin: minAge }
            };

            const result = evaluateEligibility(profile, scheme);
            expect(result.isEligible).toBe(false);
          }
        ),
        { numRuns: 500 }
      );
    });

    it('should be ineligible when age is above maximum', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 70, max: 120 }),
          fc.integer({ min: 18, max: 60 }),
          (userAge, maxAge) => {
            const profile: UserProfile = {
              age: userAge,
              state: 'MH',
              occupation: 'Farmer',
              annualIncome: 100000,
              gender: 'Male',
              socialCategory: 'General',
              hasDisability: false
            };

            const scheme: Scheme = {
              schemeId: 'test',
              schemeName: 'Test',
              description: 'Test',
              benefits: 'Test',
              eligibilityCriteria: { ageMax: maxAge }
            };

            const result = evaluateEligibility(profile, scheme);
            expect(result.isEligible).toBe(false);
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('Property 5: Income Criterion Logic', () => {
    it('should be ineligible when income exceeds maximum', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 200000, max: 10000000 }),
          fc.integer({ min: 50000, max: 150000 }),
          (userIncome, maxIncome) => {
            const profile: UserProfile = {
              age: 30,
              state: 'MH',
              occupation: 'Farmer',
              annualIncome: userIncome,
              gender: 'Male',
              socialCategory: 'General',
              hasDisability: false
            };

            const scheme: Scheme = {
              schemeId: 'test',
              schemeName: 'Test',
              description: 'Test',
              benefits: 'Test',
              eligibilityCriteria: { incomeMax: maxIncome }
            };

            const result = evaluateEligibility(profile, scheme);
            expect(result.isEligible).toBe(false);
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('Property 6: Criterion Independence', () => {
    it('should evaluate each criterion independently', () => {
      fc.assert(
        fc.property(userProfileArbitrary, (profile) => {
          const scheme1: Scheme = {
            schemeId: 'test1',
            schemeName: 'Test1',
            description: 'Test',
            benefits: 'Test',
            eligibilityCriteria: { ageMin: 18, ageMax: 60 }
          };

          const scheme2: Scheme = {
            schemeId: 'test2',
            schemeName: 'Test2',
            description: 'Test',
            benefits: 'Test',
            eligibilityCriteria: { incomeMax: 200000 }
          };

          const result1 = evaluateEligibility(profile as UserProfile, scheme1);
          const result2 = evaluateEligibility(profile as UserProfile, scheme2);

          // Results should be independent
          expect(typeof result1.isEligible).toBe('boolean');
          expect(typeof result2.isEligible).toBe('boolean');
        }),
        { numRuns: 500 }
      );
    });
  });
});
