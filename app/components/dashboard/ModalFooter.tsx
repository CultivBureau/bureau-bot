'use client';

import { memo } from 'react';
import { Button } from '../landing/ui/button';
import type { BotFormData } from './NewBotModal';

interface ModalFooterProps {
  currentStep: number;
  isEditMode: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  formData: BotFormData;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const ModalFooter = memo(function ModalFooter({
  currentStep,
  isEditMode,
  isSubmitting,
  isValidating,
  formData,
  onClose,
  onBack,
  onNext,
  onSubmit,
}: ModalFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4">
      <Button
        type="button"
        variant="outline"
        onClick={currentStep === 1 ? onClose : onBack}
        disabled={isSubmitting}
        className="dark:bg-card dark:border-border dark:hover:bg-card/80 dark:text-card-foreground"
      >
        {currentStep === 1 ? 'Cancel' : 'Back'}
      </Button>
      <Button
        type="button"
        onClick={currentStep === 3 ? onSubmit : onNext}
        disabled={isSubmitting || isValidating}
        className="dark:bg-card dark:border-border dark:hover:bg-card/80 dark:text-card-foreground"
      >
        {isSubmitting
          ? isEditMode
            ? 'Updating...'
            : 'Creating...'
          : isValidating
            ? 'Validating...'
            : currentStep === 3
              ? isEditMode
                ? 'Update Bot'
                : 'Create Bot'
              : isEditMode && !formData.apiKey.trim()
                ? 'Continue'
                : 'Validate & Continue'}
      </Button>
    </div>
  );
});

