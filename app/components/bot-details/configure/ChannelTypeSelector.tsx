'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Edit, Check, X, RefreshCw } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { botService } from '../../../services/bot';
import type { ChannelType } from '../../../types/bot';

interface ChannelTypeSelectorProps {
  value: string;
  editing: boolean;
  editValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  saving?: boolean;
}

export function ChannelTypeSelector({
  value,
  editing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  saving = false,
}: ChannelTypeSelectorProps) {
  const [channelTypes, setChannelTypes] = useState<ChannelType[]>([]);
  const [loadingChannelTypes, setLoadingChannelTypes] = useState(false);

  useEffect(() => {
    if (editing) {
      fetchChannelTypes();
    }
  }, [editing]);

  const fetchChannelTypes = async () => {
    setLoadingChannelTypes(true);
    try {
      const types = await botService.getChannelTypes();
      setChannelTypes(types);
    } catch (error) {
      // Error fetching channel types
    } finally {
      setLoadingChannelTypes(false);
    }
  };

  const selectedLabel = channelTypes.find((t) => t.value === value)?.label || value;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Channel Type
        {channelTypes.length > 0 && (
          <span className="text-xs font-normal text-muted-foreground ml-2">
            ({channelTypes.length} {channelTypes.length === 1 ? 'type' : 'types'} available)
          </span>
        )}
      </label>
      <div className="flex items-center gap-2 min-w-0">
        <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        {editing ? (
          <>
            {loadingChannelTypes ? (
              <div className="flex-1 px-4 py-2 rounded-xl bg-card/50 flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading channel types...
                </span>
              </div>
            ) : (
              <select
                value={editValue}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-input bg-input-background text-card-foreground min-w-0"
                disabled={saving}
              >
                {channelTypes.length > 0 ? (
                  channelTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))
                ) : (
                  <option value={value}>{selectedLabel}</option>
                )}
              </select>
            )}
            <Button
              onClick={onSave}
              disabled={saving || loadingChannelTypes}
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
                {selectedLabel || 'Not set'}
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

