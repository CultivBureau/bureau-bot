'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmationToastProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  isLoading?: boolean;
}

export function ConfirmationToast({
  message,
  onConfirm,
  onCancel,
  isOpen,
  isLoading = false,
}: ConfirmationToastProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when toast is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
        onClick={isLoading ? undefined : onCancel}
      />

      {/* Toast */}
      <div className="fixed top-4 right-4 z-[101] animate-in slide-in-from-top-5 fade-in duration-300">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/90 dark:border-amber-800 shadow-2xl max-w-md backdrop-blur-sm">
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {message}
                </p>
              </div>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-full p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-full border border-amber-300 dark:border-amber-700 bg-white dark:bg-amber-950 px-4 py-2 text-sm font-medium text-amber-900 dark:text-amber-100 hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                }}
                disabled={isLoading}
                className="rounded-full bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
