export interface BitrixCRMField {
  id: string;
  type: string;
  isRequired: boolean;
  isReadOnly: boolean;
  isImmutable: boolean;
  isMultiple: boolean;
  isDynamic: boolean;
  title: string;
  entity_type?: string;
}

export interface BitrixPipeline {
  id: number | string;
  name: string;
  sort: number;
  entityTypeId: number;
  isDefault: string;
  originId?: string;
  originatorId?: string;
}

export interface BitrixPipelinesResponse {
  status: string;
  entity_type: string;
  pipelines: BitrixPipeline[];
  total_retrieved: number;
  total_in_bitrix: number;
  bot_id: string;
  bot_name: string;
}

export interface BitrixStage {
  STATUS_ID: string;
  NAME: string;
  SORT: number;
  COLOR?: string;
  SYSTEM?: string;
  ENTITY_ID?: string;
}

export interface BitrixStagesResponse {
  status: string;
  bot_id: string;
  bot_name: string;
  pipeline_id: string;
  entity_type: string;
  stages: BitrixStage[];
  total_retrieved: number;
  total_in_bitrix: number;
}
