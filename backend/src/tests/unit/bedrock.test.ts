import {
  invokeClaudeModel,
  generateEligibilityExplanation,
  generateChatResponse,
  sanitizeUserInput,
  containsApprovalPromise,
  generateFollowUpSuggestions
} from '../../services/bedrock';

// Mock AWS SDK
jest.mock('@aws-sdk/client-bedrock-runtime');

describe('Bedrock Service', () => {
  describe('invokeClaudeModel', () => {
    it('should invoke Claude model with prompt', async () => {
      const response = await invokeClaudeModel('Test prompt');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should include system prompt when provided', async () => {
      const response = await invokeClaudeModel('Test prompt', 'System instructions');
      expect(typeof response).toBe('string');
    });

    it('should respect max tokens parameter', async () => {
      const response = await invokeClaudeModel('Test prompt', undefined, 500);
      expect(typeof response).toBe('string');
    });
  });

  describe('generateEligibilityExplanation', () => {
    const mockProfile = {
      age: 30,
      state: 'MH',
      occupation: 'Farmer',
      annualIncome: 100000,
      gender: 'Male',
      socialCategory: 'General',
      hasDisability: false
    };

    it('should generate explanation for eligible user', async () => {
      const explanation = await generateEligibilityExplanation(
        'Test Scheme',
        'Test description',
        true,
        mockProfile,
        ['Age criteria met', 'Income criteria met'],
        'en'
      );
      expect(typeof explanation).toBe('string');
      expect(explanation.length).toBeGreaterThan(0);
    });

    it('should generate explanation for ineligible user', async () => {
      const explanation = await generateEligibilityExplanation(
        'Test Scheme',
        'Test description',
        false,
        mockProfile,
        ['Age too high'],
        'en'
      );
      expect(typeof explanation).toBe('string');
    });

    it('should support Hindi language', async () => {
      const explanation = await generateEligibilityExplanation(
        'Test Scheme',
        'Test description',
        true,
        mockProfile,
        ['Age criteria met'],
        'hi'
      );
      expect(typeof explanation).toBe('string');
    });
  });

  describe('generateChatResponse', () => {
    const mockProfile = {
      age: 30,
      state: 'MH',
      occupation: 'Farmer',
      annualIncome: 100000,
      socialCategory: 'General'
    };

    it('should generate chat response with RAG context', async () => {
      const result = await generateChatResponse(
        'What schemes am I eligible for?',
        mockProfile,
        [],
        ['Document 1 content', 'Document 2 content'],
        'en'
      );
      expect(result.response).toBeDefined();
      expect(['high', 'medium', 'low']).toContain(result.confidence);
    });

    it('should include conversation history', async () => {
      const history = [
        { role: 'user', message: 'Previous question' },
        { role: 'assistant', message: 'Previous answer' }
      ];
      const result = await generateChatResponse(
        'Follow-up question',
        mockProfile,
        history,
        ['Document content'],
        'en'
      );
      expect(result.response).toBeDefined();
    });

    it('should return low confidence when no documents', async () => {
      const result = await generateChatResponse(
        'Test question',
        mockProfile,
        [],
        [],
        'en'
      );
      expect(result.confidence).toBe('low');
    });

    it('should return high confidence with multiple documents', async () => {
      const result = await generateChatResponse(
        'Test question',
        mockProfile,
        [],
        ['Doc 1', 'Doc 2', 'Doc 3'],
        'en'
      );
      expect(['high', 'medium']).toContain(result.confidence);
    });
  });

  describe('sanitizeUserInput', () => {
    it('should remove angle brackets', () => {
      const sanitized = sanitizeUserInput('Test <script>alert()</script>');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should limit consecutive newlines', () => {
      const sanitized = sanitizeUserInput('Line1\n\n\n\n\nLine2');
      expect(sanitized).not.toMatch(/\n{3,}/);
    });

    it('should trim whitespace', () => {
      const sanitized = sanitizeUserInput('  Test  ');
      expect(sanitized).toBe('Test');
    });

    it('should limit length to 1000 characters', () => {
      const longInput = 'a'.repeat(2000);
      const sanitized = sanitizeUserInput(longInput);
      expect(sanitized.length).toBe(1000);
    });
  });

  describe('containsApprovalPromise', () => {
    it('should detect approval promises', () => {
      expect(containsApprovalPromise('You will get this benefit')).toBe(true);
      expect(containsApprovalPromise('You are approved for this scheme')).toBe(true);
      expect(containsApprovalPromise('Guaranteed approval')).toBe(true);
    });

    it('should not flag safe responses', () => {
      expect(containsApprovalPromise('You may be eligible')).toBe(false);
      expect(containsApprovalPromise('This scheme provides benefits')).toBe(false);
    });
  });

  describe('generateFollowUpSuggestions', () => {
    const mockProfile = { age: 30, state: 'MH' };

    it('should generate eligibility-related suggestions', () => {
      const suggestions = generateFollowUpSuggestions('Am I eligible?', mockProfile);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    it('should generate application-related suggestions', () => {
      const suggestions = generateFollowUpSuggestions('How to apply?', mockProfile);
      expect(suggestions).toContain('Where is the nearest application center?');
    });

    it('should generate benefit-related suggestions', () => {
      const suggestions = generateFollowUpSuggestions('What benefits?', mockProfile);
      expect(suggestions.some(s => s.includes('benefit'))).toBe(true);
    });

    it('should provide default suggestions', () => {
      const suggestions = generateFollowUpSuggestions('Random query', mockProfile);
      expect(suggestions.length).toBe(3);
    });
  });
});
