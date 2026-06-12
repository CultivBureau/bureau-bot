'use client';

import { Edit, Check, X, ChevronDown } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { cn } from '../../landing/ui/utils';
import { PROVIDER_OPTIONS } from '../../../constants/llm';
import type { LLMProvider } from '../../../types/bot';

interface ProviderFieldProps {
  value: LLMProvider;
  editing: boolean;
  editValue: LLMProvider;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: LLMProvider) => void;
  saving?: boolean;
}

export function ProviderField({
  value,
  editing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  saving = false,
}: ProviderFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        LLM Provider
      </label>
      <div className="flex items-center gap-2 min-w-0">
        {editing ? (
          <>
            <div className="relative flex-1 min-w-0">
              <select
                value={editValue}
                onChange={(e) => onChange(e.target.value as LLMProvider)}
                className={cn(
                  'flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground',
                  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pr-9'
                )}
                disabled={saving}
              >
                {PROVIDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button onClick={onSave} disabled={saving} size="sm" className="flex-shrink-0">
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
              className={cn(
                'flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground min-w-0 overflow-hidden cursor-pointer hover:bg-card/70'
              )}
              onClick={onEdit}
            >
              <div className="truncate">{value}</div>
            </div>
            <Button onClick={onEdit} variant="outline" size="sm" className="flex-shrink-0">
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
