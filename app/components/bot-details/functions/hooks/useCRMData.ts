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
      
      // Fetch fields for each entity type separately to tag them properly
      const [dealResponse, leadResponse, contactResponse] = await Promise.all([
        bitrixService.getCrmFields({ bot_id: botId, entity_type: 'DEAL' }),
        bitrixService.getCrmFields({ bot_id: botId, entity_type: 'LEAD' }),
        bitrixService.getCrmFields({ bot_id: botId, entity_type: 'CONTACT' }),
      ]);
      
      // Process and tag each field with its entity type
      const dealFields = (Array.isArray(dealResponse) ? dealResponse : [])
        .map((field: any) => ({ ...field, entity_type: 'DEAL' }));
      
      const leadFields = (Array.isArray(leadResponse) ? leadResponse : [])
        .map((field: any) => ({ ...field, entity_type: 'LEAD' }));
      
      const contactFields = (Array.isArray(contactResponse) ? contactResponse : [])
        .map((field: any) => ({ ...field, entity_type: 'CONTACT' }));
      
      // Combine all fields
      const allFields = [...dealFields, ...leadFields, ...contactFields];
      setCrmFields(allFields);
      
      const pipelinesResponse = await bitrixService.getPipelines({ 
        bot_id: botId, 
        entity_type: 'DEAL' 
      });
      // Map API response to expected format
      const pipelinesList = pipelinesResponse.map((p: any) => ({
        pipeline_id: String(p.id),
        pipeline_name: p.name,
        sort: p.sort,
        is_default: p.isDefault === 'Y',
      }));
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
      // Map API response to expected format
      const pipelinesList = response.map((p: any) => ({
        pipeline_id: String(p.id),
        pipeline_name: p.name,
        sort: p.sort,
        is_default: p.isDefault === 'Y',
      }));
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
      // Map API response to expected format
      const stagesList = response.map((s: any) => ({
        stage_id: s.STATUS_ID,
        stage_code: s.STATUS_ID,
        stage_name: s.NAME,
        sort_order: s.SORT || 0,
        color: s.COLOR,
      }));
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

