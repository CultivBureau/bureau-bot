import { useState, useEffect, useRef, useCallback } from 'react';
import { botService } from '../../../services/bot';
import { validateStep, validateFormForSubmit } from '../../../utils/bots/validators';
import { formatUserFriendlyError } from '../../../utils/bots/errorHandlers';
import type { Bot } from '../../../types/bot';
import type { BotFormData } from '../NewBotModal';

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
  const [channelTypes, setChannelTypes] = useState<any[]>([]);
  const [gptModels, setGptModels] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize form data when bot prop changes (for edit mode)
  useEffect(() => {
    if (isOpen && bot) {
      setFormData({
        apiKey: '',
        assistantName: bot.name || 'AI Assistant',
        channelType: bot.channel_type || '',
        aiModel: bot.gpt_model || '',
        instructions: bot.instructions || 'You are a helpful AI assistant. Please provide accurate and helpful responses to user queries.',
        webhookUrl: bot.webhook_url || '',
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

  const validateCurrentStep = useCallback((): boolean => {
    const validationErrors = validateStep(currentStep, formData, isEditMode);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [currentStep, formData, isEditMode]);

  const handleNext = useCallback(async () => {
    if (!validateCurrentStep()) return;

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
      if (validation.errors.apiKey) {
        setCurrentStep(1);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && bot) {
        const updateData: Record<string, string | null> = {};
        
        if (formData.assistantName !== bot.name) {
          updateData.name = formData.assistantName;
        }
        if (formData.channelType && formData.channelType !== bot.channel_type) {
          updateData.channel_type = formData.channelType;
        }
        if (formData.aiModel && formData.aiModel !== bot.gpt_model) {
          updateData.gpt_model = formData.aiModel;
        }
        if (formData.instructions && formData.instructions !== bot.instructions) {
          updateData.instructions = formData.instructions;
        }
        const currentWebhookUrl = bot.webhook_url || '';
        if (formData.webhookUrl.trim() !== currentWebhookUrl) {
          updateData.webhook_url = formData.webhookUrl.trim() || null;
        }
        if (formData.apiKey.trim()) {
          updateData.openai_api_key = formData.apiKey.trim();
        }

        if (Object.keys(updateData).length > 0) {
          await botService.updateBot(bot.id, updateData);
        }
      } else {
        const botData = {
          name: formData.assistantName.trim(),
          channel_type: formData.channelType,
          gpt_model: formData.aiModel,
          openai_api_key: formData.apiKey.trim(),
          instructions: formData.instructions.trim(),
          webhook_url: formData.webhookUrl.trim() || null,
        };

        if (!botData.openai_api_key || botData.openai_api_key.length < 1) {
          setErrors({
            _general: 'OpenAI API key is required and must be at least 1 character long.',
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
        errorMessage = formatUserFriendlyError(error);
      }
      
      setErrors((prev) => ({
        ...prev,
        _general: errorMessage,
      }));
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} bot:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEditMode, bot, onSubmit, onClose]);

  const handleInputChange = useCallback((field: keyof BotFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return {
    isEditMode,
    currentStep,
    formData,
    errors,
    isSubmitting,
    isValidating,
    showChannelDropdown,
    setShowChannelDropdown,
    showModelDropdown,
    setShowModelDropdown,
    channelTypes,
    gptModels,
    loadingOptions,
    channelDropdownRef,
    modelDropdownRef,
    handleNext,
    handleBack,
    handleSubmit,
    handleInputChange,
  };
}

