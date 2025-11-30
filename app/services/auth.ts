import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, AuthError } from '../types/auth';
import { store } from '../store/store';
import { setTokens, clearTokens } from '../store/slices/authSlice';

class AuthService {
  private getBaseURL(): string {
    // In Next.js, NEXT_PUBLIC_ variables are embedded at build time
    // They must be available when the server starts
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Use environment variable or fallback to default backend URL
    const baseUrl = apiBaseUrl || 'http://207.154.226.165:8000';
    
    // Remove trailing slash if present (endpoints will include leading slash)
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error: AuthError = data;
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

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/authentication/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens in Redux store
    store.dispatch(setTokens({
      token: response.token,
      refreshToken: response.refresh_token,
    }));

    return response;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/api/authentication/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store tokens in Redux store
    if (response.tokens) {
      store.dispatch(setTokens({
        token: response.tokens.access,
        refreshToken: response.tokens.refresh,
      }));
    }

    return response;
  }

  logout(): void {
    // Clear tokens from Redux store
    store.dispatch(clearTokens());
  }

  getToken(): string | null {
    const state = store.getState();
    return state.auth.token;
  }

  getRefreshToken(): string | null {
    const state = store.getState();
    return state.auth.refreshToken;
  }

  getDecodedToken(): Record<string, unknown> | null {
    const state = store.getState();
    return state.auth.decodedToken;
  }

  isAuthenticated(): boolean {
    const state = store.getState();
    return state.auth.isAuthenticated;
  }
}

export const authService = new AuthService();