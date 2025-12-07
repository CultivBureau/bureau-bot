import { type IntegrationType } from '../services/functions';

export interface FunctionProperty {
  id: string;
  name: string;
  field_code: string;
  field_name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface FunctionData {
  id: string;
  name: string;
  instruction: string;
  properties: FunctionProperty[];
  phase: string;
  created_at: string;
  updated_at: string;
  integration_type?: IntegrationType;
  is_active?: boolean;
}

export interface CRMField {
  id: string;
  field_code: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  is_readonly: boolean;
  is_multiple: boolean;
  entity_type: string;
  enum_values?: any;
  is_custom?: boolean;
}

export type ViewMode = 'view' | 'edit' | 'create';

export interface ParsedResultFormat {
  stage?: string;
  properties?: Array<{
    field_code: string;
    field_name: string;
    description: string;
  }>;
}

export interface FormattedProperties {
  field_code: string;
  field_name: string;
  description: string;
}

