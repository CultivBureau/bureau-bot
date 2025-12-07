import { useState, useCallback } from 'react';
import { functionsService } from '../../../../services/functions';
import { parseResultFormat, parseFunctionProperties } from '../../../../utils/functions/parsers';
import { formatFunctionForAPI, validateFunctionData } from '../../../../utils/functions/formatters';
import type { FunctionData, ViewMode } from '../../../../types/functions';
import type { Function } from '../../../../services/functions';

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
    
    try {
      const resultFormat = formatFunctionForAPI(properties, selectedPhase);

      if (editing && functionToEdit) {
        await functionsService.updateFunction(functionToEdit.id, {
          bot: botId,
          name: functionName.trim(),
          integration_type: 'BITRIX',
          is_active: true,
          trigger_instructions: functionInstruction.trim() || null,
          result_format: resultFormat,
        });
        
        await onFetchFunctions();
        onSuccess?.('Function updated successfully!');
      } else {
        await functionsService.createFunction({
          bot: botId,
          name: functionName.trim(),
          integration_type: 'BITRIX',
          is_active: true,
          trigger_instructions: functionInstruction.trim() || null,
          result_format: resultFormat,
        });
        
        await onFetchFunctions();
        onSuccess?.('Function created successfully!');
      }
      
      resetForm();
      onSaveComplete?.();
    } catch (err: any) {
      onError?.(err?.message || 'Failed to save function');
    } finally {
      setSaving(false);
    }
  }, [botId, functionName, functionInstruction, selectedPhase, editing, functionToEdit, onSuccess, onError, onSaveComplete]);

  const handleEdit = useCallback(async (func: FunctionData) => {
    try {
      if (crmFields.length === 0 && fetchCRMData) {
        await fetchCRMData();
      }
      
      const functionResponse = await functionsService.getFunctionById(func.id);
      
      setFunctionToEdit(func);
      setFunctionName(functionResponse.name || func.name);
      setFunctionInstruction(functionResponse.trigger_instructions || func.instruction || '');
      
      const parsed = parseResultFormat(functionResponse.result_format);
      const phase = parsed.stage || '';
      
      let properties: any[] = [];
      if (parsed.properties && parsed.properties.length > 0) {
        const propertiesJson = JSON.stringify(parsed.properties);
        properties = parseFunctionProperties(propertiesJson, crmFields);
      }
      
      setSelectedPhase(phase);
      
      // Try to find the pipeline for this stage
      if (phase && pipelines.length > 0 && fetchStages && setSelectedPipeline) {
        const findPipelineForStage = async () => {
          for (const pipeline of pipelines) {
            try {
              await fetchStages(pipeline.pipeline_id);
              // We'll need to check stages after fetching - this will be handled by the parent
              if (pipeline.pipeline_id) {
                setSelectedPipeline(pipeline.pipeline_id);
                setSelectedPipelineLocal(pipeline.pipeline_id);
                break;
              }
            } catch (err) {
              console.error('Error fetching stages:', err);
            }
          }
        };
        await findPipelineForStage();
      }
      
      setEditing(true);
      setViewMode('edit');
      setViewingFunction(null);
      
      return { properties, phase };
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
      
      const functionResponse = await functionsService.getFunctionById(func.id);
      
      setViewingFunction(func);
      setFunctionName(functionResponse.name || func.name);
      setFunctionInstruction(functionResponse.trigger_instructions || func.instruction || '');
      
      const parsed = parseResultFormat(functionResponse.result_format);
      const phase = parsed.stage || '';
      
      let properties: any[] = [];
      if (parsed.properties && parsed.properties.length > 0) {
        const propertiesJson = JSON.stringify(parsed.properties);
        properties = parseFunctionProperties(propertiesJson, crmFields);
      }
      
      setSelectedPhase(phase);
      
      // Try to find the pipeline for this stage
      if (phase && pipelines.length > 0 && fetchStages && setSelectedPipeline) {
        const findPipelineForStage = async () => {
          for (const pipeline of pipelines) {
            try {
              await fetchStages(pipeline.pipeline_id);
              if (pipeline.pipeline_id) {
                setSelectedPipeline(pipeline.pipeline_id);
                setSelectedPipelineLocal(pipeline.pipeline_id);
                break;
              }
            } catch (err) {
              console.error('Error fetching stages:', err);
            }
          }
        };
        await findPipelineForStage();
      }
      
      setViewMode('view');
      
      return { properties, phase };
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

