import { User } from '../types/auth';
import { store } from '../store/store';

interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
}

class UserService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!apiBaseUrl) {
      console.error(
        'NEXT_PUBLIC_API_BASE_URL is not defined. ' +
        'Please ensure .env file exists with NEXT_PUBLIC_API_BASE_URL=http://207.154.226.165:8000 ' +
        'and restart your Next.js development server.'
      );
      return 'http://207.154.226.165:8000';
    }
    
    return apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
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
    
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
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
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getUserById(userId: string): Promise<User> {
    return this.request<User>(`/api/users/${userId}/`);
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    return this.request<User>(`/api/users/${userId}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
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

