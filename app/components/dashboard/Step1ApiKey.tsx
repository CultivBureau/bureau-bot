'use client';

import { memo } from 'react';
import { Input } from '../landing/ui/input';
import { Label } from '../landing/ui/label';
import { cn } from '../landing/ui/utils';
import type { BotFormData } from './NewBotModal';
import { PROVIDER_OPTIONS } from '../../constants/llm';

interface Step1ApiKeyProps {
  isEditMode: boolean;
  formData: BotFormData;
  errors: Partial<Record<keyof BotFormData | '_general', string>>;
  onInputChange: (field: keyof BotFormData, value: string) => void;
}

export const Step1ApiKey = memo(function Step1ApiKey({
  isEditMode,
  formData,
  errors,
  onInputChange,
}: Step1ApiKeyProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-card-foreground">
          {isEditMode ? 'Update Provider Access (Optional)' : 'Choose a Provider'}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEditMode
            ? 'Leave the key blank to keep the existing value, or enter a new provider key to update it.'
            : 'Select the provider you want this bot to use, then add the matching API key.'}
        </p>
      </div>

      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="provider">
          LLM Provider <span className="text-destructive">*</span>
        </Label>
        <select
          id="provider"
          value={formData.provider}
          onChange={(e) => onInputChange('provider', e.target.value)}
          className={cn(
            'flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            errors.provider && 'border-destructive'
          )}
          aria-invalid={!!errors.provider}
        >
          {PROVIDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.provider && <p className="text-xs text-destructive">{errors.provider}</p>}
      </div>

      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="providerApiKey">
          Provider API Key {!isEditMode && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="providerApiKey"
          type="password"
          placeholder={
            formData.provider === 'mistral'
              ? 'Paste your Mistral API key'
              : isEditMode
                ? 'Leave blank to keep existing key'
                : 'sk-...'
          }
          value={formData.providerApiKey}
          onChange={(e) => onInputChange('providerApiKey', e.target.value)}
          className={cn('text-foreground', errors.providerApiKey && 'border-destructive')}
          aria-invalid={!!errors.providerApiKey}
        />
        {errors.providerApiKey && (
          <p className="text-xs text-destructive">{errors.providerApiKey}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {isEditMode
            ? 'Only enter a new key if you want to update it.'
            : 'We will validate the provider key before continuing.'}
        </p>
      </div>
    </div>
  );
});

