import type { BotFormData } from '../../components/dashboard/NewBotModal';

export interface ValidationErrors {
  provider?: string;
  providerApiKey?: string;
  name?: string;
  llmModel?: string;
  providerResourceId?: string;
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
    if (!formData.provider) {
      errors.provider = 'Provider is required';
    }

    // In edit mode, provider key is optional unless the user supplies a new one.
    if (!isEditMode && !formData.providerApiKey.trim()) {
      errors.providerApiKey = 'Provider API key is required';
    } else if (formData.providerApiKey.trim().length < 1 && !isEditMode) {
      errors.providerApiKey = 'Provider API key is required';
    }
  } else if (step === 2) {
    if (!formData.name.trim()) {
      errors.name = 'Bot name is required';
    }
    if (!formData.llmModel.trim()) {
      errors.llmModel = 'Model is required';
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
  return apiKey.trim().length > 0;
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
    if (!formData.provider) {
      errors.provider = 'Provider is required to create a bot';
    }

    if (!formData.providerApiKey.trim()) {
      errors.providerApiKey = 'Provider API key is required to create a bot';
    }
  }

  if (!formData.name.trim()) {
    errors.name = 'Bot name is required';
  }

  if (!formData.llmModel.trim()) {
    errors.llmModel = 'Model is required';
  }

  if (!formData.instructions.trim()) {
    errors.instructions = 'Instructions are required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

