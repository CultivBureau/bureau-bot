import { store } from '../store/store';
import { authService } from './auth';
import type {
  GPTModel,
  ChannelType,
  GPTModelsResponse,
  ChannelTypesResponse,
  ValidateOpenAIKeyRequest,
  ValidateOpenAIKeyResponse,
  CreateBotRequest,
  UpdateBotRequest,
  RestoreBotRequest,
  Bot,
  BotsListResponse,
  GetBotsParams,
} from '../types/bot';

class BotService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
    }
    
    // Remove trailing slash if present (endpoints will include leading slash)
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
    
    // Get valid token (will auto-refresh if expired)
    const token = await authService.getValidToken();
    
    // Check if token exists
    if (!token) {
      authService.logoutAndRedirect();
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

    // Log request details in development


    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        authService.logoutAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
      }
      
      // Handle network errors or cases where response is not ok
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const errorData = await response.json();
          const error = errorData as { detail?: string; error?: string; message?: string };
          errorMessage = error.detail || error.error || error.message || errorMessage;
        } catch {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch {
            // Use default error message
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse JSON response
      try {
        const data = await response.json();
        return data as T;
      } catch {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      if (error instanceof Error) {
        // Don't redirect again if we already handled 401
        if (error.message.includes('session has expired')) {
          throw error;
        }
        // Handle specific network errors
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

  async getGPTModels(): Promise<GPTModel[]> {
    const response = await this.request<GPTModelsResponse>('/api/Bots/gpt-models/');
    return response.gpt_models;
  }

  async getChannelTypes(): Promise<ChannelType[]> {
    const response = await this.request<ChannelTypesResponse>('/api/Bots/channel-types/');
    return response.channel_types;
  }

  async validateOpenAIKey(key: string): Promise<ValidateOpenAIKeyResponse> {
    const requestData: ValidateOpenAIKeyRequest = {
      openaikey: key,
    };
    
    return this.request<ValidateOpenAIKeyResponse>('/api/Bots/validate-openai-key/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async createBot(botData: CreateBotRequest): Promise<Bot> {
    return this.request<Bot>('/api/Bots/', {
      method: 'POST',
      body: JSON.stringify(botData),
    });
  }

  async getBots(params?: GetBotsParams): Promise<BotsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/Bots/?${queryString}` : '/api/Bots/';
    
    return this.request<BotsListResponse>(endpoint);
  }

  async getBotById(botId: string): Promise<Bot> {
    return this.request<Bot>(`/api/Bots/${botId}/`);
  }

  async updateBot(botId: string, botData: UpdateBotRequest): Promise<Bot> {
    return this.request<Bot>(`/api/Bots/${botId}/`, {
      method: 'PUT',
      body: JSON.stringify(botData),
    });
  }

  async deleteBot(botId: string): Promise<void> {
    await this.request<void>(`/api/Bots/${botId}/`, {
      method: 'DELETE',
    });
  }

  async restoreBot(botId: string): Promise<Bot> {
    const requestData: RestoreBotRequest = {
      id: botId,
    };
    
    return this.request<Bot>('/api/Bots/restore/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }
}

export const botService = new BotService();

