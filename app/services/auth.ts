import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, AuthError } from '../types/auth';
import { store } from '../store/store';
import { setTokens, clearTokens } from '../store/slices/authSlice';

class AuthService {
  private getBaseURL(): string {
    // In Next.js, NEXT_PUBLIC_ variables are embedded at build time
    // They must be available when the server starts
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Use environment variable or fallback to default backend URL
    const baseUrl = apiBaseUrl || 'https://test.staging.cultiv.llc';
    
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
    const response = await this.request<LoginResponse>('/api/Authentication/login/', {
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
    const response = await this.request<RegisterResponse>('/api/Authentication/register/', {
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

  logoutAndRedirect(): void {
    // Clear tokens from Redux store
    this.logout();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = (decoded.exp as number) * 1000;
    const currentTime = Date.now();
    
    // Consider token expired if it expires within the next 5 seconds (buffer)
    return currentTime >= (expirationTime - 5000);
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