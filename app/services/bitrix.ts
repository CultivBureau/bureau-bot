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

interface GetIntegrationSettingsParams {
  bot_id: string;
}

class BitrixService {
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
    const response = await this.request<any>(endpoint, { method: 'GET' });
    
    // Handle API response format: { status, entity_type, pipelines: [...], ... }
    if (response && response.pipelines && Array.isArray(response.pipelines)) {
      return response.pipelines;
    }
    return Array.isArray(response) ? response : [];
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
    const response = await this.request<any>(endpoint, { method: 'GET' });
    
    // Handle API response format: { status, bot_id, bot_name, pipeline_id, entity_type, stages: [...], ... }
    if (response && response.stages && Array.isArray(response.stages)) {
      return response.stages;
    }
    return Array.isArray(response) ? response : [];
  }

  // Integration Settings
  async getIntegrationSettings(params: GetIntegrationSettingsParams): Promise<any> {
    const queryParams = new URLSearchParams();
    queryParams.append('bot_id', params.bot_id);
    const endpoint = `/api/Bitrix/integration-settings/?${queryParams.toString()}`;
    const response = await this.request<any>(endpoint, { method: 'GET' });
    
    // Handle API response format: { results: [...], ... } or direct data
    if (response && response.results && Array.isArray(response.results)) {
      return response;
    }
    return response;
  }

  async createIntegrationSetting(data: any): Promise<any> {
    const response = await this.request<any>('/api/Bitrix/integration-settings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateIntegrationSetting(id: string, data: any): Promise<any> {
    const response = await this.request<any>(`/api/Bitrix/integration-settings/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  }

  async syncCrmData(botId: string, webhookUrl: string): Promise<any> {
    const response = await this.request<any>('/api/Bitrix/sync-crm-data/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bot_id: botId, webhook_url: webhookUrl }),
    });
    
    // Handle API response format: { status, data: {...}, ... }
    if (response && response.status === 'success') {
      return response;
    }
    return response;
  }

  async imConnectorRegister(data: any): Promise<any> {
    const response = await this.request<any>('/api/Bitrix/im-connector-register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  }

  async getTransferSettings(botId: string): Promise<any> {
    const response = await this.request<any>(`/api/Bitrix/transfer-settings/${botId}/`, {
      method: 'GET',
    });
    return response;
  }

  async updateTransferSettings(botId: string, data: any): Promise<any> {
    const response = await this.request<any>(`/api/Bitrix/transfer-settings/${botId}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  }

  async getBitrixUsers(params: { bot_id: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    queryParams.append('bot_id', params.bot_id);
    const response = await this.request<any>(`/api/Bitrix/bitrix-users/?${queryParams.toString()}`, {
      method: 'GET',
    });
    
    // Handle API response format: { results: [...], ... } or direct array
    if (response && response.results && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  }

  async getBitrixChannels(params: { bot_id: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    queryParams.append('bot_id', params.bot_id);
    const response = await this.request<any>(`/api/Bitrix/bitrix-channels/?${queryParams.toString()}`, {
      method: 'GET',
    });
    
    // Handle API response format: { results: [...], ... } or direct array
    if (response && response.results && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  }

  // Get integration by bot ID
  async getIntegrationByBotId(botId: string): Promise<{
    id: string;
    bot: string;
    bitrix_bot_id: number;
    client_id: string;
    portal_domain: string;
    type: string;
    is_registered: boolean;
    created_at: string;
    updated_at: string;
  } | null> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('bot_id', botId);
      const response = await this.request<{
        id: string;
        bot: string;
        bitrix_bot_id: number;
        client_id: string;
        portal_domain: string;
        type: string;
        is_registered: boolean;
        created_at: string;
        updated_at: string;
      }>(`/api/Integrations/get_integration_by_bot_id/?${queryParams.toString()}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      // Return null if no integration found
      return null;
    }
  }

  // Integration Wizard APIs
  async generateIntegrationLink(data: {
    client_id: string;
    client_secret: string;
    portal_domain: string;
    bot_id: string;
    type: string;
  }): Promise<{
    status: string;
    message: string;
    integration_id: string;
    webhook_url: string;
    portal_domain: string;
    type: string;
  }> {
    const response = await this.request<{
      status: string;
      message: string;
      integration_id: string;
      webhook_url: string;
      portal_domain: string;
      type: string;
    }>('/api/Integrations/generate-link/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Store integration_id in cookies
    if (response.integration_id) {
      document.cookie = `bitrix_integration_id=${response.integration_id}; path=/; max-age=86400`; // 24 hours
    }

    return response;
  }

  async saveTokens(data: {
    integration_id: string;
    access_token: string;
    refresh_token: string;
  }): Promise<{
    status: string;
    message: string;
    integration_id: string;
  }> {
    return await this.request<{
      status: string;
      message: string;
      integration_id: string;
    }>('/api/Integrations/save-tokens/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async registerBot(data: { bot_id: string }): Promise<{
    status: string;
    message: string;
    bitrix_bot_id: number;
    bot_code: string;
    bot_name: string;
    portal_domain: string;
  }> {
    return await this.request<{
      status: string;
      message: string;
      bitrix_bot_id: number;
      bot_code: string;
      bot_name: string;
      portal_domain: string;
    }>('/api/Bitrix/register-bot/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  // Helper to get integration_id from cookies
  getIntegrationIdFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'bitrix_integration_id') {
        return value;
      }
    }
    return null;
  }
}

export const bitrixService = new BitrixService();
