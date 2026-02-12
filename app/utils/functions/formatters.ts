import type { FunctionProperty, FormattedProperties } from '../../types/functions';

/**
 * Format properties for API submission
 */
export function formatPropertiesForAPI(
  properties: FunctionProperty[]
): FormattedProperties[] {
  const validProperties = properties.filter(prop => {
    const field_code = prop.field_code || prop.name || '';
    return field_code && field_code !== 'function' && field_code.trim() !== '';
  });

  return validProperties.map(prop => ({
    field_code: prop.field_code || prop.name,
    field_name: prop.field_name || prop.description || prop.name,
    description: prop.description || '',
  }));
}

/**
 * Build result_format string from properties and stage
 */
export function formatFunctionForAPI(
  properties: FunctionProperty[],
  stage?: string
): string | null {
  const propertiesData = formatPropertiesForAPI(properties);

  let resultFormat = '';

  if (stage) {
    resultFormat = `Stage: ${stage}`;
  }

  if (propertiesData.length > 0) {
    const propertiesJson = JSON.stringify(propertiesData);
    resultFormat = resultFormat
      ? `${resultFormat}|Properties: ${propertiesJson}`
      : `Properties: ${propertiesJson}`;
  }

  return resultFormat || null;
}

/**
 * Validate function data before submission
 */
export function validateFunctionData(
  name: string,
  properties: FunctionProperty[],
  pipeline?: string,
  stage?: string
): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: 'Function name is required' };
  }

  if (pipeline && !stage) {
    return { valid: false, error: 'Stage is required when a pipeline is selected' };
  }

  if (stage && !pipeline) {
    return { valid: false, error: 'Pipeline is required when a stage is selected' };
  }

  return { valid: true };
}

