import axios, { AxiosInstance, AxiosError } from 'axios';
import { checkEligibilityMock } from './mockEligibility';

// USE MOCK DATA FOR DEMO - Set to false to use real API
const USE_MOCK = false;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4566';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-api-key';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY
  }
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 503 && originalRequest) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiClient(originalRequest);
    }

    console.error('API Error:', error.response?.status, error.message);
    console.error('API Error Response:', error.response?.data);
    return Promise.reject(error);
  }
);

export interface UserProfile {
  age: number;
  state: string;
  occupation: string;
  annualIncome: number;
  gender: 'Male' | 'Female' | 'Other';
  socialCategory: 'General' | 'OBC' | 'SC' | 'ST';
  hasDisability: boolean;
}

export interface EligibilityResult {
  resultId: string;
  timestamp: string;
  eligibleSchemes: Array<{
    schemeId: string;
    schemeName: string;
    description: string;
    benefits: string;
    satisfiedCriteria: string[];
    matchScore: number;
  }>;
  ineligibleSchemes: Array<{
    schemeId: string;
    schemeName: string;
    description: string;
    unsatisfiedCriteria: Array<{
      criterion: string;
      reason: string;
    }>;
  }>;
  totalSchemes: number;
}

export interface ExplanationResponse {
  explanation: string;
  alternativeSchemes: string[];
  generatedAt: string;
  cached?: boolean;
}

export interface ChatResponse {
  response: string;
  sources: string[];
  confidence: 'high' | 'medium' | 'low';
  followUpSuggestions: string[];
  sessionId: string;
}

// State name to code mapping
const STATE_NAME_TO_CODE: Record<string, string> = {
  'Andhra Pradesh': 'AP',
  'Bihar': 'BR',
  'Delhi': 'DL',
  'Gujarat': 'GJ',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Maharashtra': 'MH',
  'Tamil Nadu': 'TN',
  'Uttar Pradesh': 'UP',
  'West Bengal': 'WB'
};

// Occupation mapping for backward compatibility
const OCCUPATION_MAPPING: Record<string, string> = {
  'Worker': 'Daily Wage Worker',
  'Business': 'Self-Employed',
  'Retired': 'Other',
  'Employed': 'Private Sector'
};

export async function checkEligibility(profile: UserProfile): Promise<EligibilityResult> {
  // USE MOCK DATA FOR DEMO
  if (USE_MOCK) {
    console.log('Using MOCK eligibility data for demo');
    return checkEligibilityMock(profile);
  }

  // Convert state name to code if needed
  const stateCode = STATE_NAME_TO_CODE[profile.state] || profile.state;
  
  // Map old occupation values to new ones
  const occupation = OCCUPATION_MAPPING[profile.occupation] || profile.occupation;
  
  // Build profile with only expected fields
  const profileToSend = {
    age: profile.age,
    state: stateCode,
    occupation: occupation,
    annualIncome: profile.annualIncome,
    gender: profile.gender,
    socialCategory: profile.socialCategory,
    hasDisability: profile.hasDisability || false
  };
  
  console.log('Sending profile to API:', profileToSend);
  
  // Don't send userId if it's not a valid UUID
  const payload: any = { profile: profileToSend };
  
  // Only include userId if it's a valid UUID format
  if (profile.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profile.userId)) {
    payload.userId = profile.userId;
  }
  
  const response = await apiClient.post('/eligibility/check', payload);
  return response.data.data;
}

export async function getExplanation(
  resultId: string,
  schemeId: string,
  language: 'en' | 'hi' = 'en'
): Promise<ExplanationResponse> {
  const response = await apiClient.post('/ai/explain', {
    resultId,
    schemeId,
    language
  });
  return response.data.data;
}

export async function sendChatMessage(
  message: string,
  userProfile: UserProfile,
  sessionId?: string,
  language: 'en' | 'hi' = 'en'
): Promise<ChatResponse> {
  const response = await apiClient.post('/chat/message', {
    message,
    userProfile,
    sessionId,
    language
  });
  return response.data.data;
}

export async function saveProfile(profile: UserProfile): Promise<{ userId: string }> {
  const response = await apiClient.post('/profiles', { profile });
  return response.data.data;
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const response = await apiClient.get(`/profiles/${userId}`);
  return response.data.data.profile;
}

export async function updateProfile(userId: string, profile: UserProfile): Promise<void> {
  await apiClient.put(`/profiles/${userId}`, { profile });
}

export async function deleteProfile(userId: string): Promise<void> {
  await apiClient.delete(`/profiles/${userId}`);
}

export default apiClient;
