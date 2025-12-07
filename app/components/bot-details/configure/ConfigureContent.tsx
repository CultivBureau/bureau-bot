'use client';

import { Settings } from 'lucide-react';
import { useBotConfiguration } from './hooks/useBotConfiguration';
import { BotStatusCard } from './BotStatusCard';
import { ConfigFieldsGrid } from './ConfigFieldsGrid';

export function ConfigureContent() {
  const {
    bot,
    loading,
    error,
    saving,
    editingField,
    editValues,
    handleEdit,
    handleCancel,
    handleSave,
    handleChange,
    handlePay,
  } = useBotConfiguration();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-muted-foreground">Loading configuration...</div>
      </div>
    );
  }

  if (error && !bot) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="text-center text-muted-foreground">Bot configuration not found.</div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm overflow-hidden">
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold text-card-foreground">Configuration Settings</h2>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <BotStatusCard bot={bot} onPay={handlePay} />

      <ConfigFieldsGrid
        bot={bot}
        editingField={editingField}
        editValues={editValues}
        saving={saving}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />
    </div>
  );
}
