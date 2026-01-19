'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useFunctions } from './hooks/useFunctions';
import { useCRMData } from './hooks/useCRMData';
import { useFunctionForm } from './hooks/useFunctionForm';
import { useFunctionProperties } from './hooks/useFunctionProperties';
import { FunctionList } from './FunctionList';
import { FunctionForm } from './FunctionForm';
import { AlertMessages } from './AlertMessages';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import type { FunctionData } from '../../../types/functions';

export function FunctionsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  // Main state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [functionToDelete, setFunctionToDelete] = useState<FunctionData | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Custom hooks
  const { functions, loading, error: functionsError, fetchFunctions, deleteFunction } = useFunctions(botId);
  const {
    crmFields,
    pipelines,
    stages,
    selectedPipeline: crmSelectedPipeline,
    setSelectedPipeline: setCrmSelectedPipeline,
    loading: loadingCRMData,
    fetchCRMData,
    fetchStages,
    getFilteredFields,
  } = useCRMData(botId);

  const {
    functionName,
    setFunctionName,
    functionInstruction,
    setFunctionInstruction,
    selectedPhase,
    setSelectedPhase,
    selectedPipeline: formSelectedPipeline,
    setSelectedPipeline: setFormSelectedPipeline,
    editing,
    saving,
    functionToEdit,
    viewingFunction,
    viewMode,
    handleSave: formHandleSave,
    handleEdit: formHandleEdit,
    handleView: formHandleView,
    resetForm,
    setViewMode,
  } = useFunctionForm({
    botId,
    onSuccess: (message) => setSuccess(message),
    onError: (message) => setError(message),
    onSaveComplete: () => {
      setShowCreateForm(false);
    },
    fetchCRMData,
    crmFields,
    pipelines,
    fetchStages,
    setSelectedPipeline: setCrmSelectedPipeline,
  });

  const {
    properties,
    fieldSearchTerms,
    showFieldDropdowns,
    addProperty,
    removeProperty,
    updateProperty,
    handleFieldSelect,
    setFieldSearchTerm,
    setFieldDropdown,
    resetProperties,
    setPropertiesWithSearchTerms,
  } = useFunctionProperties();

  // Sync form pipeline with CRM pipeline
  const selectedPipeline = formSelectedPipeline || crmSelectedPipeline;
  const setSelectedPipeline = useCallback((pipelineId: string) => {
    setFormSelectedPipeline(pipelineId);
    setCrmSelectedPipeline(pipelineId);
  }, [setFormSelectedPipeline, setCrmSelectedPipeline]);

  // Initialize on mount
  useEffect(() => {
    if (botId) {
      fetchFunctions();
      fetchCRMData();
    }
  }, [botId, fetchFunctions, fetchCRMData]);

  // Handle errors from functions hook
  useEffect(() => {
    if (functionsError) {
      setError(functionsError);
    }
  }, [functionsError]);

  // Handlers
  const handleCreateFunction = useCallback(() => {
    setShowCreateForm(true);
    setViewMode('create');
    resetForm();
    resetProperties();
    setError('');
    setSuccess('');
  }, [resetForm, resetProperties, setViewMode]);

  const handleCancelCreate = useCallback(() => {
    setShowCreateForm(false);
    setViewMode('create');
    resetForm();
    resetProperties();
    setError('');
    setSuccess('');
  }, [resetForm, resetProperties, setViewMode]);

  const handleViewFunction = useCallback(async (func: FunctionData) => {
    try {
      setError('');
      const result = await formHandleView(func);
      if (result) {
        setPropertiesWithSearchTerms(result.properties);
        setShowCreateForm(true);
        setMenuOpen(null);
      }
    } catch (err) {
      // Error already handled in hook
    }
  }, [formHandleView, setPropertiesWithSearchTerms]);

  const handleEditFunction = useCallback(async (func: FunctionData) => {
    try {
      setError('');
      const result = await formHandleEdit(func);
      if (result) {
        setPropertiesWithSearchTerms(result.properties);
        setShowCreateForm(true);
        setMenuOpen(null);
      }
    } catch (err) {
      // Error already handled in hook
    }
  }, [formHandleEdit, setPropertiesWithSearchTerms]);

  const handleDeleteFunction = useCallback((func: FunctionData) => {
    setFunctionToDelete(func);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!functionToDelete) return;
    
    const result = await deleteFunction(functionToDelete.id);
    if (result.success) {
      setSuccess('Function deleted successfully!');
      setFunctionToDelete(null);
    } else {
      setError(result.error || 'Failed to delete function');
    }
  }, [functionToDelete, deleteFunction]);

  const cancelDelete = useCallback(() => {
    setFunctionToDelete(null);
  }, []);

  const handleSave = useCallback(async () => {
    await formHandleSave(properties, fetchFunctions);
  }, [formHandleSave, properties, fetchFunctions]);

  // Property handlers
  const handleFieldSearchChange = useCallback((propertyId: string, term: string) => {
    setFieldSearchTerm(propertyId, term);
    setFieldDropdown(propertyId, true);
  }, [setFieldSearchTerm, setFieldDropdown]);

  const handleFieldFocus = useCallback((propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property?.field_name && !fieldSearchTerms[propertyId]) {
      setFieldSearchTerm(propertyId, property.field_name);
    }
    setFieldDropdown(propertyId, true);
  }, [properties, fieldSearchTerms, setFieldSearchTerm, setFieldDropdown]);

  const handleFieldBlur = useCallback((propertyId: string) => {
    setTimeout(() => {
      setFieldDropdown(propertyId, false);
      const property = properties.find(p => p.id === propertyId);
      if (property?.field_name && property?.field_code) {
        setFieldSearchTerm(propertyId, property.field_name);
      }
    }, 200);
  }, [properties, setFieldDropdown, setFieldSearchTerm]);

  const handleFieldSelectWrapper = useCallback((propertyId: string, field: any) => {
    handleFieldSelect(propertyId, field);
  }, [handleFieldSelect]);

  const handleDescriptionChange = useCallback((propertyId: string, value: string) => {
    updateProperty(propertyId, 'description', value);
  }, [updateProperty]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-muted-foreground">Loading functions...</div>
      </div>
    );
  }

  if (!botId) {
    return (
      <div className="text-center text-muted-foreground">
        Please select a bot to manage its functions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertMessages
        success={success}
        error={error}
        onSuccessDismiss={() => setSuccess('')}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Functions
        </h2>
        <button
          onClick={() => showCreateForm ? handleCancelCreate() : handleCreateFunction()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {showCreateForm ? 'Close form' : 'Create function'}
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm">
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
            crmFieldsCount={crmFields.length}
            viewingFunction={viewingFunction}
            onNameChange={setFunctionName}
            onInstructionChange={setFunctionInstruction}
            onPhaseChange={setSelectedPhase}
            onPipelineChange={setSelectedPipeline}
            onFieldSearchChange={handleFieldSearchChange}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldSelect={handleFieldSelectWrapper}
            onDescriptionChange={handleDescriptionChange}
            onAddProperty={addProperty}
            onRemoveProperty={removeProperty}
            onEditClick={() => viewingFunction && handleEditFunction(viewingFunction)}
            onCancel={handleCancelCreate}
            onSave={handleSave}
          />
        </div>
      )}

      <FunctionList
        functions={functions}
        menuOpen={menuOpen}
        onView={handleViewFunction}
        onEdit={handleEditFunction}
        onDelete={handleDeleteFunction}
        onMenuToggle={setMenuOpen}
      />

      {functionToDelete && (
        <DeleteConfirmationModal
          functionToDelete={functionToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
