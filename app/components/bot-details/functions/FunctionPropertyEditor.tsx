'use client';

import { memo, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import type { FunctionProperty, CRMField, ViewMode } from '../../../types/functions';

interface FunctionPropertyEditorProps {
  property: FunctionProperty;
  viewMode: ViewMode;
  fieldSearchTerm: string;
  showDropdown: boolean;
  filteredFields: CRMField[];
  loadingCRMData: boolean;
  crmFieldsCount: number;
  onFieldSearchChange: (term: string) => void;
  onFieldFocus: () => void;
  onFieldBlur: () => void;
  onFieldSelect: (field: CRMField) => void;
  onDescriptionChange: (value: string) => void;
  onRemove: () => void;
}

export const FunctionPropertyEditor = memo(function FunctionPropertyEditor({
  property,
  viewMode,
  fieldSearchTerm,
  showDropdown,
  filteredFields,
  loadingCRMData,
  crmFieldsCount,
  onFieldSearchChange,
  onFieldFocus,
  onFieldBlur,
  onFieldSelect,
  onDescriptionChange,
  onRemove,
}: FunctionPropertyEditorProps) {
  const isDisabled = viewMode === 'view';
  const displayValue = showDropdown
    ? (fieldSearchTerm || property.field_name || property.name || '')
    : (fieldSearchTerm || property.field_name || property.field_code || property.name || '');

  const handleFieldSelect = useCallback((e: React.MouseEvent, field: CRMField) => {
    e.preventDefault();
    e.stopPropagation();
    onFieldSelect(field);
  }, [onFieldSelect]);

  return (
    <div className="p-4 rounded-xl border border-border bg-card/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-card-foreground">
          {property.field_name || property.name || ''}
        </h4>
        {!isDisabled && (
          <button
            onClick={onRemove}
            className="p-1 rounded-lg text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-card-foreground">
            Field:
          </label>
          <div className="relative">
            <input
              type="text"
              value={displayValue}
              onChange={(e) => {
                if (!isDisabled) {
                  onFieldSearchChange(e.target.value);
                }
              }}
              onFocus={() => {
                if (!isDisabled) {
                  onFieldFocus();
                }
              }}
              onBlur={() => {
                if (!isDisabled) {
                  setTimeout(() => {
                    onFieldBlur();
                  }, 200);
                }
              }}
              placeholder={property.field_name ? property.field_name : "Search by field name or code..."}
              disabled={isDisabled}
              className={`w-full px-3 py-2 rounded-lg border border-border ${
                isDisabled 
                  ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                  : 'bg-background text-foreground'
              }`}
            />
            
            {showDropdown && !isDisabled && (
              <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-card">
                {filteredFields.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    {loadingCRMData ? 'Loading fields...' : crmFieldsCount === 0 ? 'No CRM fields available. Sync CRM data first.' : 'No fields found'}
                  </div>
                ) : (
                  filteredFields.map((field, fieldIndex) => {
                    const entityTypeLabel = field.entity_type || 'DEAL';
                    const isSelected = property.field_code === field.field_code && property.field_code !== '';
                    const uniqueKey = field.field_code 
                      ? `${field.field_code}-${entityTypeLabel}` 
                      : `field-${fieldIndex}-${entityTypeLabel}`;
                    
                    return (
                      <div
                        key={uniqueKey}
                        onClick={(e) => handleFieldSelect(e, field)}
                        onMouseDown={(e) => e.preventDefault()}
                        className={`px-4 py-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary/20 text-primary'
                            : 'hover:bg-secondary text-foreground'
                        }`}
                      >
                        <div className="font-medium">{field.field_name}</div>
                        <div className="text-xs mt-1 text-muted-foreground">
                          Code: {field.field_code} • Type: {field.field_type}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Description:
          </label>
          <textarea
            value={property.description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Property description"
            rows={1}
            disabled={isDisabled}
            className={`w-full px-3 py-2 rounded-lg border border-border resize-none ${
              isDisabled 
                ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                : 'bg-background text-foreground'
            }`}
          />
        </div>
      </div>
    </div>
  );
});

