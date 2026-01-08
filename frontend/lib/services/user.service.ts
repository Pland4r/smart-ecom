import { API_ENDPOINTS } from '../api/config';
import apiClient from '../api/client';
import { UserProfile } from './auth.service';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

export const userService = {
  // Get all users (Admin only)
  async getUsers(): Promise<UserProfile[]> {
    return apiClient.get(API_ENDPOINTS.USERS.BASE);
  },

  // Get single user by ID (Admin only)
  async getUserById(id: string): Promise<UserProfile> {
    return apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
  },

  // Update user (Admin only)
  async updateUser(id: string, data: UpdateUserData): Promise<UserProfile> {
    return apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), data);
  },

  // Delete user (Admin only)
  async deleteUser(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  // Create user (Admin only) - using register endpoint
  async createUser(userData: CreateUserData): Promise<UserProfile> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.user;
  },
};

export default userService;
