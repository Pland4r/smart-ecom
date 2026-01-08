import { API_ENDPOINTS } from '../api/config';
import { storeToken, removeToken, getStoredToken } from '../api/config';
import apiClient from '../api/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: UserProfile;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Store the access token in localStorage
    if (response.access_token) {
      storeToken(response.access_token);
    }
    
    return response;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    
    // Store the access token in localStorage
    if (response.access_token) {
      storeToken(response.access_token);
    }
    
    return response;
  },

  async getProfile(): Promise<UserProfile> {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE, token);
  },

  async refreshToken(): Promise<{ access_token: string }> {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {});
  },

  async logout() {
    try {
      removeToken();
      // Note: Backend doesn't have a logout endpoint, we just clear the token
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token even if there's an error
      removeToken();
    }
  },

  // Helper to check if user is authenticated
  isAuthenticated(): boolean {
    return !!getStoredToken();
  },

  // Helper to check if user is admin
  isAdmin(user: UserProfile | null): boolean {
    return user?.role === 'admin';
  },

  // Get stored token
  getToken(): string | null {
    return getStoredToken();
  },
};

export default authService;
