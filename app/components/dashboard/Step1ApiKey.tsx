'use client';

import { memo } from 'react';
import { Input } from '../landing/ui/input';
import { Label } from '../landing/ui/label';
import { cn } from '../landing/ui/utils';
import type { BotFormData } from './NewBotModal';

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
          {isEditMode ? 'Update OpenAI API Key (Optional)' : 'Enter Your OpenAI API Key'}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEditMode
            ? 'Leave blank to keep the existing API key, or enter a new one to update it'
            : "We'll use this to create and manage your AI assistant"}
        </p>
      </div>
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="apiKey">
          OpenAI API Key {!isEditMode && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="apiKey"
          type="password"
          placeholder={isEditMode ? 'Leave blank to keep existing key' : 'sk-...'}
          value={formData.apiKey}
          onChange={(e) => onInputChange('apiKey', e.target.value)}
          className={cn('text-foreground', errors.apiKey && 'border-destructive')}
          aria-invalid={!!errors.apiKey}
        />
        {errors.apiKey && <p className="text-xs text-destructive">{errors.apiKey}</p>}
        <p className="text-xs text-muted-foreground">
          {isEditMode
            ? 'Only enter a new key if you want to update it'
            : 'Your API key is encrypted and stored securely'}
        </p>
      </div>
    </div>
  );
});

