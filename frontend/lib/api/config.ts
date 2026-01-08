// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    BASE: '/api/auth/admin/users',
    BY_ID: (id: string) => `/api/auth/admin/users/${id}`,
  },
  PRODUCTS: {
    BASE: '/api/products/',
    BY_ID: (id: string) => `/api/products/${id}`,
  },
  CATEGORIES: {
    BASE: '/api/categories/',
    BY_ID: (id: string) => `/api/categories/${id}`,
  },
  AI: {
    RECOMMEND: '/api/ai/recommend',
    RECOMMEND_CATEGORY: '/api/ai/recommend/category',
    RECOMMEND_PRICE: '/api/ai/recommend/price',
    GENERATE_DESCRIPTION: '/api/ai/generate/description',
  },
};

export const getAuthHeader = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

// Helper function to get token from localStorage
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

// Helper function to store token
export const storeToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
};

// Helper function to remove token
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
};
