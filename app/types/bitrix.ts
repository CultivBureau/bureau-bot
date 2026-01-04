export interface BitrixFieldMapping {
  id: string;
  crm_field_code: string;
  crm_field_name: string;
  description: string;
  data_type: string;
  required: boolean;
}

export interface BitrixFunction {
  id: string;
  name: string;
  description: string;
  trigger_instructions: string;
  field_mappings: BitrixFieldMapping[];
  new_stage_code: string;
  created_on: string;
  updated_on: string;
}

export interface BitrixCRMField {
  id: string;
  field_code: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  is_readonly: boolean;
  is_multiple: boolean;
  entity_type: string;
  enum_values?: unknown;
  is_custom?: boolean;
}

export interface BitrixPipeline {
  id: string;
  pipeline_id: string;
  pipeline_name: string;
  entity_type: string;
  is_default: boolean;
}

export interface BitrixStage {
  id: string;
  stage_id: string;
  stage_name: string;
  stage_code: string;
  sort_order: number;
  is_final: boolean;
  pipeline_name: string;
}

export interface BitrixIntegrationSetting {
  id: string;
  bot_id: string;
  webhook_url: string;
  crm_entity_type: string;
  waiting_seconds: number;
  connector_code: string;
  line_id: string;
  client_id: string;
  client_secret: string;
}

export interface BitrixIntegrationSettingsResponse {
  results: BitrixIntegrationSetting[];
}

export interface BitrixTransferSettings {
  channel_transfer: boolean;
  user_transfer: boolean;
  bot_leave_chat_condition: boolean;
  channel_additional_function_description: string;
  selected_channels: string;
  channel_bot_response: string;
  user_additional_function_description: string;
  selected_users: string;
  user_bot_response: string;
  leave_additional_function_description: string;
  leave_bot_response: string;
}

export interface BitrixUser {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface BitrixChannel {
  id: string;
  name: string;
  code: string;
}

export interface BitrixCRMFieldsResponse {
  crm_fields: BitrixCRMField[];
}

export interface BitrixPipelinesResponse {
  pipelines: BitrixPipeline[];
}

export interface BitrixStagesResponse {
  stages: BitrixStage[];
}

export interface BitrixUsersResponse {
  users: BitrixUser[];
}

export interface BitrixChannelsResponse {
  channels: BitrixChannel[];
}

export interface BitrixSyncCrmDataRequest {
  bot_id: string;
  webhook_url: string;
}

export interface BitrixSyncCrmDataResponse {
  message: string;
  success: boolean;
}

export interface BitrixIMConnectorRegisterData {
  bot_id: string;
  connector_code: string;
  line_id: string;
}

export interface BitrixIMConnectorRegisterResponse {
  success: boolean;
  message: string;
}

export interface GetFunctionsParams {
  bot_id?: string;
}

export interface GetCRMFieldsParams {
  bot_id?: string;
  entity_type?: string;
}

export interface GetPipelinesParams {
  bot_id?: string;
  entity_type?: string;
}

export interface GetStagesParams {
  bot_id?: string;
  pipeline_id?: string;
  entity_type?: string;
}

export interface GetIntegrationSettingsParams {
  bot_id?: string;
}

export interface GetBitrixUsersParams {
  bot_id?: string;
}

export interface GetBitrixChannelsParams {
  bot_id?: string;
}
