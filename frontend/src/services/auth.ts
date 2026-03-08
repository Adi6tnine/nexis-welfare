// User Authentication Service
import apiClient from './api';

export interface User {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Local storage keys
const TOKEN_KEY = 'nexis_auth_token';
const USER_KEY = 'nexis_user';

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await apiClient.post('/auth/register', data);
    const authData: AuthResponse = response.data.data;
    
    // Store auth data
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    
    return authData;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.error?.message || 'Registration failed');
  }
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const authData: AuthResponse = response.data.data;
    
    // Store auth data
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    
    // Set token in API client headers
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
    
    return authData;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.error?.message || 'Login failed');
  }
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete apiClient.defaults.headers.common['Authorization'];
}

/**
 * Get current user from local storage
 */
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
}

/**
 * Initialize auth (call on app startup)
 */
export function initializeAuth(): void {
  const token = getAuthToken();
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

/**
 * Verify token is still valid
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const response = await apiClient.get('/auth/verify');
    return response.data.data.valid;
  } catch {
    // Token invalid, clear auth data
    logout();
    return false;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await apiClient.post('/auth/forgot-password', { email });
  } catch (error: any) {
    console.error('Password reset request error:', error);
    throw new Error(error.response?.data?.error?.message || 'Password reset request failed');
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.response?.data?.error?.message || 'Password reset failed');
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: Partial<User>): Promise<User> {
  try {
    const response = await apiClient.put('/auth/profile', updates);
    const updatedUser: User = response.data.data.user;
    
    // Update local storage
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error: any) {
    console.error('Profile update error:', error);
    throw new Error(error.response?.data?.error?.message || 'Profile update failed');
  }
}
