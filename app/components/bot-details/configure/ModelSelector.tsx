'use client';

import { useState, useEffect } from 'react';
import { Cpu, Edit, Check, X, RefreshCw } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { botService } from '../../../services/bot';
import type { GPTModel } from '../../../types/bot';
import { cn } from '../../landing/ui/utils';

interface ModelSelectorProps {
  value: string;
  editing: boolean;
  editValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  saving?: boolean;
}

export function ModelSelector({
  value,
  editing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  saving = false,
}: ModelSelectorProps) {
  const [models, setModels] = useState<GPTModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (editing) {
      fetchModels();
    }
  }, [editing]);

  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const gptModels = await botService.getGPTModels();
      setModels(gptModels);
    } catch (error) {
      // Error fetching models
    } finally {
      setLoadingModels(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        GPT Model
        {models.length > 0 && (
          <span className="text-xs font-normal text-muted-foreground ml-2">
            ({models.length} {models.length === 1 ? 'model' : 'models'} available)
          </span>
        )}
      </label>
      <div className="flex items-center gap-2 min-w-0">
        <Cpu className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        {editing ? (
          <>
            {loadingModels ? (
              <div className="flex-1 px-4 py-2 rounded-xl bg-card/50 flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading models...
                </span>
              </div>
            ) : (
              <select
                value={editValue}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground min-w-0 [&>option]:bg-background [&>option]:text-foreground dark:[&>option]:bg-card dark:[&>option]:text-card-foreground"
                disabled={saving}
              >
                {models.length > 0 ? (
                  models.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))
                ) : (
                  <option value={value}>{value}</option>
                )}
              </select>
            )}
            <Button
              onClick={onSave}
              disabled={saving || loadingModels}
              size="sm"
              className="flex-shrink-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              onClick={onCancel}
              disabled={saving}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div
              className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground cursor-pointer hover:bg-card/70 min-w-0 overflow-hidden"
              onClick={onEdit}
            >
              <div className="truncate">
                {value || 'Not set'}
              </div>
            </div>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

