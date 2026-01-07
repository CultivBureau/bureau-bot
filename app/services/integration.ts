import { store } from '../store/store';
import { authService } from './auth';

interface GenerateLinkRequest {
  client_id: string;
  client_secret: string;
  portal_domain: string;
  bot_id: string;
  type: 'BITRIX';
}

interface GenerateLinkResponse {
  status: string;
  integration_id: string;
  webhook_url: string;
}

interface SaveTokensRequest {
  integration_id: string;
  access_token: string;
  refresh_token: string;
}

interface SaveTokensResponse {
  status: string;
}

interface RegisterBotRequest {
  bot_id: string;
}

interface RegisterBotResponse {
  status: string;
  bitrix_bot_id?: number;
  bot_code?: string;
  bot_name?: string;
  endpoints?: any;
}

class IntegrationService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const baseUrl = apiBaseUrl || 'https://bot-linker-backend.cultivbureau.com';
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
    
    if (!token) {
      authService.logoutAndRedirect();
      throw new Error('Authentication token not found. Please log in again.');
    }

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

    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', { url, method: config.method || 'GET' });
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        authService.logoutAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
      }
      
      if (response.status === 204) {
        return {} as T;
      }
      
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        let errorDetails: any = null;
        
        try {
          const errorData = await response.json();
          errorDetails = errorData;
          const error = errorData as { detail?: string; error?: string; message?: string };
          errorMessage = error.detail || error.error || error.message || errorMessage;
          
          // Log full error details in development
          if (process.env.NODE_ENV === 'development') {
            console.error('API Error Response:', {
              status: response.status,
              url,
              method: config.method || 'GET',
              error: errorData,
            });
          }
        } catch {
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
            if (process.env.NODE_ENV === 'development') {
              console.error('API Error Response (text):', {
                status: response.status,
                url,
                method: config.method || 'GET',
                text: text || '(empty)',
              });
            }
          } catch {
            // Use default error message
            if (process.env.NODE_ENV === 'development') {
              console.error('API Error Response (no body):', {
                status: response.status,
                url,
                method: config.method || 'GET',
                statusText: response.statusText,
              });
            }
          }
        }
        
        // Include more context for 404 errors
        if (response.status === 404) {
          errorMessage = `Endpoint not found (404): ${url}. Please verify the endpoint path is correct.`;
        }
        
        throw new Error(errorMessage);
      }

      try {
        const data = await response.json();
        return data as T;
      } catch {
        return {} as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('session has expired')) {
          throw error;
        }
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          throw new Error(
            'Unable to connect to the server. Please check your internet connection and try again.'
          );
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Generate integration link
  async generateLink(data: GenerateLinkRequest): Promise<GenerateLinkResponse> {
    // Try both singular and plural forms
    try {
      return await this.request<GenerateLinkResponse>('/api/Integrations/generate-link/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      // If 404, try singular form
      if (error?.message?.includes('404')) {
        return await this.request<GenerateLinkResponse>('/api/Integration/generate-link/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      throw error;
    }
  }

  // Save OAuth tokens
  async saveTokens(data: SaveTokensRequest): Promise<SaveTokensResponse> {
    // Try both singular and plural forms
    try {
      return await this.request<SaveTokensResponse>('/api/Integrations/save-tokens/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      // If 404, try singular form
      if (error?.message?.includes('404')) {
        return await this.request<SaveTokensResponse>('/api/Integration/save-tokens/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      throw error;
    }
  }

  // Register bot with Bitrix24
  async registerBot(data: RegisterBotRequest): Promise<RegisterBotResponse> {
    return await this.request<RegisterBotResponse>('/api/Bitrix/register-bot/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}

export const integrationService = new IntegrationService();

