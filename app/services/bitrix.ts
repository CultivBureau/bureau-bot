import { store } from '../store/store';
import { authService } from './auth';
import type {
  BitrixCRMField,
  BitrixPipeline,
  BitrixStage,
} from '../types/bitrix';

interface GetCRMFieldsParams {
  bot_id?: string;
  entity_type?: string;
}

interface GetPipelinesParams {
  bot_id?: string;
  entity_type?: string;
}

interface GetStagesParams {
  bot_id?: string;
  pipeline_id?: string;
  entity_type?: string;
}

class BitrixService {
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

  // CRM Fields
  async getCrmFields(params?: GetCRMFieldsParams): Promise<BitrixCRMField[]> {
    const queryParams = new URLSearchParams();
    if (params?.bot_id) {
      queryParams.append('bot_id', params.bot_id);
    }
    if (params?.entity_type) {
      queryParams.append('entity_type', params.entity_type);
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/Bitrix/crm-fields/?${queryString}` : '/api/Bitrix/crm-fields/';
    const response = await this.request<BitrixCRMField[] | { crm_fields: BitrixCRMField[] } | { results: BitrixCRMField[] }>(endpoint, { method: 'GET' });
    // Handle multiple response formats: array, { crm_fields: [...] }, or { results: [...] }
    if (Array.isArray(response)) {
      return response;
    }
    if ('crm_fields' in response) {
      return response.crm_fields;
    }
    if ('results' in response) {
      return response.results;
    }
    return [];
  }

  // Pipelines
  async getPipelines(params?: GetPipelinesParams): Promise<BitrixPipeline[]> {
    const queryParams = new URLSearchParams();
    if (params?.bot_id) {
      queryParams.append('bot_id', params.bot_id);
    }
    if (params?.entity_type) {
      queryParams.append('entity_type', params.entity_type);
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/Bitrix/pipelines/?${queryString}` : '/api/Bitrix/pipelines/';
    const response = await this.request<BitrixPipeline[] | { pipelines: BitrixPipeline[] }>(endpoint, { method: 'GET' });
    return Array.isArray(response) ? response : response.pipelines;
  }

  // Stages
  async getStages(params?: GetStagesParams): Promise<BitrixStage[]> {
    const queryParams = new URLSearchParams();
    if (params?.bot_id) {
      queryParams.append('bot_id', params.bot_id);
    }
    if (params?.pipeline_id) {
      queryParams.append('pipeline_id', params.pipeline_id);
    }
    if (params?.entity_type) {
      queryParams.append('entity_type', params.entity_type);
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/Bitrix/stages/?${queryString}` : '/api/Bitrix/stages/';
    const response = await this.request<BitrixStage[] | { stages: BitrixStage[] }>(endpoint, { method: 'GET' });
    return Array.isArray(response) ? response : response.stages;
  }
}

export const bitrixService = new BitrixService();
