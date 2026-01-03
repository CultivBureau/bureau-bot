import { store } from '../store/store';
import { authService } from './auth';

// Source type options for knowledge base items
export type KnowledgeBaseSourceType = 'file' | 'text' | 'url';

// Types for Knowledge Base
export interface KnowledgeBaseItem {
  openai_file_id: string;
  bot_id: string;
  source_type: KnowledgeBaseSourceType;
  title: string;
  content: string | null;
  content_path: string | null;
  vector_store_id: string;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface CreateKnowledgeBaseTextRequest {
  bot_id: string;
  title: string;
  source_type: KnowledgeBaseSourceType;
  content: string;
}

export interface UpdateKnowledgeBaseRequest {
  title?: string;
  content?: string;
}

export interface DeleteKnowledgeBaseResponse {
  message: string;
}

class KnowledgeBaseService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const baseUrl = apiBaseUrl || 'https://test.staging.cultiv.llc';
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private getAuthToken(): string | null {
    const state = store.getState();
    return state.auth.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isFormData: boolean = false
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;
    const token = this.getAuthToken();

    // Check if token exists
    if (!token) {
      authService.logoutAndRedirect();
      throw new Error('Authentication token not found. Please log in again.');
    }

    // Check if token is expired before making the request
    if (authService.isTokenExpired()) {
      authService.logoutAndRedirect();
      throw new Error('Your session has expired. Please log in again.');
    }

    const headers: Record<string, string> = {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Don't set Content-Type for FormData - browser will set it with boundary automatically
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> || {}),
      },
    };

    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('KnowledgeBase API Request:', {
        url,
        method: config.method || 'GET',
        isFormData,
        headers: config.headers
      });
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        authService.logoutAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
      }

      // Handle 204 No Content (common for DELETE)
      if (response.status === 204) {
        return {} as T;
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
        // Some successful responses might not have a body
        return {} as T;
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

  /**
   * Get all knowledge base items with optional bot_id filter
   * GET /api/KnowledgeBase/knowledge-base/
   */
  async getKnowledgeBaseItems(params?: { bot_id?: string; page?: number }): Promise<KnowledgeBaseItem[]> {
    const queryParams = new URLSearchParams();

    if (params?.bot_id) {
      queryParams.append('bot_id', params.bot_id);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/api/KnowledgeBase/knowledge-base/?${queryString}`
      : '/api/KnowledgeBase/knowledge-base/';

    return this.request<KnowledgeBaseItem[]>(endpoint, { method: 'GET' });
  }

  /**
   * Get a single knowledge base item by openai_file_id
   * GET /api/KnowledgeBase/knowledge-base/{openai_file_id}/
   */
  async getKnowledgeBaseItem(openaiFileId: string): Promise<KnowledgeBaseItem> {
    return this.request<KnowledgeBaseItem>(
      `/api/KnowledgeBase/knowledge-base/${openaiFileId}/`,
      { method: 'GET' }
    );
  }

  /**
   * Create a new knowledge base item with file upload
   * POST /api/KnowledgeBase/knowledge-base/ (multipart/form-data)
   * Required fields: bot_id, title, source_type, file
   */
  async uploadFile(formData: FormData): Promise<KnowledgeBaseItem> {
    // Log FormData contents in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📁 KnowledgeBase Service - Uploading file with FormData:');
      const entries: string[] = [];
      formData.forEach((value, key) => {
        if (value instanceof File) {
          entries.push(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          entries.push(`  ${key}: ${value}`);
        }
      });
      console.log(entries.join('\n'));
    }

    return this.request<KnowledgeBaseItem>(
      '/api/KnowledgeBase/knowledge-base/',
      {
        method: 'POST',
        body: formData,
      },
      true // isFormData flag
    );
  }

  /**
   * Create a new knowledge base item with text content
   * POST /api/KnowledgeBase/knowledge-base/ (application/json)
   */
  async uploadText(textData: { bot_id: string; title: string; content: string }): Promise<KnowledgeBaseItem> {
    const requestData: CreateKnowledgeBaseTextRequest = {
      bot_id: textData.bot_id,
      title: textData.title,
      source_type: 'text',
      content: textData.content,
    };

    return this.request<KnowledgeBaseItem>('/api/KnowledgeBase/knowledge-base/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  /**
   * Create a new knowledge base item from a URL
   * POST /api/KnowledgeBase/knowledge-base/ (application/json)
   */
  async uploadUrl(urlData: { bot_id: string; title: string; url: string }): Promise<KnowledgeBaseItem> {
    const requestData = {
      bot_id: urlData.bot_id,
      title: urlData.title,
      source_type: 'url' as KnowledgeBaseSourceType,
      content: urlData.url,
    };

    return this.request<KnowledgeBaseItem>('/api/KnowledgeBase/knowledge-base/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  /**
   * Update a knowledge base item
   * PUT /api/KnowledgeBase/knowledge-base/{openai_file_id}/
   * Can update title, content, or upload a new file
   */
  async updateKnowledgeBaseItem(
    openaiFileId: string,
    data: UpdateKnowledgeBaseRequest | FormData
  ): Promise<KnowledgeBaseItem> {
    const isFormData = data instanceof FormData;

    return this.request<KnowledgeBaseItem>(
      `/api/KnowledgeBase/knowledge-base/${openaiFileId}/`,
      {
        method: 'PUT',
        body: isFormData ? data : JSON.stringify(data),
      },
      isFormData
    );
  }

  /**
   * Delete a knowledge base item
   * DELETE /api/KnowledgeBase/knowledge-base/{openai_file_id}/
   */
  async deleteKnowledgeBaseItem(openaiFileId: string): Promise<DeleteKnowledgeBaseResponse> {
    return this.request<DeleteKnowledgeBaseResponse>(
      `/api/KnowledgeBase/knowledge-base/${openaiFileId}/`,
      { method: 'DELETE' }
    );
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();

