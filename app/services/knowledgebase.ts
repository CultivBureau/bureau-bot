import { store } from '../store/store';

class KnowledgeBaseService {
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
    // TODO: Replace with real API call
    // For now, return dummy data
    return this.getDummyData<T>(endpoint, options);
  }

  private getDummyData<T>(endpoint: string, options?: RequestInit): T {
    // Knowledge Base Items
    if (endpoint.includes('/knowledge-base/knowledge-base/')) {
      if (options?.method === 'GET') {
        return [
          {
            source_id: 1,
            bot_id: 'current-bot-id',
            source_type: 'file',
            title: 'Product Manual.pdf',
            content: undefined,
            openai_file_id: 'file-abc123',
            file_size: 1024000,
            file_type: 'pdf',
            vector_store_id: 'vs_xyz789',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            source_id: 2,
            bot_id: 'current-bot-id',
            source_type: 'text',
            title: 'Company Policies',
            content: 'Our company policies include...\n\n1. Code of Conduct\n2. Privacy Policy\n3. Terms of Service',
            openai_file_id: undefined,
            file_size: undefined,
            file_type: undefined,
            vector_store_id: 'vs_xyz789',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            source_id: 3,
            bot_id: 'current-bot-id',
            source_type: 'file',
            title: 'FAQ Document.docx',
            content: undefined,
            openai_file_id: 'file-def456',
            file_size: 512000,
            file_type: 'docx',
            vector_store_id: 'vs_xyz789',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ] as T;
      }
      if (options?.method === 'POST') {
        // Return created item
        return {
          source_id: Date.now(),
          bot_id: 'current-bot-id',
          source_type: 'file',
          title: 'New Document',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as T;
      }
    }

    // Delete - return success
    if (options?.method === 'DELETE') {
      return {} as T;
    }

    return {} as T;
  }

  async getKnowledgeBaseItems(params?: { bot_id?: string }): Promise<any> {
    // TODO: GET /api/knowledge-base/knowledge-base/?bot_id={bot_id}
    return this.request<any>('/api/knowledge-base/knowledge-base/', { method: 'GET' });
  }

  async getKnowledgeBaseItem(id: string): Promise<any> {
    // TODO: GET /api/knowledge-base/knowledge-base/{id}/
    return this.request<any>(`/api/knowledge-base/knowledge-base/${id}/`, { method: 'GET' });
  }

  async uploadFile(formData: FormData): Promise<any> {
    // TODO: POST /api/knowledge-base/upload-file/
    return this.request<any>('/api/knowledge-base/upload-file/', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadText(textData: { bot_id: string; title: string; content: string }): Promise<any> {
    // TODO: POST /api/knowledge-base/upload-text/
    return this.request<any>('/api/knowledge-base/upload-text/', {
      method: 'POST',
      body: JSON.stringify(textData),
    });
  }

  async deleteKnowledgeBaseItem(sourceId: string): Promise<void> {
    // TODO: DELETE /api/knowledge-base/knowledge-base/{sourceId}/
    return this.request<void>(`/api/knowledge-base/knowledge-base/${sourceId}/`, {
      method: 'DELETE',
    });
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();

