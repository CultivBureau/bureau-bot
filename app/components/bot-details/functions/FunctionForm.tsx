'use client';

import { memo } from 'react';
import { X, Edit, Save, RefreshCw } from 'lucide-react';
import { FunctionPropertiesList } from './FunctionPropertiesList';
import { PipelineStageSelector } from './PipelineStageSelector';
import type { ViewMode, FunctionProperty, CRMField } from '../../../types/functions';

interface FunctionFormProps {
  viewMode: ViewMode;
  editing: boolean;
  saving: boolean;
  functionName: string;
  functionInstruction: string;
  resultFormat: string;
  selectedPhase: string;
  selectedPipeline: string;
  properties: FunctionProperty[];
  pipelines: Array<{ pipeline_id: string; pipeline_name: string }>;
  stages: Array<{ stage_code: string; stage_name: string; stage_id?: string }>;
  fieldSearchTerms: Record<string, string>;
  showFieldDropdowns: Record<string, boolean>;
  getFilteredFields: (searchTerm: string) => CRMField[];
  loadingCRMData: boolean;
  crmFieldsCount: number;
  viewingFunction: any;
  onNameChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
  onResultFormatChange: (value: string) => void;
  onPhaseChange: (value: string) => void;
  onPipelineChange: (value: string) => void;
  onFieldSearchChange: (propertyId: string, term: string) => void;
  onFieldFocus: (propertyId: string) => void;
  onFieldBlur: (propertyId: string) => void;
  onFieldSelect: (propertyId: string, field: CRMField) => void;
  onDescriptionChange: (propertyId: string, value: string) => void;
  onAddProperty: () => void;
  onRemoveProperty: (propertyId: string) => void;
  onEditClick: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const FunctionForm = memo(function FunctionForm({
  viewMode,
  editing,
  saving,
  functionName,
  functionInstruction,
  resultFormat,
  selectedPhase,
  selectedPipeline,
  properties,
  pipelines,
  stages,
  fieldSearchTerms,
  showFieldDropdowns,
  getFilteredFields,
  loadingCRMData,
  crmFieldsCount,
  viewingFunction,
  onNameChange,
  onInstructionChange,
  onResultFormatChange,
  onPhaseChange,
  onPipelineChange,
  onFieldSearchChange,
  onFieldFocus,
  onFieldBlur,
  onFieldSelect,
  onDescriptionChange,
  onAddProperty,
  onRemoveProperty,
  onEditClick,
  onCancel,
  onSave,
}: FunctionFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-card-foreground">
          {viewMode === 'view' ? 'View Function' : editing ? 'Edit Function' : 'Create New Function'}
        </h2>
        <div className="flex items-center gap-2">
          {viewMode === 'view' && viewingFunction && (
            <button
              onClick={onEditClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-card-foreground">
            Integration Type
          </label>
          <input
            type="text"
            value="Bitrix24"
            disabled
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Only Bitrix24 integration is currently supported
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-card-foreground">
            Function Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name Function"
            disabled={viewMode === 'view'}
            className={`w-full px-4 py-3 rounded-xl border border-border ${
              viewMode === 'view' 
                ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                : 'bg-background text-foreground'
            }`}
            required
          />
        </div>
      </div>
    
      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Function instruction
        </label>
        <textarea
          value={functionInstruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          placeholder="Function instruction here..."
          rows={6}
          disabled={viewMode === 'view'}
          className={`w-full px-4 py-3 rounded-xl border border-border resize-y ${
            viewMode === 'view' 
              ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
              : 'bg-background text-foreground'
          }`}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Result Format <span className="text-xs text-muted-foreground">(Optional)</span>
        </label>
        <input
          type="text"
          value={resultFormat}
          onChange={(e) => onResultFormatChange(e.target.value)}
          placeholder="Enter result format (optional)"
          disabled={viewMode === 'view'}
          className={`w-full px-4 py-3 rounded-xl border border-border ${
            viewMode === 'view' 
              ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
              : 'bg-background text-foreground'
          }`}
        />
      </div>
    
      <FunctionPropertiesList
        properties={properties}
        viewMode={viewMode}
        fieldSearchTerms={fieldSearchTerms}
        showFieldDropdowns={showFieldDropdowns}
        getFilteredFields={getFilteredFields}
        loadingCRMData={loadingCRMData}
        crmFieldsCount={crmFieldsCount}
        onFieldSearchChange={onFieldSearchChange}
        onFieldFocus={onFieldFocus}
        onFieldBlur={onFieldBlur}
        onFieldSelect={onFieldSelect}
        onDescriptionChange={onDescriptionChange}
        onAddProperty={onAddProperty}
        onRemoveProperty={onRemoveProperty}
      />
      
      <PipelineStageSelector
        pipelines={pipelines}
        stages={stages}
        selectedPipeline={selectedPipeline}
        selectedStage={selectedPhase}
        onPipelineChange={onPipelineChange}
        onStageChange={onPhaseChange}
        viewMode={viewMode}
        loading={loadingCRMData}
      />
      
      {viewMode !== 'view' && (
        <div className="flex justify-end pt-6 gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-medium border border-border text-foreground hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-8 py-3 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {editing ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {editing ? 'Update Function' : 'Save Function'}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
});
