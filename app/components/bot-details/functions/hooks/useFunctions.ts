import { useState, useCallback } from 'react';
import { functionsService } from '../../../../services/functions';
import { parseResultFormat } from '../../../../utils/functions/parsers';
import type { FunctionData } from '../../../../types/functions';
import type { Function } from '../../../../services/functions';

export function useFunctions(botId: string | null) {
  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFunctions = useCallback(async () => {
    if (!botId) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await functionsService.getFunctions({ 
        bot_id: botId,
        integration_type: 'BITRIX'
      });
      
      const functionsList = response.results || [];
      
      const mappedFunctions = functionsList.map((func: Function) => {
        const parsed = parseResultFormat(func.result_format);
        
        const properties = (parsed.properties || []).map((prop, index) => ({
          id: `${func.id}-prop-${index}`,
          name: prop.field_code || prop.field_name || '',
          field_code: prop.field_code || '',
          field_name: prop.field_name || '',
          type: 'string',
          description: prop.description || '',
          required: true,
        }));
        
        return {
          id: func.id,
          name: func.name,
          instruction: func.trigger_instructions || '',
          properties: properties,
          phase: parsed.stage || '',
          created_at: func.created_on || '',
          updated_at: func.updated_on || func.created_on || '',
          integration_type: func.integration_type,
          is_active: func.is_active,
        };
      });
      
      setFunctions(mappedFunctions);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch functions');
      setFunctions([]);
    } finally {
      setLoading(false);
    }
  }, [botId]);

  const deleteFunction = useCallback(async (functionId: string) => {
    try {
      await functionsService.deleteFunction(functionId);
      await fetchFunctions();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete function' };
    }
  }, [fetchFunctions]);

  return {
    functions,
    loading,
    error,
    fetchFunctions,
    deleteFunction,
  };
}

