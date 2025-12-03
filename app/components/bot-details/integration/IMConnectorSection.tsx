'use client';

import { ArrowRightLeft } from 'lucide-react';

interface IMConnectorSectionProps {
  connectorCode: string;
  lineId: string;
  clientId: string;
  clientSecret: string;
  onConnectorCodeChange: (value: string) => void;
  onLineIdChange: (value: string) => void;
  onClientIdChange: (value: string) => void;
  onClientSecretChange: (value: string) => void;
  onRegister: () => Promise<void>;
  onSaveCredentials: () => Promise<void>;
  registering: boolean;
}

export function IMConnectorSection({
  connectorCode,
  lineId,
  clientId,
  clientSecret,
  onConnectorCodeChange,
  onLineIdChange,
  onClientIdChange,
  onClientSecretChange,
  onRegister,
  onSaveCredentials,
  registering,
}: IMConnectorSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="rounded-2xl bg-purple-500/15 p-3 text-purple-600">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground">
            Bitrix24 IM connector
          </h3>
          <p className="text-sm text-muted-foreground">
            Register connector details so chats can be routed between Bitrix24 and this bot.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Connector code
          </label>
          <input
            value={connectorCode}
            onChange={(e) => onConnectorCodeChange(e.target.value)}
            placeholder="your_connector_code"
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Open line ID
          </label>
          <input
            value={lineId}
            onChange={(e) => onLineIdChange(e.target.value)}
            placeholder="1"
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onRegister}
            disabled={registering}
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {registering ? 'Registering…' : 'Register connector'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h4 className="text-sm font-semibold text-card-foreground">
          Local application credentials
        </h4>
        <p className="text-sm text-muted-foreground">
          Needed for OAuth / imbot.register flows.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => onClientIdChange(e.target.value)}
              placeholder="local.xxxxxx"
              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Client secret</label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => onClientSecretChange(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          onClick={onSaveCredentials}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Save credentials
        </button>
      </div>
    </section>
  );
}

