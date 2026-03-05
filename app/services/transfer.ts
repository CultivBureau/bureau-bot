import { store } from '../store/store';
import { authService } from './auth';

// Types
export interface UserTransfer {
  id?: string;
  name?: string;
  bot: string;
  bot_id?: string;
  bot_name?: string;
  bitrix_integration?: string | null;
  bitrix_integration_name?: string;
  trigger_instructions: string;
  users: number[];
  created_by?: string;
  created_on?: string;
  updated_by?: string;
  updated_on?: string;
}

export interface ChannelTransfer {
  id?: string;
  name?: string;
  bot: string;
  bot_id?: string;
  bot_name?: string;
  bitrix_integration?: string | null;
  bitrix_integration_name?: string;
  trigger_instructions: string;
  channels: number[];
  created_by?: string;
  created_on?: string;
  updated_by?: string;
  updated_on?: string;
}

export interface UserTransferListResponse {
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: UserTransfer[];
}

export interface ChannelTransferListResponse {
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: ChannelTransfer[];
}

export interface SyncUsersResponse {
  success: boolean;
  total_users: number;
  users: Array<{
    id: string;
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    position: string;
    active: boolean;
  }>;
}

export interface SyncChannelsResponse {
  success: boolean;
  total_channels: number;
  channels: Array<{
    id: string;
    name: string;
    line_id: string;
    active: boolean;
    raw_data?: any;
  }>;
}

class TransferService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
    }
    return apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;
    const token = await authService.getValidToken();

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

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        authService.logoutAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        let errorDetails: any = null;
        try {
          const errorData = await response.json();
          errorDetails = errorData;
          const error = errorData as { detail?: string; error?: string; message?: string; [key: string]: any };
          
          // Try to extract the most helpful error message
          if (error.detail) {
            errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
          } else if (error.error) {
            errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
          } else if (error.message) {
            errorMessage = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
          } else {
            // Try to find any field-specific errors
            const fieldErrors: string[] = [];
            Object.keys(error).forEach(key => {
              if (key !== 'detail' && key !== 'error' && key !== 'message') {
                const value = error[key];
                if (Array.isArray(value)) {
                  fieldErrors.push(`${key}: ${value.join(', ')}`);
                } else if (typeof value === 'string') {
                  fieldErrors.push(`${key}: ${value}`);
                }
              }
            });
            if (fieldErrors.length > 0) {
              errorMessage = fieldErrors.join('; ');
            } else {
              errorMessage = JSON.stringify(errorData);
            }
          }
          
          // Log full error details for debugging
          console.error('API Error Details:', JSON.stringify(errorData, null, 2));
          console.error('Request URL:', url);
          if (options.body) {
            console.error('Request Payload:', options.body);
          }
        } catch {
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
            console.error('API Error (text):', text);
          } catch {
            // Use default error message
          }
        }
        const finalError = new Error(errorMessage);
        (finalError as any).details = errorDetails;
        throw finalError;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      try {
        const data = await response.json();
        return data as T;
      } catch {
        return {} as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // User Transfer APIs
  async getUserTransfers(params: {
    bot_id: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<UserTransferListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('bot_id', params.bot_id);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    return this.request<UserTransferListResponse>(
      `/api/usertransfer/?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  async getUserTransfer(id: string): Promise<UserTransfer> {
    return this.request<UserTransfer>(`/api/usertransfer/${id}/`, {
      method: 'GET',
    });
  }

  async createUserTransfer(data: {
    bot: string;
    bitrix_integration?: string | null;
    trigger_instructions: string;
    users: number[];
  }): Promise<UserTransfer> {
    // Build payload - only include bitrix_integration if it has a value
    const payload: any = {
      bot: data.bot,
      trigger_instructions: data.trigger_instructions,
      users: data.users,
    };
    // Only include bitrix_integration if it's a valid non-empty string
    if (data.bitrix_integration && typeof data.bitrix_integration === 'string' && data.bitrix_integration.trim() !== '') {
      payload.bitrix_integration = data.bitrix_integration;
    }
    // If null or undefined, omit the field entirely
    
    // Log payload in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating User Transfer with payload:', JSON.stringify(payload, null, 2));
    }
    
    return this.request<UserTransfer>('/api/usertransfer/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateUserTransfer(id: string, data: {
    bot: string;
    bitrix_integration?: string | null;
    trigger_instructions: string;
    users: number[];
  }): Promise<UserTransfer> {
    // Build payload - only include bitrix_integration if it has a value
    const payload: any = {
      bot: data.bot,
      trigger_instructions: data.trigger_instructions,
      users: data.users,
    };
    // Only include bitrix_integration if it's a valid non-empty string
    if (data.bitrix_integration && typeof data.bitrix_integration === 'string' && data.bitrix_integration.trim() !== '') {
      payload.bitrix_integration = data.bitrix_integration;
    }
    // If null or undefined, omit the field entirely
    
    // Log payload in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Updating User Transfer with payload:', JSON.stringify(payload, null, 2));
    }
    
    return this.request<UserTransfer>(`/api/usertransfer/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteUserTransfer(id: string): Promise<void> {
    await this.request<void>(`/api/usertransfer/${id}/`, {
      method: 'DELETE',
    });
  }

  async syncUsers(bot_id: string): Promise<SyncUsersResponse> {
    return this.request<SyncUsersResponse>('/api/usertransfer/sync/', {
      method: 'POST',
      body: JSON.stringify({ bot_id }),
    });
  }

  // Channel Transfer APIs
  async getChannelTransfers(params: {
    bot_id: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<ChannelTransferListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('bot_id', params.bot_id);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    return this.request<ChannelTransferListResponse>(
      `/api/channeltransfer/?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  async getChannelTransfer(id: string): Promise<ChannelTransfer> {
    return this.request<ChannelTransfer>(`/api/channeltransfer/${id}/`, {
      method: 'GET',
    });
  }

  async createChannelTransfer(data: {
    bot: string;
    bitrix_integration?: string | null;
    trigger_instructions: string;
    channels: number[];
  }): Promise<ChannelTransfer> {
    // Build payload - only include bitrix_integration if it has a value
    const payload: any = {
      bot: data.bot,
      trigger_instructions: data.trigger_instructions,
      channels: data.channels,
    };
    // Only include bitrix_integration if it's a valid non-empty string
    if (data.bitrix_integration && typeof data.bitrix_integration === 'string' && data.bitrix_integration.trim() !== '') {
      payload.bitrix_integration = data.bitrix_integration;
    }
    // If null or undefined, omit the field entirely
    
    // Log payload in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating Channel Transfer with payload:', JSON.stringify(payload, null, 2));
    }
    
    return this.request<ChannelTransfer>('/api/channeltransfer/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateChannelTransfer(id: string, data: {
    bot: string;
    bitrix_integration?: string | null;
    trigger_instructions: string;
    channels: number[];
  }): Promise<ChannelTransfer> {
    // Build payload - only include bitrix_integration if it has a value
    const payload: any = {
      bot: data.bot,
      trigger_instructions: data.trigger_instructions,
      channels: data.channels,
    };
    // Only include bitrix_integration if it's a valid non-empty string
    if (data.bitrix_integration && typeof data.bitrix_integration === 'string' && data.bitrix_integration.trim() !== '') {
      payload.bitrix_integration = data.bitrix_integration;
    }
    // If null or undefined, omit the field entirely
    
    // Log payload in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Updating Channel Transfer with payload:', JSON.stringify(payload, null, 2));
    }
    
    return this.request<ChannelTransfer>(`/api/channeltransfer/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteChannelTransfer(id: string): Promise<void> {
    await this.request<void>(`/api/channeltransfer/${id}/`, {
      method: 'DELETE',
    });
  }

  async syncChannels(bot_id: string): Promise<SyncChannelsResponse> {
    return this.request<SyncChannelsResponse>('/api/channeltransfer/sync/', {
      method: 'POST',
      body: JSON.stringify({ bot_id }),
    });
  }
}

export const transferService = new TransferService();

