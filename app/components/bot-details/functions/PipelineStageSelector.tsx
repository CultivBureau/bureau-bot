'use client';

import { memo, useState, useMemo } from 'react';
import type { ViewMode } from '../../../types/functions';

interface PipelineStageSelectorProps {
  pipelines: Array<{ pipeline_id: string; pipeline_name: string }>;
  stages: Array<{ stage_code: string; stage_name: string; stage_id?: string }>;
  selectedPipeline: string;
  selectedStage: string;
  onPipelineChange: (pipelineId: string) => void;
  onStageChange: (stageCode: string) => void;
  viewMode: ViewMode;
  loading?: boolean;
}

export const PipelineStageSelector = memo(function PipelineStageSelector({
  pipelines,
  stages,
  selectedPipeline,
  selectedStage,
  onPipelineChange,
  onStageChange,
  viewMode,
  loading = false,
}: PipelineStageSelectorProps) {
  const isDisabled = viewMode === 'view';
  const [pipelineFilter, setPipelineFilter] = useState<string>('ALL');

  // Filter pipelines by entity type (currently all pipelines are DEAL type)
  const filteredPipelines = useMemo(() => {
    if (pipelineFilter === 'ALL') {
      return pipelines;
    }
    // Since pipelines only exist for DEAL in Bitrix24, 
    // filtering by LEAD or CONTACT will return empty
    return pipelineFilter === 'DEAL' ? pipelines : [];
  }, [pipelines, pipelineFilter]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Change phase or sales funnel:
      </label>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-card-foreground">
            Pipeline:
          </label>
          {!isDisabled && (
            <select
              value={pipelineFilter}
              onChange={(e) => setPipelineFilter(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border border-border bg-background text-foreground hover:bg-secondary cursor-pointer"
            >
              <option value="ALL">ALL</option>
              <option value="DEAL">DEAL</option>
              <option value="LEAD">LEAD</option>
              <option value="CONTACT">CONTACT</option>
            </select>
          )}
        </div>
        <select
          value={selectedPipeline}
          onChange={(e) => onPipelineChange(e.target.value)}
          disabled={isDisabled || loading}
          className={`w-full px-4 py-3 rounded-xl border border-border ${
            isDisabled 
              ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
              : 'bg-background text-foreground'
          }`}
        >
          <option value="">Select pipeline</option>
          {filteredPipelines.map((pipeline, index) => (
            <option key={pipeline.pipeline_id || index} value={pipeline.pipeline_id}>
              {pipeline.pipeline_name}
            </option>
          ))}
        </select>
        {pipelineFilter !== 'ALL' && pipelineFilter !== 'DEAL' && filteredPipelines.length === 0 && (
          <div className="text-xs text-muted-foreground px-2">
            No pipelines available for {pipelineFilter} entity type. Pipelines only exist for DEAL.
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-card-foreground">
          Stage:
        </label>
        <select
          value={selectedStage}
          onChange={(e) => onStageChange(e.target.value)}
          disabled={isDisabled || loading || !selectedPipeline}
          className={`w-full px-4 py-3 rounded-xl border border-border ${
            isDisabled 
              ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
              : 'bg-background text-foreground'
          }`}
        >
          <option value="">Select stage</option>
          {stages.map((stage, index) => (
            <option key={stage.stage_code || stage.stage_id || index} value={stage.stage_code}>
              {stage.stage_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

