import { store } from '../store/store';
import { authService } from './auth';

export type IntegrationType = 'BITRIX' | 'ODOO' | 'SALESFORCE' | 'HUBSPOT';

export interface Function {
  id: string;
  bot: string;
  bot_id: string;
  name: string;
  integration_type: IntegrationType;
  integration_type_display: string;
  is_active: boolean;
  trigger_instructions?: string | null;
  result_format?: string | null;
  created_by?: string | null;
  created_on: string;
  updated_by?: string | null;
  updated_on: string;
}

export interface CreateFunctionRequest {
  bot: string;
  name: string;
  integration_type: IntegrationType;
  is_active: boolean;
  trigger_instructions?: string | null;
  result_format?: string | null;
}

export interface UpdateFunctionRequest {
  bot?: string;
  name?: string;
  integration_type?: IntegrationType;
  is_active?: boolean;
  trigger_instructions?: string | null;
  result_format?: string | null;
}

export interface FunctionsListResponse {
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: Function[];
}

export interface GetFunctionsParams {
  pageNumber?: number;
  pageSize?: number;
  bot_id?: string;
  integration_type?: IntegrationType;
  name?: string;
  is_active?: boolean;
}

class FunctionsService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const baseUrl = apiBaseUrl || 'http://207.154.226.165:8000';
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
      
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const errorData = await response.json();
          const error = errorData as { detail?: string; error?: string; message?: string };
          errorMessage = error.detail || error.error || error.message || errorMessage;
        } catch {
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch {
            // Use default error message
          }
        }
        
        throw new Error(errorMessage);
      }

      try {
        const data = await response.json();
        return data as T;
      } catch {
        throw new Error('Invalid response format from server');
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

  async getFunctions(params?: GetFunctionsParams): Promise<FunctionsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.bot_id) {
      queryParams.append('bot_id', params.bot_id);
    }
    if (params?.integration_type) {
      queryParams.append('integration_type', params.integration_type);
    }
    if (params?.name) {
      queryParams.append('name', params.name);
    }
    if (params?.is_active !== undefined) {
      queryParams.append('is_active', params.is_active.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/functions/?${queryString}` : '/api/functions/';
    
    return this.request<FunctionsListResponse>(endpoint);
  }

  async getFunctionById(functionId: string): Promise<Function> {
    return this.request<Function>(`/api/functions/${functionId}/`);
  }

  async createFunction(functionData: CreateFunctionRequest): Promise<Function> {
    return this.request<Function>('/api/functions/', {
      method: 'POST',
      body: JSON.stringify(functionData),
    });
  }

  async updateFunction(functionId: string, functionData: UpdateFunctionRequest): Promise<Function> {
    return this.request<Function>(`/api/functions/${functionId}/`, {
      method: 'PUT',
      body: JSON.stringify(functionData),
    });
  }

  async partialUpdateFunction(functionId: string, functionData: Partial<UpdateFunctionRequest>): Promise<Function> {
    return this.request<Function>(`/api/functions/${functionId}/`, {
      method: 'PATCH',
      body: JSON.stringify(functionData),
    });
  }

  async deleteFunction(functionId: string): Promise<void> {
    await this.request<void>(`/api/functions/${functionId}/`, {
      method: 'DELETE',
    });
  }
}

export const functionsService = new FunctionsService();

