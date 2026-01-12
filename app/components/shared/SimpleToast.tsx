'use client';

import { X, Info } from 'lucide-react';
import { useEffect } from 'react';

interface SimpleToastProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

export function SimpleToast({ message, onClose, isOpen }: SimpleToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/90 shadow-2xl max-w-md backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
