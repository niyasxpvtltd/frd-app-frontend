import { apiClient, ApiResponse, API_BASE_URL } from './apiClient';

export { API_BASE_URL, apiClient };

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  hasProfile: boolean;
  profile?: any;
}

export const apiService = {
  // Login with email and password
  async login(payload: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', payload);
  },

  // Register a new account with email and password
  async signup(payload: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/signup', payload);
  },

  // Create or update user profile (name, gender, dob, bio)
  async createProfile(
    payload: { fullName: string; gender: string; dob: string; bio?: string; location?: string },
    token: string
  ): Promise<ApiResponse<any>> {
    return apiClient.post('/user/profile', payload, { token });
  },

  // Get auth status & user profile
  async getMe(token: string): Promise<ApiResponse<any>> {
    return apiClient.get('/auth/me', { token });
  },

  // Get user profile directly
  async getMyProfile(token: string): Promise<ApiResponse<any>> {
    return apiClient.get('/user/profile', { token });
  },
};
