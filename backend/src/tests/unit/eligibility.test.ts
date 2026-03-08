import {
  evaluateEligibility,
  evaluateAgeCriterion,
  evaluateIncomeCriterion,
  evaluateStateCriterion,
  evaluateOccupationCriterion,
  evaluateGenderCriterion,
  evaluateSocialCategoryCriterion,
  evaluateDisabilityCriterion
} from '../../services/eligibility';
import { UserProfile, Scheme, EligibilityCriteria } from '../../models';

describe('Eligibility Evaluation', () => {
  const mockProfile: UserProfile = {
    age: 30,
    state: 'MH',
    occupation: 'Farmer',
    annualIncome: 100000,
    gender: 'Male',
    socialCategory: 'General',
    hasDisability: false
  };

  describe('evaluateAgeCriterion', () => {
    it('should pass when age is within range', () => {
      const criteria: EligibilityCriteria = { ageMin: 18, ageMax: 60 };
      const result = evaluateAgeCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(true);
    });

    it('should fail when age is below minimum', () => {
      const criteria: EligibilityCriteria = { ageMin: 40 };
      const result = evaluateAgeCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
      expect(result?.reason).toContain('at least 40');
    });

    it('should fail when age is above maximum', () => {
      const criteria: EligibilityCriteria = { ageMax: 25 };
      const result = evaluateAgeCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
      expect(result?.reason).toContain('at most 25');
    });

    it('should return null when no age criteria specified', () => {
      const criteria: EligibilityCriteria = {};
      const result = evaluateAgeCriterion(mockProfile, criteria);
      
      expect(result).toBeNull();
    });
  });

  describe('evaluateIncomeCriterion', () => {
    it('should pass when income is below maximum', () => {
      const criteria: EligibilityCriteria = { incomeMax: 200000 };
      const result = evaluateIncomeCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(true);
    });

    it('should fail when income exceeds maximum', () => {
      const criteria: EligibilityCriteria = { incomeMax: 50000 };
      const result = evaluateIncomeCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
    });

    it('should return null when no income criteria specified', () => {
      const criteria: EligibilityCriteria = {};
      const result = evaluateIncomeCriterion(mockProfile, criteria);
      
      expect(result).toBeNull();
    });
  });

  describe('evaluateStateCriterion', () => {
    it('should pass when state is in allowed list', () => {
      const criteria: EligibilityCriteria = { states: ['MH', 'DL', 'KA'] };
      const result = evaluateStateCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(true);
    });

    it('should fail when state is not in allowed list', () => {
      const criteria: EligibilityCriteria = { states: ['DL', 'KA'] };
      const result = evaluateStateCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
    });
  });

  describe('evaluateOccupationCriterion', () => {
    it('should pass when occupation is in allowed list', () => {
      const criteria: EligibilityCriteria = { occupations: ['Farmer', 'Student'] };
      const result = evaluateOccupationCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(true);
    });

    it('should fail when occupation is not in allowed list', () => {
      const criteria: EligibilityCriteria = { occupations: ['Student', 'Unemployed'] };
      const result = evaluateOccupationCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
    });
  });

  describe('evaluateGenderCriterion', () => {
    it('should pass when gender matches', () => {
      const criteria: EligibilityCriteria = { gender: ['Male', 'Other'] };
      const result = evaluateGenderCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(true);
    });

    it('should fail when gender does not match', () => {
      const criteria: EligibilityCriteria = { gender: ['Female'] };
      const result = evaluateGenderCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
    });
  });

  describe('evaluateSocialCategoryCriterion', () => {
    it('should pass when category matches', () => {
      const criteria: EligibilityCriteria = { socialCategories: ['General', 'OBC'] };
      const result = evaluateSocialCategoryCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(true);
    });

    it('should fail when category does not match', () => {
      const criteria: EligibilityCriteria = { socialCategories: ['SC', 'ST'] };
      const result = evaluateSocialCategoryCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
    });
  });

  describe('evaluateDisabilityCriterion', () => {
    it('should pass when disability requirement matches', () => {
      const criteria: EligibilityCriteria = { requiresDisability: false };
      const result = evaluateDisabilityCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(true);
    });

    it('should fail when disability is required but user does not have it', () => {
      const criteria: EligibilityCriteria = { requiresDisability: true };
      const result = evaluateDisabilityCriterion(mockProfile, criteria);
      
      expect(result).not.toBeNull();
      expect(result?.satisfied).toBe(false);
    });
  });

  describe('evaluateEligibility', () => {
    it('should return eligible when all criteria are satisfied', () => {
      const scheme: Scheme = {
        schemeId: 'test-scheme',
        schemeName: 'Test Scheme',
        description: 'Test',
        benefits: 'Test benefits',
        eligibilityCriteria: {
          ageMin: 18,
          ageMax: 60,
          incomeMax: 200000,
          states: ['MH'],
          occupations: ['Farmer']
        }
      };

      const result = evaluateEligibility(mockProfile, scheme);
      
      expect(result.isEligible).toBe(true);
      expect(result.matchScore).toBe(100);
    });

    it('should return ineligible when any criterion fails', () => {
      const scheme: Scheme = {
        schemeId: 'test-scheme',
        schemeName: 'Test Scheme',
        description: 'Test',
        benefits: 'Test benefits',
        eligibilityCriteria: {
          ageMin: 40,
          incomeMax: 200000
        }
      };

      const result = evaluateEligibility(mockProfile, scheme);
      
      expect(result.isEligible).toBe(false);
      expect(result.matchScore).toBeLessThan(100);
    });

    it('should calculate correct match score', () => {
      const scheme: Scheme = {
        schemeId: 'test-scheme',
        schemeName: 'Test Scheme',
        description: 'Test',
        benefits: 'Test benefits',
        eligibilityCriteria: {
          ageMin: 18,
          ageMax: 60,
          incomeMax: 50000
        }
      };

      const result = evaluateEligibility(mockProfile, scheme);
      
      expect(result.matchScore).toBe(50);
    });
  });
});
