'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Bot, ChevronDown } from 'lucide-react';
import { Button } from '../landing/ui/button';
import { Input } from '../landing/ui/input';
import { Textarea } from '../landing/ui/textarea';
import { Label } from '../landing/ui/label';
import { cn } from '../landing/ui/utils';

interface NewBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BotFormData) => void;
}

export interface BotFormData {
  apiKey: string;
  assistantName: string;
  channelType: string;
  aiModel: string;
  instructions: string;
  webhookUrl: string;
}

const CHANNEL_TYPES = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'web', label: 'Web' },
  { value: 'messenger', label: 'Messenger' },
];

const AI_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o - Backend model: GPT-4o' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo - Backend model: GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4 - Backend model: GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo - Backend model: GPT-3.5 Turbo' },
];

export function NewBotModal({ isOpen, onClose, onSubmit }: NewBotModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BotFormData>({
    apiKey: '',
    assistantName: 'AI Assistant',
    channelType: 'whatsapp',
    aiModel: 'gpt-4o',
    instructions: 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
    webhookUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BotFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        apiKey: '',
        assistantName: 'AI Assistant',
        channelType: 'whatsapp',
        aiModel: 'gpt-4o',
        instructions: 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
        webhookUrl: '',
      });
      setErrors({});
      setShowChannelDropdown(false);
      setShowModelDropdown(false);
    }
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowChannelDropdown(false);
      }
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false);
      }
    };

    if (showChannelDropdown || showModelDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChannelDropdown, showModelDropdown]);

  if (!isOpen) return null;

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof BotFormData, string>> = {};

    if (step === 1) {
      if (!formData.apiKey.trim()) {
        newErrors.apiKey = 'API key is required';
      } else if (!formData.apiKey.startsWith('sk-')) {
        newErrors.apiKey = 'API key must start with "sk-"';
      }
    } else if (step === 2) {
      if (!formData.assistantName.trim()) {
        newErrors.assistantName = 'Assistant name is required';
      }
      if (!formData.channelType) {
        newErrors.channelType = 'Channel type is required';
      }
      if (!formData.aiModel) {
        newErrors.aiModel = 'AI model is required';
      }
    } else if (step === 3) {
      if (!formData.instructions.trim()) {
        newErrors.instructions = 'Instructions are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      // Reset form and close modal
      setFormData({
        apiKey: '',
        assistantName: 'AI Assistant',
        channelType: 'whatsapp',
        aiModel: 'gpt-4o',
        instructions: 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
        webhookUrl: '',
      });
      setCurrentStep(1);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating bot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BotFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const totalSteps = 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground">Create New Bot</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 border-b border-border px-6 py-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition',
                    step < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step === currentStep
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 dark:ring-offset-card'
                        : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < totalSteps && (
                  <div
                    className={cn(
                      'h-0.5 w-12 transition',
                      step < currentStep ? 'bg-primary' : 'bg-secondary'
                    )}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex items-center justify-center gap-12 px-6 pb-4">
          <span
            className={cn(
              'text-xs font-medium transition',
              currentStep === 1 ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            API Key
          </span>
          <span
            className={cn(
              'text-xs font-medium transition',
              currentStep === 2 ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Configuration
          </span>
          <span
            className={cn(
              'text-xs font-medium transition',
              currentStep === 3 ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Instructions
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Step 1: API Key */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Enter Your OpenAI API Key
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll use this to create and manage your AI assistant
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="apiKey">
                  OpenAI API Key <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  className={cn('text-foreground', errors.apiKey && 'border-destructive')}
                  aria-invalid={!!errors.apiKey}
                />
                {errors.apiKey && (
                  <p className="text-xs text-destructive">{errors.apiKey}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your API key is encrypted and stored securely
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Basic Configuration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Configure Your Bot
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill in the basic details for your new AI bot
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assistantName">
                    Assistant Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="assistantName"
                    placeholder="AI Assistant"
                    value={formData.assistantName}
                    onChange={(e) => handleInputChange('assistantName', e.target.value)}
                    className={cn('text-foreground', errors.assistantName && 'border-destructive')}
                    aria-invalid={!!errors.assistantName}
                  />
                  {errors.assistantName && (
                    <p className="text-xs text-destructive">{errors.assistantName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channelType">
                    Channel Type <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative" ref={channelDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowChannelDropdown(!showChannelDropdown);
                        setShowModelDropdown(false);
                      }}
                      className={cn(
                        'flex h-9 w-full items-center justify-between rounded-full border border-input bg-input-background px-3 py-1 text-sm text-foreground transition',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        errors.channelType && 'border-destructive',
                        showChannelDropdown && 'ring-2 ring-ring'
                      )}
                    >
                      <span className={cn(
                        formData.channelType 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      )}>
                        {CHANNEL_TYPES.find((c) => c.value === formData.channelType)?.label ||
                          'Select channel type'}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-muted-foreground transition-transform',
                          showChannelDropdown && 'rotate-180'
                        )}
                      />
                    </button>
                    {showChannelDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
                        {CHANNEL_TYPES.map((channel) => (
                          <button
                            key={channel.value}
                            type="button"
                            onClick={() => {
                              handleInputChange('channelType', channel.value);
                              setShowChannelDropdown(false);
                            }}
                            className={cn(
                              'w-full px-4 py-2 text-left text-sm text-card-foreground transition hover:bg-secondary',
                              formData.channelType === channel.value && 'bg-secondary text-secondary-foreground'
                            )}
                          >
                            {channel.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.channelType && (
                    <p className="text-xs text-destructive">{errors.channelType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiModel">
                    AI Model <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative" ref={modelDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModelDropdown(!showModelDropdown);
                        setShowChannelDropdown(false);
                      }}
                      className={cn(
                        'flex h-9 w-full items-center justify-between rounded-full border border-input bg-input-background px-3 py-1 text-sm text-foreground transition',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        errors.aiModel && 'border-destructive',
                        showModelDropdown && 'ring-2 ring-ring'
                      )}
                    >
                      <span className={cn(
                        formData.aiModel 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      )}>
                        {AI_MODELS.find((m) => m.value === formData.aiModel)?.label ||
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
                        {AI_MODELS.map((model) => (
                          <button
                            key={model.value}
                            type="button"
                            onClick={() => {
                              handleInputChange('aiModel', model.value);
                              setShowModelDropdown(false);
                            }}
                            className={cn(
                              'w-full px-4 py-2 text-left text-sm text-card-foreground transition hover:bg-secondary',
                              formData.aiModel === model.value && 'bg-secondary text-secondary-foreground'
                            )}
                          >
                            {model.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">(71 models available)</p>
                  {errors.aiModel && (
                    <p className="text-xs text-destructive">{errors.aiModel}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Advanced Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Set Instructions & Webhook
                </h3>
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
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
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
                    onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                    className="text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Webhook URL for receiving bot events and updates
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
            disabled={isSubmitting}
            className="dark:bg-card dark:border-border dark:hover:bg-card/80 dark:text-card-foreground"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            type="button"
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="dark:bg-card dark:border-border dark:hover:bg-card/80 dark:text-card-foreground"
          >
            {isSubmitting
              ? 'Creating...'
              : currentStep === 3
                ? 'Create Bot'  
                : 'Validate & Continue'}
          </Button>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
}

