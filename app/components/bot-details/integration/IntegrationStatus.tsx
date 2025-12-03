'use client';

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../landing/ui/utils';

interface IntegrationStatusProps {
  status: 'connected' | 'disconnected' | 'error';
  className?: string;
}

export function IntegrationStatus({
  status,
  className,
}: IntegrationStatusProps) {
  const statusConfig = {
    connected: {
      icon: CheckCircle,
      label: 'Connected',
      className: 'text-green-600 dark:text-green-400',
      bgClassName: 'bg-green-500/15',
    },
    disconnected: {
      icon: XCircle,
      label: 'Disconnected',
      className: 'text-muted-foreground',
      bgClassName: 'bg-secondary',
    },
    error: {
      icon: AlertCircle,
      label: 'Error',
      className: 'text-destructive',
      bgClassName: 'bg-destructive/15',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        config.bgClassName,
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  );
}

