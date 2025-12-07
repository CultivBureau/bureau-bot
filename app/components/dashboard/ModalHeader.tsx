'use client';

import { X, Bot } from 'lucide-react';
import { memo } from 'react';

interface ModalHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
}

export const ModalHeader = memo(function ModalHeader({ isEditMode, onClose }: ModalHeaderProps) {
  return (
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
  );
});

