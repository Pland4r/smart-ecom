import { API_ENDPOINTS } from '../api/config';
import apiClient from '../api/client';

export interface ProductRecommendationRequest {
  product_id?: string;
  category?: string;
  price_range?: {
    min: number;
    max: number;
  };
  preferences?: string[];
}

export interface ProductRecommendationResponse {
  recommendations: string; // AI text response
  products: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image_url?: string;
    stock: number;
  }>;
}

export interface CategoryRecommendationRequest {
  category: string;
  user_preferences?: string[];
}

export interface CategoryRecommendationResponse {
  recommendations: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    score: number;
    reason: string;
  }>;
}

export interface PriceBasedRecommendationRequest {
  price_range: {
    min: number;
    max: number;
  };
  category?: string;
}

export interface PriceBasedRecommendationResponse {
  recommendations: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    score: number;
    reason: string;
  }>;
}

export interface GenerateDescriptionRequest {
  product_name: string;
  category: string;
  price: number;
  additional_info?: string;
}

export interface GenerateDescriptionResponse {
  description: string;
  features: string[];
  benefits: string[];
}

export const aiService = {
  // Get product recommendations based on various criteria
  async getProductRecommendations(request: ProductRecommendationRequest): Promise<ProductRecommendationResponse> {
    // Map frontend request to backend expected format
    const backendRequest = {
      query: request.preferences?.join(' ') || request.query || '',
      filters: request.filters || {},
      category: request.category,
      price_range: request.price_range
    };
    return apiClient.post(API_ENDPOINTS.AI.RECOMMEND, backendRequest);
  },

  // Get category-based recommendations
  async getCategoryRecommendations(request: CategoryRecommendationRequest): Promise<CategoryRecommendationResponse> {
    return apiClient.post(API_ENDPOINTS.AI.RECOMMEND_CATEGORY, request);
  },

  // Get price-based recommendations
  async getPriceBasedRecommendations(request: PriceBasedRecommendationRequest): Promise<PriceBasedRecommendationResponse> {
    return apiClient.post(API_ENDPOINTS.AI.RECOMMEND_PRICE, request);
  },

  // Generate product description using AI
  async generateProductDescription(request: GenerateDescriptionRequest): Promise<GenerateDescriptionResponse> {
    return apiClient.post(API_ENDPOINTS.AI.GENERATE_DESCRIPTION, request);
  },
};

export default aiService;
