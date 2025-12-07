'use client';

import { useEffect } from 'react';

interface AlertMessagesProps {
  success?: string;
  error?: string;
  onSuccessDismiss?: () => void;
}

export function AlertMessages({ success, error, onSuccessDismiss }: AlertMessagesProps) {
  useEffect(() => {
    if (success && onSuccessDismiss) {
      const timer = setTimeout(() => {
        onSuccessDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, onSuccessDismiss]);

  return (
    <>
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </>
  );
}

