import { useState, useCallback } from 'react';
import type { FunctionData } from '../../../../types/functions';

// Mock data for UI-only mode
const MOCK_FUNCTIONS: FunctionData[] = [];

export function useFunctions(botId: string | null) {
  const [functions, setFunctions] = useState<FunctionData[]>(MOCK_FUNCTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFunctions = useCallback(async () => {
    if (!botId) return;
    
    // Simulate API call with timeout
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setFunctions(MOCK_FUNCTIONS);
      setLoading(false);
    }, 300);
  }, [botId]);

  const deleteFunction = useCallback(async (functionId: string) => {
    // Remove function from local state
    setFunctions(prev => prev.filter(f => f.id !== functionId));
    return { success: true, error: undefined };
  }, []);

  return {
    functions,
    loading,
    error,
    fetchFunctions,
    deleteFunction,
  };
}

