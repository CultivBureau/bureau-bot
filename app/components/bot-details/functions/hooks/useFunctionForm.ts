import { useState, useCallback } from 'react';
import { validateFunctionData } from '../../../../utils/functions/formatters';
import type { FunctionData, ViewMode } from '../../../../types/functions';

interface UseFunctionFormOptions {
  botId: string | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onSaveComplete?: () => void;
  fetchCRMData?: () => Promise<void>;
  crmFields?: any[];
  pipelines?: any[];
  fetchStages?: (pipelineId: string) => Promise<void>;
  setSelectedPipeline?: (pipelineId: string) => void;
}

export function useFunctionForm({
  botId,
  onSuccess,
  onError,
  onSaveComplete,
  fetchCRMData,
  crmFields = [],
  pipelines = [],
  fetchStages,
  setSelectedPipeline,
}: UseFunctionFormOptions) {
  const [functionName, setFunctionName] = useState('');
  const [functionInstruction, setFunctionInstruction] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [selectedPipeline, setSelectedPipelineLocal] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [functionToEdit, setFunctionToEdit] = useState<FunctionData | null>(null);
  const [viewingFunction, setViewingFunction] = useState<FunctionData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('create');

  const handleSave = useCallback(async (
    properties: any[],
    onFetchFunctions: () => Promise<void>
  ) => {
    if (!botId) return;
    
    const validation = validateFunctionData(functionName, properties);
    if (!validation.valid) {
      onError?.(validation.error || 'Validation failed');
      return;
    }
    
    setSaving(true);
    onError?.('');
    
    // Simulate save operation
    setTimeout(async () => {
      try {
        if (editing && functionToEdit) {
          onSuccess?.('Function updated successfully!');
        } else {
          onSuccess?.('Function created successfully!');
        }
        
        await onFetchFunctions();
        resetForm();
        onSaveComplete?.();
      } catch (err: any) {
        onError?.(err?.message || 'Failed to save function');
      } finally {
        setSaving(false);
      }
    }, 500);
  }, [botId, functionName, functionInstruction, selectedPhase, editing, functionToEdit, onSuccess, onError, onSaveComplete]);

  const handleEdit = useCallback(async (func: FunctionData) => {
    try {
      if (crmFields.length === 0 && fetchCRMData) {
        await fetchCRMData();
      }
      
      setFunctionToEdit(func);
      setFunctionName(func.name);
      setFunctionInstruction(func.instruction || '');
      setSelectedPhase(func.phase || '');
      
      const properties = func.properties || [];
      
      // Try to find the pipeline for this stage
      if (func.phase && pipelines.length > 0 && fetchStages && setSelectedPipeline) {
        const firstPipeline = pipelines[0];
        if (firstPipeline?.pipeline_id) {
          setSelectedPipeline(firstPipeline.pipeline_id);
          setSelectedPipelineLocal(firstPipeline.pipeline_id);
          await fetchStages(firstPipeline.pipeline_id);
        }
      }
      
      setEditing(true);
      setViewMode('edit');
      setViewingFunction(null);
      
      return { properties, phase: func.phase };
    } catch (err: any) {
      onError?.(err?.message || 'Failed to load function data');
      throw err;
    }
  }, [crmFields, fetchCRMData, pipelines, fetchStages, setSelectedPipeline, onError]);

  const handleView = useCallback(async (func: FunctionData) => {
    try {
      if (crmFields.length === 0 && fetchCRMData) {
        await fetchCRMData();
      }
      
      setViewingFunction(func);
      setFunctionName(func.name);
      setFunctionInstruction(func.instruction || '');
      setSelectedPhase(func.phase || '');
      
      const properties = func.properties || [];
      
      // Try to find the pipeline for this stage
      if (func.phase && pipelines.length > 0 && fetchStages && setSelectedPipeline) {
        const firstPipeline = pipelines[0];
        if (firstPipeline?.pipeline_id) {
          setSelectedPipeline(firstPipeline.pipeline_id);
          setSelectedPipelineLocal(firstPipeline.pipeline_id);
          await fetchStages(firstPipeline.pipeline_id);
        }
      }
      
      setViewMode('view');
      
      return { properties, phase: func.phase };
    } catch (err: any) {
      onError?.(err?.message || 'Failed to load function data');
      throw err;
    }
  }, [crmFields, fetchCRMData, pipelines, fetchStages, setSelectedPipeline, onError]);

  const resetForm = useCallback(() => {
    setFunctionName('');
    setFunctionInstruction('');
    setSelectedPhase('');
    setSelectedPipelineLocal('');
    setEditing(false);
    setFunctionToEdit(null);
    setViewingFunction(null);
    setViewMode('create');
  }, []);

  const setViewModeState = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return {
    functionName,
    setFunctionName,
    functionInstruction,
    setFunctionInstruction,
    selectedPhase,
    setSelectedPhase,
    selectedPipeline: selectedPipeline,
    setSelectedPipeline: setSelectedPipelineLocal,
    editing,
    saving,
    functionToEdit,
    viewingFunction,
    viewMode,
    handleSave,
    handleEdit,
    handleView,
    resetForm,
    setViewMode: setViewModeState,
  };
}

