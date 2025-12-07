import { useState, useCallback, useEffect, useMemo } from 'react';
import { bitrixService } from '../../../../services/bitrix';
import { filterCRMFields } from '../../../../utils/functions/fieldFilters';
import type { CRMField } from '../../../../types/functions';

export function useCRMData(botId: string | null) {
  const [crmFields, setCrmFields] = useState<CRMField[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchCRMData = useCallback(async () => {
    if (!botId) return;
    
    try {
      setLoading(true);
      const fieldsResponse = await bitrixService.getCrmFields({ bot_id: botId });
      const fields = Array.isArray(fieldsResponse) 
        ? fieldsResponse 
        : (fieldsResponse.results || fieldsResponse);
      setCrmFields(fields);
      
      const pipelinesResponse = await bitrixService.getPipelines({ 
        bot_id: botId, 
        entity_type: 'DEAL' 
      });
      const pipelinesList = Array.isArray(pipelinesResponse) 
        ? pipelinesResponse 
        : (pipelinesResponse.results || pipelinesResponse);
      setPipelines(pipelinesList);
    } catch (err) {
      console.error('Failed to fetch CRM data:', err);
    } finally {
      setLoading(false);
    }
  }, [botId]);

  const fetchPipelines = useCallback(async () => {
    if (!botId) return;
    
    try {
      const response = await bitrixService.getPipelines({ 
        bot_id: botId, 
        entity_type: 'DEAL' 
      });
      const pipelinesList = Array.isArray(response) 
        ? response 
        : (response.results || response);
      setPipelines(pipelinesList);
    } catch (err) {
      console.error('Failed to fetch pipelines:', err);
    }
  }, [botId]);

  const fetchStages = useCallback(async (pipelineId: string) => {
    if (!botId || !pipelineId) return;
    
    try {
      const response = await bitrixService.getStages({ 
        bot_id: botId, 
        pipeline_id: pipelineId, 
        entity_type: 'DEAL' 
      });
      const stagesList = Array.isArray(response) 
        ? response 
        : (response.results || response);
      setStages(stagesList);
    } catch (err) {
      console.error('Failed to fetch stages:', err);
      setStages([]);
    }
  }, [botId]);

  // Fetch stages when pipeline changes
  useEffect(() => {
    if (selectedPipeline) {
      fetchStages(selectedPipeline);
    } else {
      setStages([]);
    }
  }, [selectedPipeline, fetchStages]);

  // Memoized filtered fields function
  const getFilteredFields = useMemo(() => {
    return (searchTerm: string, entityType?: string) => {
      return filterCRMFields(crmFields, searchTerm, entityType);
    };
  }, [crmFields]);

  return {
    crmFields,
    pipelines,
    stages,
    selectedPipeline,
    setSelectedPipeline,
    loading,
    fetchCRMData,
    fetchPipelines,
    fetchStages,
    getFilteredFields,
  };
}

