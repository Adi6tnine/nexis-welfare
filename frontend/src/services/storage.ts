import { UserProfile, EligibilityResult } from './api';

const PROFILE_KEY = 'nexis_user_profile';
const LANGUAGE_KEY = 'nexis_language';
const RESULT_KEY = 'nexis_eligibility_result';
const RESULT_TIMESTAMP_KEY = 'nexis_result_timestamp';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
}

export function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error('Failed to clear profile:', error);
  }
}

export function saveLanguage(language: string): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language:', error);
  }
}

export function getLanguage(): string {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return stored || 'en';
  } catch (error) {
    console.error('Failed to get language:', error);
    return 'en';
  }
}

export function cacheEligibilityResult(result: EligibilityResult): void {
  try {
    localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    localStorage.setItem(RESULT_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache result:', error);
  }
}

export function getCachedResult(): EligibilityResult | null {
  try {
    const stored = localStorage.getItem(RESULT_KEY);
    const timestamp = localStorage.getItem(RESULT_TIMESTAMP_KEY);

    if (!stored || !timestamp) {
      return null;
    }

    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CACHE_DURATION) {
      clearCache();
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get cached result:', error);
    return null;
  }
}

export function clearCache(): void {
  try {
    localStorage.removeItem(RESULT_KEY);
    localStorage.removeItem(RESULT_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

export function clearAll(): void {
  clearProfile();
  clearCache();
}
