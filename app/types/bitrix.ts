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
