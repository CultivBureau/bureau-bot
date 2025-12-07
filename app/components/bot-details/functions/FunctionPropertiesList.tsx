'use client';

import { memo } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import { FunctionPropertyEditor } from './FunctionPropertyEditor';
import type { FunctionProperty, CRMField, ViewMode } from '../../../types/functions';

interface FunctionPropertiesListProps {
  properties: FunctionProperty[];
  viewMode: ViewMode;
  fieldSearchTerms: Record<string, string>;
  showFieldDropdowns: Record<string, boolean>;
  getFilteredFields: (searchTerm: string) => CRMField[];
  loadingCRMData: boolean;
  crmFieldsCount: number;
  onFieldSearchChange: (propertyId: string, term: string) => void;
  onFieldFocus: (propertyId: string) => void;
  onFieldBlur: (propertyId: string) => void;
  onFieldSelect: (propertyId: string, field: CRMField) => void;
  onDescriptionChange: (propertyId: string, value: string) => void;
  onAddProperty: () => void;
  onRemoveProperty: (propertyId: string) => void;
}

export const FunctionPropertiesList = memo(function FunctionPropertiesList({
  properties,
  viewMode,
  fieldSearchTerms,
  showFieldDropdowns,
  getFilteredFields,
  loadingCRMData,
  crmFieldsCount,
  onFieldSearchChange,
  onFieldFocus,
  onFieldBlur,
  onFieldSelect,
  onDescriptionChange,
  onAddProperty,
  onRemoveProperty,
}: FunctionPropertiesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-card-foreground">
          Function properties for crm fields:
        </label>
        {viewMode !== 'view' && (
          <>
            <button
              onClick={onAddProperty}
              className="p-2 rounded-lg bg-green-500/20 text-green-600 hover:bg-green-500/30"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">
              <HelpCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    
      {properties.map((property) => {
        const filteredFields = getFilteredFields(fieldSearchTerms[property.id] || '');
        
        return (
          <FunctionPropertyEditor
            key={property.id}
            property={property}
            viewMode={viewMode}
            fieldSearchTerm={fieldSearchTerms[property.id] || ''}
            showDropdown={showFieldDropdowns[property.id] || false}
            filteredFields={filteredFields}
            loadingCRMData={loadingCRMData}
            crmFieldsCount={crmFieldsCount}
            onFieldSearchChange={(term) => onFieldSearchChange(property.id, term)}
            onFieldFocus={() => onFieldFocus(property.id)}
            onFieldBlur={() => onFieldBlur(property.id)}
            onFieldSelect={(field) => onFieldSelect(property.id, field)}
            onDescriptionChange={(value) => onDescriptionChange(property.id, value)}
            onRemove={() => onRemoveProperty(property.id)}
          />
        );
      })}
    </div>
  );
});

