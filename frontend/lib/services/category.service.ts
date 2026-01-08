import { API_ENDPOINTS } from '../api/config';
import apiClient from '../api/client';

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
  slug: string;
  image_url?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  is_active?: boolean;
}

export const categoryService = {
  // Get all categories (Public)
  async getCategories(): Promise<Category[]> {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
  },

  // Get single category by ID (Public)
  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  // Create new category (Admin only)
  async createCategory(data: CreateCategoryData): Promise<Category> {
    return apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, data);
  },

  // Update category (Admin only)
  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    return apiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), data);
  },

  // Delete category (Admin only)
  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

export default categoryService;
