import { useState, useEffect, useCallback } from 'react';
import { botService } from '../../../services/bot';
import { validateStep, validateFormForSubmit } from '../../../utils/bots/validators';
import { formatUserFriendlyError } from '../../../utils/bots/errorHandlers';
import type { Bot, UpdateBotRequest, GPTModel } from '../../../types/bot';
import type { BotFormData } from '../NewBotModal';
import { DEFAULT_PROVIDER, getDefaultModelForProvider, normalizeProvider } from '../../../constants/llm';

interface UseBotModalOptions {
  isOpen: boolean;
  bot?: Bot;
  onClose: () => void;
  onSubmit?: () => void;
}

export function useBotModal({ isOpen, bot, onClose, onSubmit }: UseBotModalOptions) {
  const isEditMode = !!bot;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BotFormData>({
    provider: DEFAULT_PROVIDER,
    providerApiKey: '',
    name: 'AI Assistant',
    llmModel: '',
    providerResourceId: '',
    instructions: 'You are a helpful support bot. Please provide accurate and helpful responses to user queries.',
    webhookUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BotFormData | '_general', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [openAiModels, setOpenAiModels] = useState<GPTModel[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Initialize form data when bot prop changes (for edit mode)
  useEffect(() => {
    if (isOpen && bot) {
      const provider = normalizeProvider(bot.llm_provider);
      const model = bot.llm_model || bot.gpt_model || getDefaultModelForProvider(provider);

      setFormData({
        provider,
        providerApiKey: '',
        name: bot.name || 'AI Assistant',
        llmModel: model,
        providerResourceId: bot.provider_resource_id || bot.assistant_id || '',
        instructions: bot.instructions || 'You are a helpful support bot. Please provide accurate and helpful responses to user queries.',
        webhookUrl: bot.webhook_url || '',
      });
    }
  }, [isOpen, bot]);

  // Fetch OpenAI models when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
          const models = await botService.getGPTModels();
          setOpenAiModels(models);
          
          if (!bot) {
            setFormData((prev) => {
              const updated = { ...prev };
              if (updated.provider === 'openai' && models.length > 0 && !updated.llmModel) {
                updated.llmModel = models[0].value;
              }
              if (updated.provider === 'mistral' && !updated.llmModel) {
                updated.llmModel = getDefaultModelForProvider('mistral');
              }
              return updated;
            });
          }
        } catch (error) {
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
        provider: DEFAULT_PROVIDER,
        providerApiKey: '',
        name: 'AI Assistant',
        llmModel: '',
        providerResourceId: '',
        instructions: 'You are a helpful support bot. Please provide accurate and helpful responses to user queries.',
        webhookUrl: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateCurrentStep = useCallback((): boolean => {
    const validationErrors = validateStep(currentStep, formData, isEditMode);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [currentStep, formData, isEditMode]);

  const handleNext = useCallback(async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === 1 && (!isEditMode || formData.providerApiKey.trim())) {
      setIsValidating(true);
      try {
        const validation = await botService.validateProviderKey(formData.provider, formData.providerApiKey.trim());
        if (!validation.valid) {
          setErrors((prev) => ({
            ...prev,
            providerApiKey: 'Invalid provider API key. Please check and try again.',
          }));
          setIsValidating(false);
          return;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to validate API key';
        setErrors((prev) => ({
          ...prev,
          providerApiKey: errorMessage,
        }));
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, formData, isEditMode, validateCurrentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    const validation = validateFormForSubmit(formData, isEditMode);
    if (!validation.valid) {
      setErrors(validation.errors);
      if (validation.errors.providerApiKey) {
        setCurrentStep(1);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && bot) {
        const updateData: Partial<UpdateBotRequest> = {};
        
        if (formData.provider !== normalizeProvider(bot.llm_provider)) {
          updateData.llm_provider = formData.provider;
        }
        if (formData.name !== bot.name) {
          updateData.name = formData.name;
        }
        if (formData.llmModel && formData.llmModel !== (bot.llm_model || bot.gpt_model)) {
          updateData.llm_model = formData.llmModel;
          updateData.gpt_model = formData.llmModel;
        }
        if (formData.instructions && formData.instructions !== bot.instructions) {
          updateData.instructions = formData.instructions;
        }
        const currentWebhookUrl = bot.webhook_url || '';
        if (formData.webhookUrl.trim() !== currentWebhookUrl) {
          updateData.webhook_url = formData.webhookUrl.trim() || null;
        }
        if (formData.providerResourceId.trim() !== (bot.provider_resource_id || bot.assistant_id || '')) {
          updateData.provider_resource_id = formData.providerResourceId.trim() || null;
          updateData.assistant_id = formData.providerResourceId.trim() || null;
        }
        if (formData.providerApiKey.trim()) {
          updateData.encrypted_provider_api_key = formData.providerApiKey.trim();
          updateData.openai_api_key = formData.providerApiKey.trim();
        }

        if (Object.keys(updateData).length > 0) {
          await botService.updateBot(bot.id, updateData);
        }
      } else {
        const botData = {
          name: formData.name.trim(),
          llm_provider: formData.provider,
          llm_model: formData.llmModel,
          encrypted_provider_api_key: formData.providerApiKey.trim(),
          provider_resource_id: formData.providerResourceId.trim() || null,
          gpt_model: formData.llmModel,
          openai_api_key: formData.providerApiKey.trim(),
          assistant_id: formData.providerResourceId.trim() || null,
          instructions: formData.instructions.trim(),
          webhook_url: formData.webhookUrl.trim() || null,
        };

        if (!botData.encrypted_provider_api_key || botData.encrypted_provider_api_key.length < 1) {
          setErrors({
            _general: 'Provider API key is required and must be at least 1 character long.',
          });
          setCurrentStep(1);
          setIsSubmitting(false);
          return;
        }

        await botService.createBot(botData);
      }
      
      if (onSubmit) {
        await onSubmit();
      }
      
      setFormData({
        provider: DEFAULT_PROVIDER,
        providerApiKey: '',
        name: 'AI Assistant',
        llmModel: '',
        providerResourceId: '',
        instructions: 'You are a helpful support bot. Please provide accurate and helpful responses to user queries.',
        webhookUrl: '',
      });
      setCurrentStep(1);
      setErrors({});
      onClose();
    } catch (error) {
      let errorMessage = isEditMode ? 'Failed to update bot' : 'Failed to create bot';
      
      if (error instanceof Error) {
        errorMessage = formatUserFriendlyError(error);
      }
      
      setErrors((prev) => ({
        ...prev,
        _general: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEditMode, bot, onSubmit, onClose]);

  const handleInputChange = useCallback((field: keyof BotFormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as BotFormData;

      if (field === 'provider') {
        const provider = value === 'mistral' ? 'mistral' : 'openai';
        next.llmModel = getDefaultModelForProvider(provider);
        if (provider === 'mistral') {
          next.providerResourceId = '';
        }
      }

      if (field === 'provider' && value === 'openai' && !next.llmModel && openAiModels.length > 0) {
        next.llmModel = openAiModels[0].value;
      }

      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors, openAiModels]);

  const providerModels = formData.provider === 'mistral'
    ? [
        { value: 'mistral-large-latest', label: 'Mistral Large Latest' },
        { value: 'mistral-small-latest', label: 'Mistral Small Latest' },
        { value: 'open-mistral-7b', label: 'Open Mistral 7B' },
        { value: 'open-mixtral-8x7b', label: 'Open Mixtral 8x7B' },
      ]
    : openAiModels;

  return {
    isEditMode,
    currentStep,
    formData,
    errors,
    isSubmitting,
    isValidating,
    providerModels,
    loadingOptions,
    handleNext,
    handleBack,
    handleSubmit,
    handleInputChange,
  };
}

