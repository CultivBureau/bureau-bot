import { store } from '../store/store';

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
    // TODO: Replace with real API call
    // For now, return dummy data based on endpoint
    return this.getDummyData<T>(endpoint, options);
  }

  private getDummyData<T>(endpoint: string, options?: RequestInit): T {
    // Functions
    if (endpoint.includes('/bitrix/functions/')) {
      if (options?.method === 'GET') {
        return [
          {
            id: '1',
            name: 'create_deal',
            description: 'Create a new deal in Bitrix24',
            trigger_instructions: 'When user wants to create a deal',
            field_mappings: [
              {
                id: '1',
                crm_field_code: 'TITLE',
                crm_field_name: 'Deal Title',
                description: 'The title of the deal',
                data_type: 'STRING',
                required: true,
              },
            ],
            new_stage_code: 'NEW',
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
          },
        ] as T;
      }
    }

    // CRM Fields
    if (endpoint.includes('/bitrix/crm-fields/')) {
      return [
        { id: '1', field_code: 'TITLE', field_name: 'Deal Title', field_type: 'STRING', is_required: true, is_readonly: false, is_multiple: false, entity_type: 'DEAL' },
        { id: '2', field_code: 'STAGE_ID', field_name: 'Stage', field_type: 'ENUM', is_required: false, is_readonly: false, is_multiple: false, entity_type: 'DEAL' },
        { id: '3', field_code: 'OPPORTUNITY', field_name: 'Amount', field_type: 'DOUBLE', is_required: false, is_readonly: false, is_multiple: false, entity_type: 'DEAL' },
        { id: '4', field_code: 'UTM_SOURCE', field_name: 'Ad system', field_type: 'STRING', is_required: false, is_readonly: false, is_multiple: false, entity_type: 'DEAL' },
        { id: '5', field_code: 'NAME', field_name: 'Lead Name', field_type: 'STRING', is_required: true, is_readonly: false, is_multiple: false, entity_type: 'LEAD' },
        { id: '6', field_code: 'LAST_NAME', field_name: 'Last Name', field_type: 'STRING', is_required: false, is_readonly: false, is_multiple: false, entity_type: 'CONTACT' },
      ] as T;
    }

    // Pipelines
    if (endpoint.includes('/bitrix/pipelines/')) {
      return [
        { id: '1', pipeline_id: '1', pipeline_name: 'Sales Pipeline', entity_type: 'DEAL', is_default: true },
        { id: '2', pipeline_id: '2', pipeline_name: 'Support Pipeline', entity_type: 'DEAL', is_default: false },
      ] as T;
    }

    // Stages
    if (endpoint.includes('/bitrix/stages/')) {
      return [
        { id: '1', stage_id: 'NEW', stage_name: 'New', stage_code: 'NEW', sort_order: 0, is_final: false, pipeline_name: 'Sales Pipeline' },
        { id: '2', stage_id: 'PREPARATION', stage_name: 'Preparation', stage_code: 'PREPARATION', sort_order: 1, is_final: false, pipeline_name: 'Sales Pipeline' },
        { id: '3', stage_id: 'PREPAYMENT_INVOICE', stage_name: 'Prepayment Invoice', stage_code: 'PREPAYMENT_INVOICE', sort_order: 2, is_final: false, pipeline_name: 'Sales Pipeline' },
        { id: '4', stage_id: 'EXECUTING', stage_name: 'Executing', stage_code: 'EXECUTING', sort_order: 3, is_final: false, pipeline_name: 'Sales Pipeline' },
        { id: '5', stage_id: 'FINAL_INVOICE', stage_name: 'Final Invoice', stage_code: 'FINAL_INVOICE', sort_order: 4, is_final: false, pipeline_name: 'Sales Pipeline' },
        { id: '6', stage_id: 'WON', stage_name: 'Won', stage_code: 'WON', sort_order: 5, is_final: true, pipeline_name: 'Sales Pipeline' },
        { id: '7', stage_id: 'LOSE', stage_name: 'Lost', stage_code: 'LOSE', sort_order: 6, is_final: true, pipeline_name: 'Sales Pipeline' },
      ] as T;
    }

    // Integration Settings
    if (endpoint.includes('/bitrix/integration-settings/')) {
      if (options?.method === 'GET') {
        return {
          results: [
            {
              id: '1',
              bot_id: 'current-bot-id',
              webhook_url: 'https://example.bitrix24.com/rest/1/webhook_code/',
              crm_entity_type: 'DEAL',
              waiting_seconds: 0,
              connector_code: '',
              line_id: '',
              client_id: '',
              client_secret: '',
            },
          ],
        } as T;
      }
    }

    // Transfer Settings
    if (endpoint.includes('/transfer-settings/')) {
      if (options?.method === 'GET') {
        return {
          channel_transfer: false,
          user_transfer: false,
          bot_leave_chat_condition: false,
          channel_additional_function_description: '',
          selected_channels: '',
          channel_bot_response: '',
          user_additional_function_description: '',
          selected_users: '',
          user_bot_response: '',
          leave_additional_function_description: '',
          leave_bot_response: '',
        } as T;
      }
    }

    // Bitrix Users
    if (endpoint.includes('/bitrix/users/')) {
      return [
        { id: '1', name: 'John Doe', email: 'john@example.com', first_name: 'John', last_name: 'Doe' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', first_name: 'Bob', last_name: 'Johnson' },
      ] as T;
    }

    // Bitrix Channels
    if (endpoint.includes('/bitrix/channels/')) {
      return [
        { id: '1', name: 'General Channel', code: 'general' },
        { id: '2', name: 'Support Channel', code: 'support' },
        { id: '3', name: 'Sales Channel', code: 'sales' },
      ] as T;
    }

    return {} as T;
  }

  // Functions
  async getFunctions(params?: { bot_id?: string }): Promise<any> {
    // TODO: GET /api/bitrix/functions/?bot_id={bot_id}
    return this.request<any>('/api/bitrix/functions/', { method: 'GET' });
  }

  async getFunction(id: string): Promise<any> {
    // TODO: GET /api/bitrix/functions/{id}/
    return this.request<any>(`/api/bitrix/functions/${id}/`, { method: 'GET' });
  }

  async createFunction(functionData: any): Promise<any> {
    // TODO: POST /api/bitrix/functions/
    return this.request<any>('/api/bitrix/functions/', {
      method: 'POST',
      body: JSON.stringify(functionData),
    });
  }

  async updateFunction(id: string, functionData: any): Promise<any> {
    // TODO: PUT /api/bitrix/functions/{id}/
    return this.request<any>(`/api/bitrix/functions/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(functionData),
    });
  }

  async deleteFunction(id: string): Promise<void> {
    // TODO: DELETE /api/bitrix/functions/{id}/
    return this.request<void>(`/api/bitrix/functions/${id}/`, {
      method: 'DELETE',
    });
  }

  async createFunctionWithOpenAI(functionData: any): Promise<any> {
    // TODO: POST /api/bitrix/create-function/
    return this.request<any>('/api/bitrix/create-function/', {
      method: 'POST',
      body: JSON.stringify(functionData),
    });
  }

  // CRM Fields
  async getCrmFields(params?: { bot_id?: string; entity_type?: string }): Promise<any> {
    // TODO: GET /api/bitrix/crm-fields/?bot_id={bot_id}&entity_type={entity_type}
    return this.request<any>('/api/bitrix/crm-fields/', { method: 'GET' });
  }

  // Pipelines
  async getPipelines(params?: { bot_id?: string; entity_type?: string }): Promise<any> {
    // TODO: GET /api/bitrix/pipelines/?bot_id={bot_id}&entity_type={entity_type}
    return this.request<any>('/api/bitrix/pipelines/', { method: 'GET' });
  }

  // Stages
  async getStages(params?: { bot_id?: string; pipeline_id?: string }): Promise<any> {
    // TODO: GET /api/bitrix/stages/?bot_id={bot_id}&pipeline_id={pipeline_id}
    return this.request<any>('/api/bitrix/stages/', { method: 'GET' });
  }

  // Integration Settings
  async getIntegrationSettings(params?: { bot_id?: string }): Promise<any> {
    // TODO: GET /api/bitrix/integration-settings/?bot_id={bot_id}
    return this.request<any>('/api/bitrix/integration-settings/', { method: 'GET' });
  }

  async createIntegrationSetting(settingData: any): Promise<any> {
    // TODO: POST /api/bitrix/integration-settings/
    return this.request<any>('/api/bitrix/integration-settings/', {
      method: 'POST',
      body: JSON.stringify(settingData),
    });
  }

  async updateIntegrationSetting(id: string, settingData: any): Promise<any> {
    // TODO: PUT /api/bitrix/integration-settings/{id}/
    return this.request<any>(`/api/bitrix/integration-settings/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(settingData),
    });
  }

  // Data Sync
  async syncCrmData(botId: string, webhookUrl: string): Promise<any> {
    // TODO: POST /api/bitrix/sync-crm-data/
    return this.request<any>('/api/bitrix/sync-crm-data/', {
      method: 'POST',
      body: JSON.stringify({ bot_id: botId, webhook_url: webhookUrl }),
    });
  }

  // IM Connector
  async imConnectorRegister(registerData: any): Promise<any> {
    // TODO: POST /api/bitrix/imconnector/register/
    return this.request<any>('/api/bitrix/imconnector/register/', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  // Users and Channels
  async getBitrixUsers(params?: { bot_id?: string }): Promise<any> {
    // TODO: GET /api/bitrix/users/?bot_id={bot_id}
    return this.request<any>('/api/bitrix/users/', { method: 'GET' });
  }

  async getBitrixChannels(params?: { bot_id?: string }): Promise<any> {
    // TODO: GET /api/bitrix/channels/?bot_id={bot_id}
    return this.request<any>('/api/bitrix/channels/', { method: 'GET' });
  }

  // Transfer Settings
  async getTransferSettings(botId: string): Promise<any> {
    // TODO: GET /api/bitrix/bots/{botId}/transfer-settings/
    return this.request<any>(`/api/bitrix/bots/${botId}/transfer-settings/`, { method: 'GET' });
  }

  async updateTransferSettings(botId: string, settingsData: any): Promise<any> {
    // TODO: PUT /api/bitrix/bots/{botId}/transfer-settings/
    return this.request<any>(`/api/bitrix/bots/${botId}/transfer-settings/`, {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }
}

export const bitrixService = new BitrixService();

