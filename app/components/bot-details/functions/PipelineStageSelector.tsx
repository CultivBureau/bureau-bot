'use client';

import { memo } from 'react';
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Change phase or sales funnel:
      </label>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-card-foreground">
          Pipeline:
        </label>
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
          {pipelines.map((pipeline, index) => (
            <option key={pipeline.pipeline_id || index} value={pipeline.pipeline_id}>
              {pipeline.pipeline_name}
            </option>
          ))}
        </select>
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

