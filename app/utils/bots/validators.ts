import type { BotFormData } from '../../components/dashboard/NewBotModal';

export interface ValidationErrors {
  apiKey?: string;
  assistantName?: string;
  channelType?: string;
  aiModel?: string;
  instructions?: string;
  _general?: string;
}

/**
 * Validate a specific step of the bot form
 */
export function validateStep(
  step: number,
  formData: BotFormData,
  isEditMode: boolean
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 1) {
    // In edit mode, API key is optional (only validate if provided)
    if (!isEditMode) {
      if (!formData.apiKey.trim()) {
        errors.apiKey = 'API key is required';
      } else if (!formData.apiKey.startsWith('sk-')) {
        errors.apiKey = 'API key must start with "sk-"';
      }
    } else if (formData.apiKey.trim() && !formData.apiKey.startsWith('sk-')) {
      // In edit mode, if API key is provided, it must be valid
      errors.apiKey = 'API key must start with "sk-"';
    }
  } else if (step === 2) {
    if (!formData.assistantName.trim()) {
      errors.assistantName = 'Bot name is required';
    }
    if (!formData.channelType) {
      errors.channelType = 'Channel type is required';
    }
    if (!formData.aiModel) {
      errors.aiModel = 'AI model is required';
    }
  } else if (step === 3) {
    if (!formData.instructions.trim()) {
      errors.instructions = 'Instructions are required';
    }
  }

  return errors;
}

/**
 * Validate API key format
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  return apiKey.trim().startsWith('sk-');
}

/**
 * Validate complete form before submission
 */
export function validateFormForSubmit(
  formData: BotFormData,
  isEditMode: boolean
): { valid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  if (!isEditMode) {
    if (!formData.apiKey.trim()) {
      errors.apiKey = 'API key is required to create a bot';
    } else if (!validateApiKeyFormat(formData.apiKey)) {
      errors.apiKey = 'API key must start with "sk-"';
    }
  }

  if (!formData.assistantName.trim()) {
    errors.assistantName = 'Bot name is required';
  }

  if (!formData.channelType) {
    errors.channelType = 'Channel type is required';
  }

  if (!formData.aiModel) {
    errors.aiModel = 'AI model is required';
  }

  if (!formData.instructions.trim()) {
    errors.instructions = 'Instructions are required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

