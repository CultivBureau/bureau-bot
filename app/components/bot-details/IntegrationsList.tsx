'use client';

import { IntegrationCard } from './IntegrationCard';

interface Integration {
  id: string;
  name: string;
  description?: string;
  status: 'connected' | 'disconnected' | 'error';
  icon?: React.ReactNode;
}

interface IntegrationsListProps {
  integrations: Integration[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onConfigure: (id: string) => void;
}

export function IntegrationsList({
  integrations,
  onConnect,
  onDisconnect,
  onConfigure,
}: IntegrationsListProps) {
  if (integrations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
        <p className="text-muted-foreground">No integrations available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onConfigure={onConfigure}
        />
      ))}
    </div>
  );
}

