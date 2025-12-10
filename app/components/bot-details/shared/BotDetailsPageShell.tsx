'use client';

import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { BotDetailsSidebar } from './BotDetailsSidebar';
import { UnifiedLoadingScreen } from '../../shared/UnifiedLoadingScreen';

interface BotDetailsPageShellProps {
  botId: string | null;
  title: string;
  description?: string;
  actions?: ReactNode;
  loading?: boolean;
  error?: string | null;
  children: ReactNode;
}

export function BotDetailsPageShell({
  botId,
  title,
  description,
  actions,
  loading = false,
  error = null,
  children,
}: BotDetailsPageShellProps) {
  if (!botId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-card-foreground mb-2">
            No bot selected
          </h2>
          <p className="text-sm text-muted-foreground">
            Please select a bot from the bots list to view its details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <UnifiedLoadingScreen message="Loading bot details..." />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <BotDetailsSidebar botId={botId} />

      <div className="flex-1 min-w-0">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-hero-text">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-hero-subtext">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

