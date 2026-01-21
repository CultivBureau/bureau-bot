export interface GPTModel {
  value: string;
  label: string;
}

export interface GPTModelsResponse {
  gpt_models: GPTModel[];
}

export interface ValidateOpenAIKeyRequest {
  openaikey: string;
}

export interface ValidateOpenAIKeyResponse {
  message: string;
  valid: boolean;
}

export interface CreateBotRequest {
  name: string;
  gpt_model: string;
  openai_api_key: string;
  instructions: string;
  wait_time?: number;
  assistant_name?: string;
  webhook_url?: string | null;
  start_time?: string | null;
  end_time?: string | null;
}

export interface UpdateBotRequest {
  name?: string;
  gpt_model?: string;
  openai_api_key?: string;
  instructions?: string;
  wait_time?: number;
  assistant_name?: string;
  webhook_url?: string | null;
  start_time?: string | null;
  end_time?: string | null;
}

export interface RestoreBotRequest {
  id: string;
}

export interface Bot {
  id: string;
  user_id: string;
  name: string;
  assistant_name?: string;
  gpt_model: string;
  openai_api_key: string;
  assistant_id?: string;
  instructions: string;
  wait_time: number;
  webhook_url?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_active: boolean;
  working: boolean;
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
}

// Pagination response for bots list
export interface BotsListResponse {
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: Bot[];
}

// Query parameters for getting bots
export interface GetBotsParams {
  pageNumber?: number;
  pageSize?: number;
  status?: 'active' | 'inactive' | 'all';
}

// Simplified bot data for UI components
export interface BotData {
  id: string;
  name: string;
  gpt_model: string;
  is_active: boolean;
  created_on: string;
  updated_on: string;
  usage_count?: number;
  total_sessions?: number;
  assistant_name?: string;
  working?: boolean;
}

