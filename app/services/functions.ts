import { store } from '../store/store';
import { authService } from './auth';

export interface BitrixFieldMapping {
  id?: string;
  function?: string;
  name: string;
  description: string;
  crm_field_name: string;
  crm_field_code: string;
  data_type: string;
  created_on?: string;
}

export interface Function {
  id: string;
  bot: string;
  bot_id: string;
  name: string;
  trigger_instructions: string;
  result_format?: string;
  bitrix_field_mappings: BitrixFieldMapping[];
  created_on?: string;
  updated_on?: string;
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

interface GetFunctionsParams {
  bot_id?: string;
  pageNumber?: number;
  pageSize?: number;
  name?: string;
}

interface CreateFunctionData {
  bot: string;
  name: string;
  trigger_instructions: string;
  result_format?: string;
  bitrix_field_mappings: Array<{
    id?: string;
    name: string;
    description: string;
    crm_field_name: string;
    crm_field_code: string;
    data_type: string;
  }>;
}

interface UpdateFunctionData extends CreateFunctionData {}

class FunctionsService {
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



    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        authService.logoutAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
      }
      
      if (response.status === 204) {
        // No content for DELETE requests
        return {} as T;
      }
      
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        let errorDetails: any = null;
        
        // Clone response to read body without consuming it
        const responseClone = response.clone();
        
        try {
          const errorData = await responseClone.json();
          errorDetails = errorData;
          const error = errorData as { 
            detail?: string; 
            error?: string; 
            message?: string;
            errors?: any;
          };
          errorMessage = error.detail || error.error || error.message || errorMessage;

        } catch (jsonError) {
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;

          } catch (textError) {
            // Response has no body or can't be read

          }
        }
        
        // Include more context for 500 errors
        if (response.status === 500) {
          const requestInfo = `URL: ${url}, Method: ${config.method || 'GET'}`;
          errorMessage = `Server error (500): ${errorMessage}. ${requestInfo}. This is likely a backend issue - please check server logs.`;
        }
        
        throw new Error(errorMessage);
      }

      try {
        const data = await response.json();
        return data as T;
      } catch {
        // For 204 responses, return empty object
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

  // Get all functions with filtering and pagination
  async getFunctions(params?: GetFunctionsParams): Promise<FunctionsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.bot_id) {
      queryParams.append('bot_id', params.bot_id);
    }
    if (params?.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.name) {
      queryParams.append('name', params.name);
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/Functions/?${queryString}` : '/api/Functions/';
    
    return await this.request<FunctionsListResponse>(endpoint, { method: 'GET' });
  }

  // Get a single function by ID
  async getFunction(id: string): Promise<Function> {
    return await this.request<Function>(`/api/Functions/${id}/`, { method: 'GET' });
  }

  // Create a new function
  async createFunction(data: CreateFunctionData): Promise<Function> {
    return await this.request<Function>('/api/Functions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  // Update a function
  async updateFunction(id: string, data: UpdateFunctionData): Promise<Function> {
    return await this.request<Function>(`/api/Functions/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  // Delete a function
  async deleteFunction(id: string): Promise<void> {
    await this.request<void>(`/api/Functions/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const functionsService = new FunctionsService();

