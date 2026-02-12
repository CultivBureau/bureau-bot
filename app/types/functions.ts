export type IntegrationType = 'BITRIX' | 'ODOO' | 'SALESFORCE' | 'HUBSPOT';

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
  pipeline?: string;
  stage?: string;
  created_at: string;
  updated_at: string;
  integration_type?: IntegrationType;
  is_active?: boolean;
}

// New API response format from /api/bitrix/crm-fields/
export interface CRMField {
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
