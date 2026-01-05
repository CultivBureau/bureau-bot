'use client';

import { memo, useCallback, useState } from 'react';
import { Trash2, Filter } from 'lucide-react';
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
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('ALL');
  const displayValue = showDropdown
    ? (fieldSearchTerm || property.field_name || property.name || '')
    : (fieldSearchTerm || property.field_name || property.field_code || property.name || '');

  const handleFieldSelect = useCallback((e: React.MouseEvent, field: CRMField) => {
    e.preventDefault();
    e.stopPropagation();
    onFieldSelect(field);
  }, [onFieldSelect]);

  // Filter fields by entity type
  const displayedFields = entityTypeFilter === 'ALL' 
    ? filteredFields 
    : filteredFields.filter(f => {
        const fieldEntityType = f.entity_type || 'DEAL'; // Default to DEAL if not specified
        return fieldEntityType === entityTypeFilter;
      });

  return (
    <div className="p-4 rounded-xl border border-border bg-card/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-card-foreground">
          {property.field_name || property.name || ''}
        </h4>
        <div className="flex items-center gap-2">
          {!isDisabled && (
            <>
              <select
                value={entityTypeFilter}
                onChange={(e) => setEntityTypeFilter(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border border-border bg-background text-foreground hover:bg-secondary cursor-pointer"
              >
                <option value="ALL">ALL</option>
                <option value="DEAL">DEAL</option>
                <option value="LEAD">LEAD</option>
                <option value="CONTACT">CONTACT</option>
              </select>
              <button
                onClick={onRemove}
                className="p-1 rounded-lg text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
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
              placeholder={property.field_name ? property.field_name : "Search by title or id..."}
              disabled={isDisabled}
              className={`w-full px-3 py-2 rounded-lg border border-border ${
                isDisabled 
                  ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                  : 'bg-background text-foreground'
              }`}
            />
            
            {showDropdown && !isDisabled && (
              <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-card">
                {displayedFields.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    {loadingCRMData ? 'Loading fields...' : crmFieldsCount === 0 ? 'No CRM fields available. Sync CRM data first.' : 'No fields found'}
                  </div>
                ) : (
                  displayedFields.map((field, fieldIndex) => {
                    const entityTypeLabel = field.entity_type || 'DEAL';
                    const fieldId = field.id || '';
                    const fieldTitle = field.title || '';
                    const isSelected = property.field_code === fieldId && property.field_code !== '';
                    // Include fieldIndex to ensure unique keys even for duplicate field IDs
                    const uniqueKey = `${fieldId}-${entityTypeLabel}-${fieldIndex}`;
                    
                    return (
                      <div
                        key={uniqueKey}
                        onClick={(e) => handleFieldSelect(e, field)}
                        onMouseDown={(e) => e.preventDefault()}
                        className={`px-4 py-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary/20 text-primary'
                            : 'hover:bg-secondary text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{fieldTitle}</span>
                          <span className="text-xs text-muted-foreground/50">({fieldId})</span>
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

