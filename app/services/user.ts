import { User } from '../types/auth';
import { store } from '../store/store';
import { authService } from './auth';

interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
}

interface UpdateUserResponse {
  message: string;
  user: User;
}

class UserService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Use environment variable or fallback to default backend URL
    const baseUrl = apiBaseUrl || 'https://bot-linker-backend.cultivbureau.com';
    
    // Remove trailing slash if present (endpoints will include leading slash)
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private getAuthToken(): string | null {
    const state = store.getState();
    return state.auth.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;
    const token = this.getAuthToken();
    
    // Check if token exists
    if (!token) {
      authService.logoutAndRedirect();
      throw new Error('Authentication token not found. Please log in again.');
    }

    // Check if token is expired before making the request
    if (authService.isTokenExpired()) {
      authService.logoutAndRedirect();
      throw new Error('Your session has expired. Please log in again.');
    }

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        authService.logoutAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
      }

      const data = await response.json();

      if (!response.ok) {
        const error = data as { detail?: string; error?: string; message?: string };
        throw new Error(
          error.detail ||
          error.error ||
          error.message ||
          `Request failed with status ${response.status}`
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        // Don't redirect again if we already handled 401
        if (error.message.includes('session has expired')) {
          throw error;
        }
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getUserById(userId: string): Promise<User> {
    return this.request<User>(`/api/users/${userId}/`);
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await this.request<UpdateUserResponse>(`/api/users/${userId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.user;
  }

  async getCurrentUser(): Promise<User> {
    const state = store.getState();
    const userId = state.auth.decodedToken?.user_id as string;
    
    if (!userId) {
      throw new Error('User ID not found in token. Please log in again.');
    }

    return this.getUserById(userId);
  }

  async updateCurrentUser(userData: UpdateUserRequest): Promise<User> {
    const state = store.getState();
    const userId = state.auth.decodedToken?.user_id as string;
    
    if (!userId) {
      throw new Error('User ID not found in token. Please log in again.');
    }

    return this.updateUser(userId, userData);
  }
}

export const userService = new UserService();

