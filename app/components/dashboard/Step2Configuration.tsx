'use client';

import { memo } from 'react';
import { Input } from '../landing/ui/input';
import { Label } from '../landing/ui/label';
import { cn } from '../landing/ui/utils';
import type { BotFormData } from './NewBotModal';
import type { GPTModel } from '../../types/bot';
import { getModelOptionsForProvider } from '../../constants/llm';

interface Step2ConfigurationProps {
  formData: BotFormData;
  errors: Partial<Record<keyof BotFormData | '_general', string>>;
  providerModels: GPTModel[];
  loadingOptions: boolean;
  onInputChange: (field: keyof BotFormData, value: string) => void;
}

export const Step2Configuration = memo(function Step2Configuration({
  formData,
  errors,
  providerModels,
  loadingOptions,
  onInputChange,
}: Step2ConfigurationProps) {
  const modelOptions = getModelOptionsForProvider(formData.provider, providerModels);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-card-foreground">Configure Your Bot</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Set the bot name, provider model, and any provider resource details.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Bot Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            placeholder="My Bot"
            onChange={(e) => onInputChange('name', e.target.value)}
            className={cn('text-foreground', errors.name && 'border-destructive')}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="llmModel">
            Model <span className="text-destructive">*</span>
          </Label>
          <select
            id="llmModel"
            value={formData.llmModel}
            onChange={(e) => onInputChange('llmModel', e.target.value)}
            className={cn(
              'flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              errors.llmModel && 'border-destructive'
            )}
            aria-invalid={!!errors.llmModel}
            disabled={loadingOptions && formData.provider === 'openai'}
          >
            {modelOptions.length > 0 ? (
              modelOptions.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))
            ) : (
              <option value={formData.llmModel}>
                {loadingOptions ? 'Loading models...' : formData.llmModel || 'Select a model'}
              </option>
            )}
          </select>
            <p className="text-xs text-muted-foreground">
              {formData.provider === 'mistral'
                ? 'Mistral models are provided locally for now.'
                : 'OpenAI models are loaded from the backend model list.'}
            </p>
          {errors.llmModel && <p className="text-xs text-destructive">{errors.llmModel}</p>}
        </div>

        {formData.provider === 'openai' ? (
          <div className="space-y-2">
            <Label htmlFor="providerResourceId">Provider Resource ID</Label>
            <Input
              id="providerResourceId"
              value={formData.providerResourceId}
              placeholder="assistant_..."
              onChange={(e) => onInputChange('providerResourceId', e.target.value)}
              className="text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Keep this for OpenAI resource-backed configurations.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            Mistral runs as a direct chat provider, so assistant-style resource provisioning is
            not shown here.
          </div>
        )}
      </div>
    </div>
  );
});
