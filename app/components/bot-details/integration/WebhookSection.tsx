'use client';

import { useState } from 'react';
import { RefreshCw, Check, X, Link as LinkIcon } from 'lucide-react';

interface WebhookSectionProps {
  webhookUrl: string;
  onSave: (url: string) => Promise<void>;
  onSync: () => Promise<void>;
  syncing: boolean;
  isConnected: boolean;
}

export function WebhookSection({
  webhookUrl,
  onSave,
  onSync,
  syncing,
  isConnected,
}: WebhookSectionProps) {
  const [editing, setEditing] = useState(false);
  const [localUrl, setLocalUrl] = useState(webhookUrl);

  const handleSave = async () => {
    await onSave(localUrl);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalUrl(webhookUrl);
    setEditing(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="rounded-2xl bg-primary/20 p-3 text-primary">
          <LinkIcon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground">
            Bitrix24 CRM integration
          </h3>
          <p className="text-sm text-muted-foreground">
            Save your Bitrix24 webhook URL and sync CRM data for pipelines and functions.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isConnected
            ? 'bg-green-500/20 text-green-600 border border-green-500/30'
            : 'bg-muted text-muted-foreground border border-border'
        }`}>
          {isConnected ? 'Connected' : 'Not connected'}
        </span>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground">
          Bitrix24 webhook URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {editing ? (
            <>
              <input
                type="url"
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder="https://your-domain.bitrix24.com/rest/1/webhook_code/"
                className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-500/20"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                {webhookUrl || 'No webhook URL configured yet.'}
              </div>
              <button
                onClick={() => {
                  setEditing(true);
                  setLocalUrl(webhookUrl);
                }}
                className="rounded-2xl border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-secondary"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {(webhookUrl || localUrl.trim()) && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Sync CRM data to pull Bitrix24 fields, pipelines, and stages for automations.
          </p>
          <button
            onClick={onSync}
            disabled={syncing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync CRM data'}
          </button>
        </div>
      )}
    </section>
  );
}

