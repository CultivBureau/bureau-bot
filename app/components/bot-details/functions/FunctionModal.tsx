'use client';

import { X } from 'lucide-react';
import { FunctionForm } from './FunctionForm';
import type { ViewMode, FunctionProperty, CRMField } from '../../../types/functions';

interface FunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  editing: boolean;
  saving: boolean;
  functionName: string;
  functionInstruction: string;
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
  onSave: () => void;
}

export function FunctionModal({
  isOpen,
  onClose,
  viewMode,
  editing,
  saving,
  functionName,
  functionInstruction,
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
  onSave,
}: FunctionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-card-foreground">
            {viewMode === 'view' ? 'View Function' : editing ? 'Edit Function' : 'Create Function'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FunctionForm
            viewMode={viewMode}
            editing={editing}
            saving={saving}
            functionName={functionName}
            functionInstruction={functionInstruction}
            selectedPhase={selectedPhase}
            selectedPipeline={selectedPipeline}
            properties={properties}
            pipelines={pipelines}
            stages={stages}
            fieldSearchTerms={fieldSearchTerms}
            showFieldDropdowns={showFieldDropdowns}
            getFilteredFields={getFilteredFields}
            loadingCRMData={loadingCRMData}
            crmFieldsCount={crmFieldsCount}
            viewingFunction={viewingFunction}
            onNameChange={onNameChange}
            onInstructionChange={onInstructionChange}
            onPhaseChange={onPhaseChange}
            onPipelineChange={onPipelineChange}
            onFieldSearchChange={onFieldSearchChange}
            onFieldFocus={onFieldFocus}
            onFieldBlur={onFieldBlur}
            onFieldSelect={onFieldSelect}
            onDescriptionChange={onDescriptionChange}
            onAddProperty={onAddProperty}
            onRemoveProperty={onRemoveProperty}
            onEditClick={onEditClick}
            onCancel={onClose}
            onSave={onSave}
          />
        </div>
      </div>
    </div>
  );
}

