'use client';

import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '../landing/ui/input';
import { Label } from '../landing/ui/label';
import { cn } from '../landing/ui/utils';
import type { BotFormData } from './NewBotModal';
import type { ChannelType, GPTModel } from '../../types/bot';

interface Step2ConfigurationProps {
  formData: BotFormData;
  errors: Partial<Record<keyof BotFormData | '_general', string>>;
  channelTypes: ChannelType[];
  gptModels: GPTModel[];
  loadingOptions: boolean;
  showChannelDropdown: boolean;
  showModelDropdown: boolean;
  channelDropdownRef: React.RefObject<HTMLDivElement | null>;
  modelDropdownRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (field: keyof BotFormData, value: string) => void;
  onToggleChannelDropdown: () => void;
  onToggleModelDropdown: () => void;
}

export const Step2Configuration = memo(function Step2Configuration({
  formData,
  errors,
  channelTypes,
  gptModels,
  loadingOptions,
  showChannelDropdown,
  showModelDropdown,
  channelDropdownRef,
  modelDropdownRef,
  onInputChange,
  onToggleChannelDropdown,
  onToggleModelDropdown,
}: Step2ConfigurationProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-card-foreground">Configure Your Bot</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the basic details for your new AI bot
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="assistantName">
            Bot Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="assistantName"
            placeholder="My Bot"
            onChange={(e) => onInputChange('assistantName', e.target.value)}
            className={cn('text-foreground', errors.assistantName && 'border-destructive')}
            aria-invalid={!!errors.assistantName}
          />
          {errors.assistantName && (
            <p className="text-xs text-destructive">{errors.assistantName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiModel">
            AI Model <span className="text-destructive">*</span>
          </Label>
          <div className="relative" ref={modelDropdownRef}>
            <button
              type="button"
              onClick={onToggleModelDropdown}
              className={cn(
                'flex h-9 w-full items-center justify-between rounded-full border border-input bg-input-background px-3 py-1 text-sm text-foreground transition',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                errors.aiModel && 'border-destructive',
                showModelDropdown && 'ring-2 ring-ring'
              )}
            >
              <span className={cn(formData.aiModel ? 'text-foreground' : 'text-muted-foreground')}>
                {loadingOptions
                  ? 'Loading...'
                  : gptModels.find((m) => m.value === formData.aiModel)?.label ||
                    'Select AI model'}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  showModelDropdown && 'rotate-180'
                )}
              />
            </button>
            {showModelDropdown && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                {loadingOptions ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
                ) : (
                  gptModels.map((model) => (
                    <button
                      key={model.value}
                      type="button"
                      onClick={() => {
                        onInputChange('aiModel', model.value);
                        onToggleModelDropdown();
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm text-card-foreground transition hover:bg-secondary',
                        formData.aiModel === model.value &&
                          'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {model.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            ({gptModels.length} {gptModels.length === 1 ? 'model' : 'models'} available)
          </p>
          {errors.aiModel && <p className="text-xs text-destructive">{errors.aiModel}</p>}
        </div>
      </div>
    </div>
  );
});

