import { API_ENDPOINTS } from '../api/config';
import apiClient from '../api/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  is_active?: boolean;
}

export const productService = {
  // Get all products
  async getProducts(): Promise<Product[]> {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.BASE);
  },

  // Get single product by ID
  async getProductById(id: string): Promise<Product> {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  // Create new product
  async createProduct(data: CreateProductData): Promise<Product> {
    return apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, data);
  },

  // Update product
  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    return apiClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), data);
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },
};

export default productService;
