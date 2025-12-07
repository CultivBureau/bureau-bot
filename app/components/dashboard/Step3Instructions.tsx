'use client';

import { memo } from 'react';
import { Input } from '../landing/ui/input';
import { Label } from '../landing/ui/label';
import { Textarea } from '../landing/ui/textarea';
import { cn } from '../landing/ui/utils';
import type { BotFormData } from './NewBotModal';

interface Step3InstructionsProps {
  formData: BotFormData;
  errors: Partial<Record<keyof BotFormData | '_general', string>>;
  onInputChange: (field: keyof BotFormData, value: string) => void;
}

export const Step3Instructions = memo(function Step3Instructions({
  formData,
  errors,
  onInputChange,
}: Step3InstructionsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-card-foreground">Set Instructions & Webhook</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure advanced settings for your AI bot
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instructions">
            Instructions <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="instructions"
            placeholder="You are a helpful AI assistant. Please provide accurate and helpful responses to user queries."
            value={formData.instructions}
            onChange={(e) => onInputChange('instructions', e.target.value)}
            rows={6}
            className={cn('text-foreground', errors.instructions && 'border-destructive')}
            aria-invalid={!!errors.instructions}
          />
          {errors.instructions && (
            <p className="text-xs text-destructive">{errors.instructions}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            type="url"
            placeholder="https://your-domain.com/webhook"
            value={formData.webhookUrl}
            onChange={(e) => onInputChange('webhookUrl', e.target.value)}
            className="text-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Optional: Webhook URL for receiving bot events and updates
          </p>
        </div>
      </div>
    </div>
  );
});

