'use client';

import { memo } from 'react';
import { cn } from '../landing/ui/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = memo(function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <>
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
    </>
  );
});

