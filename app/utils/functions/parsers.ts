import type { FunctionProperty, CRMField, ParsedResultFormat } from '../../types/functions';

/**
 * Extract stage code from result_format string
 */
export function extractStageFromResultFormat(resultFormat: string | null | undefined): string {
  if (!resultFormat) return '';
  
  const stageMatch = resultFormat.match(/Stage:\s*([^|]+)/);
  return stageMatch ? stageMatch[1].trim() : '';
}

/**
 * Parse properties JSON from result_format string
 */
export function parsePropertiesFromResultFormat(
  resultFormat: string | null | undefined
): Array<{ field_code: string; field_name: string; description: string }> {
  if (!resultFormat) return [];
  
  const propertiesMatch = resultFormat.match(/Properties:\s*(.+)/);
  if (!propertiesMatch) return [];
  
  try {
    const propertiesJson = propertiesMatch[1].trim();
    const parsedProperties = JSON.parse(propertiesJson);
    
    if (Array.isArray(parsedProperties)) {
      return parsedProperties.map((prop: any) => ({
        field_code: prop.field_code || '',
        field_name: prop.field_name || '',
        description: prop.description || '',
      }));
    }
  } catch (err) {
    // Silent error handling
  }
  
  return [];
}

/**
 * Parse complete result_format string into stage and properties
 */
export function parseResultFormat(
  resultFormat: string | null | undefined
): ParsedResultFormat {
  if (!resultFormat) {
    return {};
  }
  
  return {
    stage: extractStageFromResultFormat(resultFormat),
    properties: parsePropertiesFromResultFormat(resultFormat),
  };
}

/**
 * Parse and enrich function properties with CRM field data
 */
export function parseFunctionProperties(
  propertiesJson: string,
  crmFields: CRMField[]
): FunctionProperty[] {
  try {
    const parsedProperties = JSON.parse(propertiesJson);
    
    if (!Array.isArray(parsedProperties)) {
      return [];
    }
    
    return parsedProperties.map((prop: any, index: number) => {
      const field_code = prop.field_code || '';
      const field_name = prop.field_name || '';
      
      // Try to find the field in CRM fields to get full details
      // CRMField uses 'id' (maps to field_code) and 'title' (maps to field_name)
      const fullField = crmFields.find(f => f.id === field_code);
      
      return {
        id: `${Date.now()}-${index}`,
        name: field_code || field_name,
        field_code: field_code,
        field_name: fullField?.title || field_name,
        type: fullField?.type || 'string',
        description: prop.description || '',
        required: true,
      };
    });
  } catch (err) {
    return [];
  }
}

