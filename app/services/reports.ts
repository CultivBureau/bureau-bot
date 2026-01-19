import { store } from '../store/store';

class ReportsService {
  private getBaseURL(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const baseUrl = apiBaseUrl;
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
    return this.getDummyData<T>(endpoint);
  }

  private getDummyData<T>(endpoint: string): T {
    // Generate dummy analytics data
    if (endpoint.includes('analytics')) {
      const now = new Date();
      const series = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (29 - i));
        return {
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          responses: Math.floor(Math.random() * 100) + 20,
          completions: Math.floor(Math.random() * 80) + 15,
          spend: Math.random() * 50 + 5,
        };
      });

      return {
        total_requests: 1234,
        total_tokens: 45678,
        active_sessions: 12,
        total_spend: 234.56,
        currency: 'USD',
        timeseries: series,
        responses_series: series,
        completions_series: series,
        spend_series: series,
      } as T;
    }

    return {} as T;
  }

  async getAnalytics(params?: { bot_id?: string; range?: string }): Promise<any> {
    // TODO: Replace with real API call
    // GET /api/reports/analytics/?bot_id={bot_id}&range={range}
    return this.request<any>('/api/reports/analytics/', {
      method: 'GET',
    });
  }

  async getConversationStats(params?: any): Promise<any> {
    // TODO: Replace with real API call
    return this.request<any>('/api/reports/conversations/', {
      method: 'GET',
    });
  }
}

export const reportsService = new ReportsService();

