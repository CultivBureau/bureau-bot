'use client';

import { memo } from 'react';

interface ProfileAlertsProps {
  success: string | null;
  error: string | null;
}

export const ProfileAlerts = memo(function ProfileAlerts({ success, error }: ProfileAlertsProps) {
  return (
    <>
      {success && (
        <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}
    </>
  );
});

