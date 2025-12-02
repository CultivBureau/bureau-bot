'use client';

import { X } from 'lucide-react';
import { FunctionForm } from './FunctionForm';

interface FunctionFormData {
  name: string;
  description: string;
  code?: string;
}

interface FunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FunctionFormData) => void;
  initialData?: FunctionFormData;
  saving?: boolean;
}

export function FunctionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  saving = false,
}: FunctionModalProps) {
  if (!isOpen) return null;

  const handleSave = (data: FunctionFormData) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-card-foreground">
            {initialData ? 'Edit Function' : 'Add Function'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FunctionForm
            initialData={initialData}
            onSave={handleSave}
            onCancel={onClose}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}

