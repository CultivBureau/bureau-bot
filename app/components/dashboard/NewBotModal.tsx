'use client';

import { useBotModal } from './hooks/useBotModal';
import { ModalHeader } from './ModalHeader';
import { ProgressIndicator } from './ProgressIndicator';
import { Step1ApiKey } from './Step1ApiKey';
import { Step2Configuration } from './Step2Configuration';
import { Step3Instructions } from './Step3Instructions';
import { ModalFooter } from './ModalFooter';
import type { Bot } from '../../types/bot';

export interface BotFormData {
  apiKey: string;
  assistantName: string;
  channelType: string;
  aiModel: string;
  instructions: string;
  webhookUrl: string;
}

interface NewBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  bot?: Bot;
}

export function NewBotModal({ isOpen, onClose, onSubmit, bot }: NewBotModalProps) {
  const {
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
  } = useBotModal({ isOpen, bot, onClose, onSubmit });

  if (!isOpen) return null;

  const totalSteps = 3;

  const handleToggleChannelDropdown = () => {
    setShowChannelDropdown(!showChannelDropdown);
    setShowModelDropdown(false);
  };

  const handleToggleModelDropdown = () => {
    setShowModelDropdown(!showModelDropdown);
    setShowChannelDropdown(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <ModalHeader isEditMode={isEditMode} onClose={onClose} />

        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {errors._general && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors._general}
            </div>
          )}

          {currentStep === 1 && (
            <Step1ApiKey
              isEditMode={isEditMode}
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          )}

          {currentStep === 2 && (
            <Step2Configuration
              formData={formData}
              errors={errors}
              channelTypes={channelTypes}
              gptModels={gptModels}
              loadingOptions={loadingOptions}
              showChannelDropdown={showChannelDropdown}
              showModelDropdown={showModelDropdown}
              channelDropdownRef={channelDropdownRef}
              modelDropdownRef={modelDropdownRef}
              onInputChange={handleInputChange}
              onToggleChannelDropdown={handleToggleChannelDropdown}
              onToggleModelDropdown={handleToggleModelDropdown}
            />
          )}

          {currentStep === 3 && (
            <Step3Instructions
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          )}
        </div>

        <ModalFooter
          currentStep={currentStep}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          isValidating={isValidating}
          formData={formData}
          onClose={onClose}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>

      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
}
