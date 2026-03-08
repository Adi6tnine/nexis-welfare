import {
  extractKeywords,
  retrieveRelevantDocuments,
  extractRelevantSnippets,
  identifySchemeEntities
} from '../../services/rag';

// Mock S3 service
jest.mock('../../services/s3');

describe('RAG Service', () => {
  describe('extractKeywords', () => {
    it('should extract keywords from query', () => {
      const keywords = extractKeywords('What schemes are available for farmers?');
      expect(keywords).toContain('schemes');
      expect(keywords).toContain('available');
      expect(keywords).toContain('farmers');
    });

    it('should remove stop words', () => {
      const keywords = extractKeywords('What is the eligibility for this scheme?');
      expect(keywords).not.toContain('what');
      expect(keywords).not.toContain('the');
      expect(keywords).not.toContain('for');
      expect(keywords).toContain('eligibility');
      expect(keywords).toContain('scheme');
    });

    it('should filter short words', () => {
      const keywords = extractKeywords('I am a farmer in MH');
      expect(keywords).not.toContain('am');
      expect(keywords).toContain('farmer');
    });

    it('should return unique keywords', () => {
      const keywords = extractKeywords('scheme scheme scheme');
      expect(keywords.filter(k => k === 'scheme').length).toBe(1);
    });

    it('should handle empty query', () => {
      const keywords = extractKeywords('');
      expect(keywords).toEqual([]);
    });
  });

  describe('retrieveRelevantDocuments', () => {
    const mockProfile = {
      state: 'MH',
      occupation: 'Farmer',
      socialCategory: 'General'
    };

    it('should retrieve relevant documents', async () => {
      const documents = await retrieveRelevantDocuments(
        'What schemes are available?',
        mockProfile,
        3
      );
      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBeLessThanOrEqual(3);
    });

    it('should filter by user profile', async () => {
      const documents = await retrieveRelevantDocuments(
        'Farmer schemes',
        mockProfile,
        5
      );
      expect(Array.isArray(documents)).toBe(true);
    });

    it('should return empty array when no schemes available', async () => {
      const documents = await retrieveRelevantDocuments(
        'Test query',
        mockProfile,
        3
      );
      expect(documents).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      const documents = await retrieveRelevantDocuments(
        'Error query',
        mockProfile,
        3
      );
      expect(Array.isArray(documents)).toBe(true);
    });
  });

  describe('extractRelevantSnippets', () => {
    const document = 'This is a test document about farmer schemes. Farmers can benefit from various government programs. The eligibility criteria include age and income requirements.';

    it('should extract snippets around keywords', () => {
      const snippets = extractRelevantSnippets(document, ['farmer', 'eligibility'], 50);
      expect(snippets.length).toBeGreaterThan(0);
      expect(snippets.some(s => s.includes('farmer'))).toBe(true);
    });

    it('should limit snippet length', () => {
      const snippets = extractRelevantSnippets(document, ['farmer'], 30);
      snippets.forEach(snippet => {
        expect(snippet.length).toBeLessThanOrEqual(40); // Including ellipsis
      });
    });

    it('should add ellipsis when not at boundaries', () => {
      const snippets = extractRelevantSnippets(document, ['benefit'], 20);
      expect(snippets.some(s => s.includes('...'))).toBe(true);
    });

    it('should return at most 3 snippets', () => {
      const snippets = extractRelevantSnippets(document, ['a', 'the', 'is'], 50);
      expect(snippets.length).toBeLessThanOrEqual(3);
    });
  });

  describe('identifySchemeEntities', () => {
    it('should identify scheme names', () => {
      const entities = identifySchemeEntities('Tell me about PM-KISAN scheme');
      expect(entities.schemeNames).toContain('pm-kisan');
    });

    it('should identify benefit types', () => {
      const entities = identifySchemeEntities('What financial assistance is available?');
      expect(entities.benefitTypes).toContain('financial');
    });

    it('should identify document types', () => {
      const entities = identifySchemeEntities('Do I need Aadhar card and PAN?');
      expect(entities.documentTypes).toContain('aadhar');
      expect(entities.documentTypes).toContain('pan');
    });

    it('should handle queries with multiple entity types', () => {
      const entities = identifySchemeEntities('PM-KISAN provides cash subsidy, need Aadhar');
      expect(entities.schemeNames.length).toBeGreaterThan(0);
      expect(entities.benefitTypes.length).toBeGreaterThan(0);
      expect(entities.documentTypes.length).toBeGreaterThan(0);
    });

    it('should return empty arrays when no entities found', () => {
      const entities = identifySchemeEntities('Random query');
      expect(entities.schemeNames).toEqual([]);
      expect(entities.benefitTypes).toEqual([]);
      expect(entities.documentTypes).toEqual([]);
    });
  });
});
