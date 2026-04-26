import { store } from '../store/store';
import { authService } from './auth';
import type {
  StopWord,
  StopWordApiItem,
  CreateStopWordsRequest,
  UpdateStopWordRequest,
  StopWordsListResponse,
  StopWordMediaType,
} from '../types/stopWords';

class StopWordsService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
    }

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

      // Handle 401 Unauthorized
      if (response.status === 401) {
        authService.logoutAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
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

  async getStopWords(botId: string, pageNumber: number = 1, pageSize: number = 100): Promise<StopWord[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', String(pageNumber));
    queryParams.append('pageSize', String(pageSize));
    queryParams.append('bot', botId);

    const endpoint = `/api/Stopwords/?${queryParams.toString()}`;
    const response = await this.request<StopWordsListResponse>(endpoint, { method: 'GET' });
    return Array.isArray(response.results)
      ? response.results.map((item) => this.mapApiItem(item))
      : [];
  }

  async createStopWords(
    botId: string,
    stopWords: Array<{ text: string; equalInclude: boolean; mediaType: StopWordMediaType }>
  ): Promise<StopWord[]> {
    const cleanedItems = this.cleanStopWords(stopWords);

    const requestData: CreateStopWordsRequest = {
      bot_id: botId,
      stopwords: cleanedItems.map((item) => ({
        text: item.text,
        equal_include: item.equalInclude,
        media_type: item.mediaType,
      })),
    };

    const response = await this.request<StopWordApiItem[]>(
      '/api/Stopwords/',
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );

    return Array.isArray(response)
      ? response.map((item) => this.mapApiItem(item))
      : [];
  }

  async getStopWordById(stopWordId: string): Promise<StopWord> {
    const response = await this.request<StopWordApiItem>(`/api/Stopwords/${stopWordId}/`, {
      method: 'GET',
    });
    return this.mapApiItem(response);
  }

  async updateStopWord(stopWordId: string, data: UpdateStopWordRequest): Promise<StopWord> {
    const response = await this.request<StopWordApiItem>(
      `/api/Stopwords/${stopWordId}/`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    return this.mapApiItem(response);
  }

  async deleteStopWord(stopWordId: string): Promise<void> {
    await this.request<void>(`/api/Stopwords/${stopWordId}/`, {
      method: 'DELETE',
    });
  }

  private cleanStopWords(
    items: Array<{ text: string; equalInclude: boolean; mediaType: StopWordMediaType }>
  ): Array<{ text: string; equalInclude: boolean; mediaType: StopWordMediaType }> {
    const cleaned = items
      .map((item) => ({
        text: item.text.trim(),
        equalInclude: item.equalInclude,
        mediaType: item.mediaType,
      }))
      .filter((item) => item.text.length > 0);

    const unique = new Map<string, { text: string; equalInclude: boolean; mediaType: StopWordMediaType }>();
    cleaned.forEach((item) => {
      const key = `${item.mediaType}::${item.text.toLowerCase()}::${item.equalInclude ? '1' : '0'}`;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });

    return Array.from(unique.values());
  }

  private mapApiItem(item: StopWordApiItem): StopWord {
    return {
      id: item.id,
      botId: item.bot_id,
      text: item.text,
      equalInclude: item.equal_include,
      mediaType: item.media_type ?? 'text',
      createdOn: item.created_on,
      updatedOn: item.updated_on,
    };
  }
}

export const stopWordsService = new StopWordsService();
