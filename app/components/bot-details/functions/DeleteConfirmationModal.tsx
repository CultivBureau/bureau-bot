'use client';

import { X } from 'lucide-react';
import type { FunctionData } from '../../../types/functions';

interface DeleteConfirmationModalProps {
  functionToDelete: FunctionData | null;
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
}

export function DeleteConfirmationModal({
  functionToDelete,
  onConfirm,
  onCancel,
  deleting = false,
}: DeleteConfirmationModalProps) {
  if (!functionToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl border border-border bg-card p-6 shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Delete Function
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-muted-foreground hover:bg-secondary"
            disabled={deleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete the function &quot;{functionToDelete.name}&quot;? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

