import { useState, useCallback } from 'react';
import { validateFunctionData, formatFunctionForAPI, formatPropertiesForAPI } from '../../../../utils/functions/formatters';
import { functionsService, type Function } from '../../../../services/functions';
import { parseResultFormat } from '../../../../utils/functions/parsers';
import type { FunctionData, ViewMode, FunctionProperty } from '../../../../types/functions';

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
    properties: FunctionProperty[],
    onFetchFunctions: () => Promise<void>
  ) => {
    if (!botId) {
      onError?.('Bot ID is required');
      return;
    }
    
    const validation = validateFunctionData(functionName, properties);
    if (!validation.valid) {
      onError?.(validation.error || 'Validation failed');
      return;
    }
    
    setSaving(true);
    onError?.('');
    
    try {
      // Format properties for API
      const formattedProperties = formatPropertiesForAPI(properties);
      
      // Build bitrix_field_mappings from properties
      // Map CRM field data: id → crm_field_code, title → crm_field_name, type → data_type
      const bitrixFieldMappings = formattedProperties.map(formattedProp => {
        const originalProp = properties.find(p => 
          (p.field_code || p.name) === formattedProp.field_code
        );
        
        // Ensure data_type is properly formatted (uppercase)
        let dataType = 'STRING';
        if (originalProp?.type) {
          dataType = originalProp.type.toUpperCase();
        }
        
        return {
          name: formattedProp.field_name, // Use CRM field title as name
          description: formattedProp.description || '',
          crm_field_name: formattedProp.field_name, // CRM field title → crm_field_name
          crm_field_code: formattedProp.field_code, // CRM field id → crm_field_code
          data_type: dataType, // CRM field type → data_type
        };
      });
      
      const functionData: any = {
        bot: botId,
        name: functionName,
        trigger_instructions: functionInstruction || '',
        bitrix_field_mappings: bitrixFieldMappings,
        pipeline: selectedPipeline,
        stage: selectedPhase,
      };
      
      if (editing && functionToEdit) {
        // Update existing function
        console.log('Updating function with data:', functionData);
        await functionsService.updateFunction(functionToEdit.id, functionData);
        onSuccess?.('Function updated successfully!');
      } else {
        // Create new function
        console.log('Creating function with data:', functionData);
        await functionsService.createFunction(functionData);
        onSuccess?.('Function created successfully!');
      }
      
      await onFetchFunctions();
      resetForm();
      onSaveComplete?.();
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to save function';
      onError?.(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [botId, functionName, functionInstruction, selectedPhase, editing, functionToEdit, onSuccess, onError, onSaveComplete]);

  const handleEdit = useCallback(async (func: FunctionData) => {
    try {
      if (crmFields.length === 0 && fetchCRMData) {
        await fetchCRMData();
      }
      
      // Fetch fresh data from API to ensure we have the latest
      let apiFunction: Function;
      try {
        apiFunction = await functionsService.getFunction(func.id);
      } catch (err) {
        // If fetch fails, use the existing function data
        apiFunction = func as any;
      }
      
      setFunctionToEdit(func);
      setFunctionName(apiFunction.name || func.name);
      setFunctionInstruction(apiFunction.trigger_instructions || func.instruction || '');
      
      // Parse result_format to get stage and properties
      const parsed = parseResultFormat(apiFunction.result_format || func.instruction);
      setSelectedPhase(parsed.stage || func.phase || '');
      
      // Map bitrix_field_mappings to properties
      const properties: FunctionProperty[] = (apiFunction.bitrix_field_mappings || func.properties || []).map((mapping, index) => ({
        id: (mapping as any).id || `${func.id}-${index}`,
        name: mapping.name || mapping.crm_field_name,
        field_code: mapping.crm_field_code,
        field_name: mapping.crm_field_name,
        type: mapping.data_type || 'STRING',
        description: mapping.description || '',
        required: false,
      }));
      
      // Try to find the pipeline for this stage
      if (parsed.stage && pipelines.length > 0 && fetchStages && setSelectedPipeline) {
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
      
      return { properties, phase: parsed.stage || func.phase };
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
      
      // Fetch fresh data from API to ensure we have the latest
      let apiFunction: Function;
      try {
        apiFunction = await functionsService.getFunction(func.id);
      } catch (err) {
        // If fetch fails, use the existing function data
        apiFunction = func as any;
      }
      
      setViewingFunction(func);
      setFunctionName(apiFunction.name || func.name);
      setFunctionInstruction(apiFunction.trigger_instructions || func.instruction || '');
      
      // Parse result_format to get stage and properties
      const parsed = parseResultFormat(apiFunction.result_format || func.instruction);
      setSelectedPhase(parsed.stage || func.phase || '');
      
      // Map bitrix_field_mappings to properties
      const properties: FunctionProperty[] = (apiFunction.bitrix_field_mappings || func.properties || []).map((mapping, index) => ({
        id: (mapping as any).id || `${func.id}-${index}`,
        name: mapping.name || mapping.crm_field_name,
        field_code: mapping.crm_field_code,
        field_name: mapping.crm_field_name,
        type: mapping.data_type || 'STRING',
        description: mapping.description || '',
        required: false,
      }));
      
      // Try to find the pipeline for this stage
      if (parsed.stage && pipelines.length > 0 && fetchStages && setSelectedPipeline) {
        const firstPipeline = pipelines[0];
        if (firstPipeline?.pipeline_id) {
          setSelectedPipeline(firstPipeline.pipeline_id);
          setSelectedPipelineLocal(firstPipeline.pipeline_id);
          await fetchStages(firstPipeline.pipeline_id);
        }
      }
      
      setViewMode('view');
      
      return { properties, phase: parsed.stage || func.phase };
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

