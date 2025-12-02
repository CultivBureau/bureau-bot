'use client';

import { Link as LinkIcon, Settings } from 'lucide-react';
import { Button } from '../landing/ui/button';
import { IntegrationStatus } from './IntegrationStatus';

interface Integration {
  id: string;
  name: string;
  description?: string;
  status: 'connected' | 'disconnected' | 'error';
  icon?: React.ReactNode;
}

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onConfigure: (id: string) => void;
}

export function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onConfigure,
}: IntegrationCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="rounded-full bg-primary/15 p-3">
            {integration.icon || <LinkIcon className="h-6 w-6 text-primary" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-card-foreground">
                {integration.name}
              </h3>
              <IntegrationStatus status={integration.status} />
            </div>
            {integration.description && (
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onConfigure(integration.id)}
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
          {integration.status === 'connected' ? (
            <Button
              onClick={() => onDisconnect(integration.id)}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={() => onConnect(integration.id)}
              size="sm"
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

