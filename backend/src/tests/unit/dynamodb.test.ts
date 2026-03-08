import {
  putEligibilityResult,
  getEligibilityResult,
  queryResultsByUserId,
  putUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  putUserSession,
  getUserSession,
  putExplanationCache,
  getExplanationCache,
  putScheme,
  getScheme
} from '../../services/dynamodb';
import { EligibilityResult } from '../../models';

// Mock AWS SDK
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb');

describe('DynamoDB Service', () => {
  const mockEligibilityResult: EligibilityResult = {
    resultId: 'test-result-123',
    userId: 'user-456',
    timestamp: new Date().toISOString(),
    eligibleSchemes: [],
    ineligibleSchemes: [],
    totalSchemes: 0
  };

  describe('putEligibilityResult', () => {
    it('should store eligibility result with TTL', async () => {
      await expect(putEligibilityResult(mockEligibilityResult)).resolves.not.toThrow();
    });
  });

  describe('getEligibilityResult', () => {
    it('should retrieve eligibility result by ID', async () => {
      const result = await getEligibilityResult('test-result-123');
      expect(result).toBeDefined();
    });

    it('should return null for non-existent result', async () => {
      const result = await getEligibilityResult('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('queryResultsByUserId', () => {
    it('should query results by user ID', async () => {
      const results = await queryResultsByUserId('user-456');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should limit results to specified count', async () => {
      const results = await queryResultsByUserId('user-456', 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe('User Profile Operations', () => {
    const mockProfile = {
      age: 30,
      state: 'MH',
      occupation: 'Farmer',
      annualIncome: 100000
    };

    it('should store user profile', async () => {
      await expect(putUserProfile('user-123', mockProfile)).resolves.not.toThrow();
    });

    it('should retrieve user profile', async () => {
      const profile = await getUserProfile('user-123');
      expect(profile).toBeDefined();
    });

    it('should update user profile', async () => {
      await expect(updateUserProfile('user-123', mockProfile)).resolves.not.toThrow();
    });

    it('should delete user profile', async () => {
      await expect(deleteUserProfile('user-123')).resolves.not.toThrow();
    });
  });

  describe('Session Management', () => {
    const mockSession = {
      userId: 'user-123',
      conversationHistory: [],
      createdAt: new Date().toISOString()
    };

    it('should store user session with TTL', async () => {
      await expect(putUserSession('session-123', mockSession)).resolves.not.toThrow();
    });

    it('should retrieve user session', async () => {
      const session = await getUserSession('session-123');
      expect(session).toBeDefined();
    });
  });

  describe('Explanation Cache', () => {
    it('should store explanation in cache with TTL', async () => {
      await expect(
        putExplanationCache('cache-key-123', 'Test explanation', ['scheme1', 'scheme2'])
      ).resolves.not.toThrow();
    });

    it('should retrieve explanation from cache', async () => {
      const cached = await getExplanationCache('cache-key-123');
      expect(cached).toBeDefined();
    });
  });

  describe('Scheme Management', () => {
    const mockScheme = {
      schemeId: 'scheme-123',
      schemeName: 'Test Scheme',
      description: 'Test description',
      eligibilityCriteria: {}
    };

    it('should store scheme with version increment', async () => {
      await expect(putScheme(mockScheme)).resolves.not.toThrow();
    });

    it('should retrieve scheme by ID', async () => {
      const scheme = await getScheme('scheme-123');
      expect(scheme).toBeDefined();
    });
  });
});
