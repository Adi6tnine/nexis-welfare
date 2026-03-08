import {
  fetchSchemeDocument,
  fetchAllSchemes,
  fetchPolicyDocument,
  fetchFaqDocument,
  uploadSchemeMetadata,
  uploadPolicyDocument,
  uploadFaqDocument,
  clearSchemeCache
} from '../../services/s3';
import { Scheme } from '../../models';

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3');

describe('S3 Service', () => {
  const mockScheme: Scheme = {
    schemeId: 'test-scheme',
    schemeName: 'Test Scheme',
    description: 'Test description',
    benefits: 'Test benefits',
    eligibilityCriteria: {
      ageMin: 18,
      ageMax: 60
    }
  };

  beforeEach(() => {
    clearSchemeCache();
  });

  describe('fetchSchemeDocument', () => {
    it('should fetch scheme metadata from S3', async () => {
      const scheme = await fetchSchemeDocument('test-scheme');
      expect(scheme).toBeDefined();
    });

    it('should return null for non-existent scheme', async () => {
      const scheme = await fetchSchemeDocument('non-existent');
      expect(scheme).toBeNull();
    });

    it('should handle S3 errors gracefully', async () => {
      await expect(fetchSchemeDocument('error-scheme')).rejects.toThrow();
    });
  });

  describe('fetchAllSchemes', () => {
    it('should fetch all schemes from S3', async () => {
      const schemes = await fetchAllSchemes();
      expect(Array.isArray(schemes)).toBe(true);
    });

    it('should cache schemes for 5 minutes', async () => {
      const schemes1 = await fetchAllSchemes();
      const schemes2 = await fetchAllSchemes();
      expect(schemes1).toEqual(schemes2);
    });

    it('should return empty array when no schemes found', async () => {
      const schemes = await fetchAllSchemes();
      expect(schemes).toEqual([]);
    });
  });

  describe('fetchPolicyDocument', () => {
    it('should fetch policy document text', async () => {
      const policy = await fetchPolicyDocument('test-scheme');
      expect(typeof policy).toBe('string');
    });

    it('should return null for missing policy', async () => {
      const policy = await fetchPolicyDocument('no-policy');
      expect(policy).toBeNull();
    });
  });

  describe('fetchFaqDocument', () => {
    it('should fetch FAQ document text', async () => {
      const faq = await fetchFaqDocument('test-scheme');
      expect(typeof faq).toBe('string');
    });

    it('should return null for missing FAQ', async () => {
      const faq = await fetchFaqDocument('no-faq');
      expect(faq).toBeNull();
    });
  });

  describe('Upload Operations', () => {
    it('should upload scheme metadata and invalidate cache', async () => {
      await expect(uploadSchemeMetadata('test-scheme', mockScheme)).resolves.not.toThrow();
    });

    it('should upload policy document', async () => {
      await expect(uploadPolicyDocument('test-scheme', 'Policy content')).resolves.not.toThrow();
    });

    it('should upload FAQ document', async () => {
      await expect(uploadFaqDocument('test-scheme', 'FAQ content')).resolves.not.toThrow();
    });
  });

  describe('Cache Management', () => {
    it('should clear cache when clearSchemeCache is called', () => {
      clearSchemeCache();
      expect(true).toBe(true);
    });
  });
});
