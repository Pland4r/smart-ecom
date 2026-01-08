import { API_BASE_URL, getAuthHeader, getStoredToken } from './config';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export const apiClient = {
  async request(endpoint: string, options: ApiRequestOptions = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage if not provided
    const token = options.token || getStoredToken();
    
    const { token: _, ...requestOptions } = options;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && getAuthHeader(token)),
      ...requestOptions.headers,
    };

    const config = {
      ...requestOptions,
      headers,
      credentials: 'include' as const,
    };

    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        data.error || data.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  },

  async get(endpoint: string, token?: string) {
    return this.request(endpoint, { method: 'GET', token });
  },

  async post(endpoint: string, body: any, token?: string) {
    return this.request(endpoint, {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  async put(endpoint: string, body: any, token?: string) {
    const authToken = token || getStoredToken();
    if (!authToken) {
      throw new ApiError('Authentication token required', 401);
    }
    return this.request(endpoint, {
      method: 'PUT',
      token: authToken,
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint: string, token?: string) {
    const authToken = token || getStoredToken();
    if (!authToken) {
      throw new ApiError('Authentication token required', 401);
    }
    return this.request(endpoint, {
      method: 'DELETE',
      token: authToken,
    });
  },
};

export default apiClient;
