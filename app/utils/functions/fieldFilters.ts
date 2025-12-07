import type { CRMField } from '../../types/functions';

/**
 * Filter CRM fields by search term and optionally by entity type
 */
export function filterCRMFields(
  fields: CRMField[],
  searchTerm: string,
  entityType?: string
): CRMField[] {
  if (!searchTerm.trim()) {
    return entityType 
      ? fields.filter(f => f.entity_type === entityType)
      : fields;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return fields.filter(field => {
    // Filter by entity type if provided
    if (entityType && field.entity_type !== entityType) {
      return false;
    }
    
    // Search in field name and code
    const matchesName = field.field_name?.toLowerCase().includes(lowerSearchTerm);
    const matchesCode = field.field_code?.toLowerCase().includes(lowerSearchTerm);
    
    return matchesName || matchesCode;
  });
}

/**
 * Group fields by entity type
 */
export function groupFieldsByEntityType(
  fields: CRMField[]
): Record<string, CRMField[]> {
  return fields.reduce((acc, field) => {
    const entityType = field.entity_type || 'OTHER';
    if (!acc[entityType]) {
      acc[entityType] = [];
    }
    acc[entityType].push(field);
    return acc;
  }, {} as Record<string, CRMField[]>);
}

