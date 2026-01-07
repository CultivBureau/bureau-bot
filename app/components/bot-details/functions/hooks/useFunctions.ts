import { useState, useCallback } from 'react';
import { functionsService, type Function } from '../../../../services/functions';
import type { FunctionData } from '../../../../types/functions';
import { parseResultFormat } from '../../../../utils/functions/parsers';

/**
 * Map API Function to UI FunctionData
 */
function mapFunctionToFunctionData(func: Function): FunctionData {
  const parsed = parseResultFormat(func.result_format);
  
  return {
    id: func.id,
    name: func.name,
    instruction: func.trigger_instructions || '',
    properties: func.bitrix_field_mappings.map((mapping, index) => ({
      id: mapping.id || `${func.id}-${index}`,
      name: mapping.name || mapping.crm_field_name,
      field_code: mapping.crm_field_code,
      field_name: mapping.crm_field_name,
      type: mapping.data_type || 'STRING',
      description: mapping.description || '',
      required: false,
    })),
    phase: parsed.stage || '',
    created_at: func.created_on || new Date().toISOString(),
    updated_at: func.updated_on || func.created_on || new Date().toISOString(),
    integration_type: 'BITRIX',
    is_active: true,
  };
}

export function useFunctions(botId: string | null) {
  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFunctions = useCallback(async () => {
    if (!botId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await functionsService.getFunctions({
        bot_id: botId,
        pageNumber: 1,
        pageSize: 100, // Get all functions for now
      });
      
      const mappedFunctions = response.results.map(mapFunctionToFunctionData);
      setFunctions(mappedFunctions);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch functions';
      setError(errorMessage);
      console.error('Error fetching functions:', err);
    } finally {
      setLoading(false);
    }
  }, [botId]);

  const deleteFunction = useCallback(async (functionId: string) => {
    try {
      await functionsService.deleteFunction(functionId);
      setFunctions(prev => prev.filter(f => f.id !== functionId));
      return { success: true, error: undefined };
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete function';
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    functions,
    loading,
    error,
    fetchFunctions,
    deleteFunction,
  };
}

