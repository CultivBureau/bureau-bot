'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Bot, ChevronDown } from 'lucide-react';
import { Button } from '../landing/ui/button';
import { Input } from '../landing/ui/input';
import { Textarea } from '../landing/ui/textarea';
import { Label } from '../landing/ui/label';
import { cn } from '../landing/ui/utils';
import { botService } from '../../services/bot';
import type { GPTModel, ChannelType, Bot } from '../../types/bot';

interface NewBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BotFormData) => void;
  bot?: Bot; // If provided, modal is in edit mode
}

export interface BotFormData {
  apiKey: string;
  assistantName: string;
  channelType: string;
  aiModel: string;
  instructions: string;
  webhookUrl: string;
}


export function NewBotModal({ isOpen, onClose, onSubmit, bot }: NewBotModalProps) {
  const isEditMode = !!bot;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BotFormData>({
    apiKey: '',
    assistantName: 'AI Assistant',
    channelType: '',
    aiModel: '',
    instructions: 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
    webhookUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BotFormData | '_general', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [channelTypes, setChannelTypes] = useState<ChannelType[]>([]);
  const [gptModels, setGptModels] = useState<GPTModel[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize form data when bot prop changes (for edit mode)
  useEffect(() => {
    if (isOpen && bot) {
      setFormData({
        apiKey: '', // Don't show existing API key for security
        assistantName: bot.assistant_name || bot.name || 'AI Assistant',
        channelType: bot.channel_type || '',
        aiModel: bot.gpt_model || '',
        instructions: bot.instructions || 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
        webhookUrl: '', // Not in bot data
      });
    }
  }, [isOpen, bot]);

  // Fetch channel types and GPT models when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
          const [channels, models] = await Promise.all([
            botService.getChannelTypes(),
            botService.getGPTModels(),
          ]);
          setChannelTypes(channels);
          setGptModels(models);
          
          // Set default values if available (create mode only)
          if (!bot) {
            setFormData((prev) => {
              const updated = { ...prev };
              if (channels.length > 0 && !updated.channelType) {
                updated.channelType = channels[0].value;
              }
              if (models.length > 0 && !updated.aiModel) {
                updated.aiModel = models[0].value;
              }
              return updated;
            });
          }
        } catch (error) {
          console.error('Error fetching options:', error);
          setErrors((prev) => ({
            ...prev,
            _general: 'Failed to load options. Please try again.',
          }));
        } finally {
          setLoadingOptions(false);
        }
      };
      
      fetchOptions();
    }
  }, [isOpen, bot]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        apiKey: '',
        assistantName: 'AI Assistant',
        channelType: '',
        aiModel: '',
        instructions: 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
        webhookUrl: '',
      });
      setErrors({});
      setShowChannelDropdown(false);
      setShowModelDropdown(false);
    }
  }, [isOpen, bot]);

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
      // In edit mode, API key is optional (only validate if provided)
      if (!isEditMode) {
        if (!formData.apiKey.trim()) {
          newErrors.apiKey = 'API key is required';
        } else if (!formData.apiKey.startsWith('sk-')) {
          newErrors.apiKey = 'API key must start with "sk-"';
        }
      } else if (formData.apiKey.trim() && !formData.apiKey.startsWith('sk-')) {
        // In edit mode, if API key is provided, it must be valid
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

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    // Validate API key when moving from step 1 to step 2 (only in create mode or if key is provided in edit mode)
    if (currentStep === 1 && (!isEditMode || formData.apiKey.trim())) {
      setIsValidating(true);
      try {
        const validation = await botService.validateOpenAIKey(formData.apiKey);
        if (!validation.valid) {
          setErrors((prev) => ({
            ...prev,
            apiKey: 'Invalid API key. Please check and try again.',
          }));
          setIsValidating(false);
          return;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to validate API key';
        setErrors((prev) => ({
          ...prev,
          apiKey: errorMessage,
        }));
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
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
      if (isEditMode && bot) {
        // Update bot using the API - only send fields that have changed
        const updateData: Record<string, string> = {};
        
        // Check if name or assistant_name changed
        const currentName = bot.assistant_name || bot.name;
        if (formData.assistantName !== currentName) {
          updateData.name = formData.assistantName;
          updateData.assistant_name = formData.assistantName;
        }
        
        // Check if channel type changed
        if (formData.channelType && formData.channelType !== bot.channel_type) {
          updateData.channel_type = formData.channelType;
        }
        
        // Check if AI model changed
        if (formData.aiModel && formData.aiModel !== bot.gpt_model) {
          updateData.gpt_model = formData.aiModel;
        }
        
        // Check if instructions changed
        if (formData.instructions && formData.instructions !== bot.instructions) {
          updateData.instructions = formData.instructions;
        }
        
        // Only include API key if a new one was provided
        if (formData.apiKey.trim()) {
          updateData.openai_api_key = formData.apiKey;
        }

        // Only make API call if there are changes
        if (Object.keys(updateData).length > 0) {
          await botService.updateBot(bot.id, updateData);
        }
      } else {
        // Create bot using the API
        const botData = {
          name: formData.assistantName,
          channel_type: formData.channelType,
          gpt_model: formData.aiModel,
          openai_api_key: formData.apiKey,
          instructions: formData.instructions,
          assistant_name: formData.assistantName,
        };

        await botService.createBot(botData);
      }
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit();
      }
      
      // Reset form and close modal
      setFormData({
        apiKey: '',
        assistantName: 'AI Assistant',
        channelType: '',
        aiModel: '',
        instructions: 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
        webhookUrl: '',
      });
      setCurrentStep(1);
      setErrors({});
      onClose();
    } catch (error) {
      let errorMessage = isEditMode ? 'Failed to update bot' : 'Failed to create bot';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more user-friendly messages for common errors
        if (error.message.includes('Unable to connect')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.message.includes('Authentication')) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.message.includes('status 400') || error.message.includes('status 422')) {
          errorMessage = 'Invalid data provided. Please check all fields and try again.';
        } else if (error.message.includes('status 401') || error.message.includes('status 403')) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.message.includes('status 500')) {
          errorMessage = 'Server error occurred. Please try again later.';
        }
      }
      
      setErrors((prev) => ({
        ...prev,
        _general: errorMessage,
      }));
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} bot:`, error);
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
            <h2 className="text-xl font-semibold text-card-foreground">
              {isEditMode ? 'Edit Bot' : 'Create New Bot'}
            </h2>
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
          {/* General Error Display */}
          {errors._general && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors._general}
            </div>
          )}
          
          {/* Step 1: API Key */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-card-foreground">
                  {isEditMode ? 'Update OpenAI API Key (Optional)' : 'Enter Your OpenAI API Key'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isEditMode 
                    ? 'Leave blank to keep the existing API key, or enter a new one to update it'
                    : 'We\'ll use this to create and manage your AI assistant'}
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="apiKey">
                  OpenAI API Key {!isEditMode && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder={isEditMode ? "Leave blank to keep existing key" : "sk-..."}
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  className={cn('text-foreground', errors.apiKey && 'border-destructive')}
                  aria-invalid={!!errors.apiKey}
                />
                {errors.apiKey && (
                  <p className="text-xs text-destructive">{errors.apiKey}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {isEditMode 
                    ? 'Only enter a new key if you want to update it'
                    : 'Your API key is encrypted and stored securely'}
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
                        {loadingOptions 
                          ? 'Loading...' 
                          : channelTypes.find((c) => c.value === formData.channelType)?.label ||
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
                      <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg max-h-60 overflow-y-auto">
                        {loadingOptions ? (
                          <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
                        ) : (
                          channelTypes.map((channel) => (
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
                          ))
                        )}
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
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ({gptModels.length} {gptModels.length === 1 ? 'model' : 'models'} available)
                  </p>
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
            disabled={isSubmitting || isValidating}
            className="dark:bg-card dark:border-border dark:hover:bg-card/80 dark:text-card-foreground"
          >
            {isSubmitting
              ? (isEditMode ? 'Updating...' : 'Creating...')
              : isValidating
                ? 'Validating...'
                : currentStep === 3
                  ? (isEditMode ? 'Update Bot' : 'Create Bot')
                  : (isEditMode && !formData.apiKey.trim())
                    ? 'Continue'
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

