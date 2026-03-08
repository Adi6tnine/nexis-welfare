// @ts-nocheck
import { fetchPolicyDocument, fetchFaqDocument, fetchAllSchemes } from './s3';

/**
 * Document with relevance score
 */
interface ScoredDocument {
  content: string;
  source: string;
  score: number;
}

/**
 * Extract keywords from user query
 */
export function extractKeywords(query: string): string[] {
  // Convert to lowercase and remove punctuation
  const cleaned = query.toLowerCase().replace(/[^\w\s]/g, ' ');

  // Split into words
  const words = cleaned.split(/\s+/).filter(word => word.length > 2);

  // Remove common stop words
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'that', 'this',
    'what', 'how', 'when', 'where', 'who', 'why', 'can', 'could', 'would',
    'should', 'will', 'do', 'does', 'did', 'have', 'has', 'had', 'am',
    'are', 'was', 'were', 'been', 'being', 'my', 'your', 'his', 'her',
    'its', 'our', 'their', 'me', 'you', 'him', 'her', 'us', 'them'
  ]);

  const keywords = words.filter(word => !stopWords.has(word));

  // Return unique keywords
  return [...new Set(keywords)];
}

/**
 * Calculate relevance score for a document based on keywords
 */
function calculateRelevanceScore(document: string, keywords: string[]): number {
  if (keywords.length === 0) return 0;

  const docLower = document.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    // Count occurrences of keyword
    const regex = new RegExp(keyword, 'gi');
    const matches = docLower.match(regex);
    const count = matches ? matches.length : 0;

    // Weight by keyword length (longer keywords are more specific)
    const weight = Math.min(keyword.length / 5, 2);
    score += count * weight;
  }

  // Normalize by document length
  const normalizedScore = score / (document.length / 1000);

  return normalizedScore;
}

/**
 * Retrieve relevant documents for a user query using keyword matching
 */
export async function retrieveRelevantDocuments(
  query: string,
  userProfile: {
    state: string;
    occupation: string;
    socialCategory: string;
  },
  maxDocuments: number = 3
): Promise<string[]> {
  try {
    // Extract keywords from query
    const keywords = extractKeywords(query);

    console.log('Extracting keywords from query', {
      query,
      keywords,
      keywordCount: keywords.length
    });

    // Fetch all schemes
    const schemes = await fetchAllSchemes();

    if (schemes.length === 0) {
      console.warn('No schemes available for RAG');
      return [];
    }

    // Filter schemes relevant to user profile
    const relevantSchemes = schemes.filter(scheme => {
      const criteria = scheme.eligibilityCriteria;

      // Check if scheme is relevant to user's state
      if (criteria.states && criteria.states.length > 0) {
        if (!criteria.states.includes(userProfile.state)) {
          return false;
        }
      }

      // Check if scheme is relevant to user's occupation
      if (criteria.occupations && criteria.occupations.length > 0) {
        if (!criteria.occupations.includes(userProfile.occupation)) {
          return false;
        }
      }

      // Check if scheme is relevant to user's social category
      if (criteria.socialCategories && criteria.socialCategories.length > 0) {
        if (!criteria.socialCategories.includes(userProfile.socialCategory)) {
          return false;
        }
      }

      return true;
    });

    console.log('Filtered schemes by user profile', {
      totalSchemes: schemes.length,
      relevantSchemes: relevantSchemes.length
    });

    // Fetch documents for relevant schemes
    const documentPromises: Promise<ScoredDocument | null>[] = [];

    for (const scheme of relevantSchemes.slice(0, 10)) { // Limit to 10 schemes
      // Fetch policy document
      documentPromises.push(
        fetchPolicyDocument(scheme.schemeId).then(content => {
          if (!content) return null;

          const score = calculateRelevanceScore(content, keywords);
          return {
            content: `Scheme: ${scheme.schemeName}\n\n${content}`,
            source: `${scheme.schemeId}/policy.txt`,
            score
          };
        }).catch(() => null)
      );

      // Fetch FAQ document
      documentPromises.push(
        fetchFaqDocument(scheme.schemeId).then(content => {
          if (!content) return null;

          const score = calculateRelevanceScore(content, keywords);
          return {
            content: `Scheme: ${scheme.schemeName} (FAQ)\n\n${content}`,
            source: `${scheme.schemeId}/faq.txt`,
            score
          };
        }).catch(() => null)
      );
    }

    // Wait for all documents
    const documents = await Promise.all(documentPromises);

    // Filter out null documents and sort by relevance score
    const scoredDocuments = documents
      .filter((doc): doc is ScoredDocument => doc !== null && doc.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log('Retrieved and scored documents', {
      totalDocuments: scoredDocuments.length,
      topScores: scoredDocuments.slice(0, 3).map(d => d.score)
    });

    // Return top N documents
    const topDocuments = scoredDocuments
      .slice(0, maxDocuments)
      .map(doc => doc.content);

    return topDocuments;

  } catch (error) {
    console.error('Error retrieving documents', { error });
    return [];
  }
}

/**
 * Extract document snippets around keywords
 */
export function extractRelevantSnippets(
  document: string,
  keywords: string[],
  snippetLength: number = 200
): string[] {
  const snippets: string[] = [];
  const docLower = document.toLowerCase();

  for (const keyword of keywords) {
    const index = docLower.indexOf(keyword.toLowerCase());

    if (index !== -1) {
      // Extract snippet around keyword
      const start = Math.max(0, index - snippetLength / 2);
      const end = Math.min(document.length, index + snippetLength / 2);

      let snippet = document.substring(start, end);

      // Add ellipsis if not at start/end
      if (start > 0) snippet = '...' + snippet;
      if (end < document.length) snippet = snippet + '...';

      snippets.push(snippet);
    }
  }

  return snippets.slice(0, 3); // Return top 3 snippets
}

/**
 * Identify scheme-related entities in query
 */
export function identifySchemeEntities(query: string): {
  schemeNames: string[];
  benefitTypes: string[];
  documentTypes: string[];
} {
  const queryLower = query.toLowerCase();

  // Common scheme name patterns
  const schemePatterns = [
    'pm-kisan', 'pmkisan', 'kisan',
    'ayushman', 'pmjay',
    'pmay', 'housing',
    'ujjwala', 'lpg',
    'mudra', 'loan'
  ];

  const schemeNames = schemePatterns.filter(pattern =>
    queryLower.includes(pattern)
  );

  // Benefit types
  const benefitPatterns = [
    'money', 'cash', 'financial', 'subsidy', 'pension',
    'insurance', 'health', 'education', 'housing', 'loan'
  ];

  const benefitTypes = benefitPatterns.filter(pattern =>
    queryLower.includes(pattern)
  );

  // Document types
  const documentPatterns = [
    'aadhar', 'aadhaar', 'pan', 'ration card', 'income certificate',
    'caste certificate', 'disability certificate', 'bank account'
  ];

  const documentTypes = documentPatterns.filter(pattern =>
    queryLower.includes(pattern)
  );

  return {
    schemeNames,
    benefitTypes,
    documentTypes
  };
}
