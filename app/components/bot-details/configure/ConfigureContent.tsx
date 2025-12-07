'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Settings, Bot as BotIcon, Calendar, Clock, Globe, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { botService } from '../../../services/bot';
import type { Bot } from '../../../types/bot';
import { ApiKeyField } from './ApiKeyField';
import { ModelSelector } from './ModelSelector';
import { WaitTimeField } from './WaitTimeField';
import { ConfigField } from './ConfigField';
import { ChannelTypeSelector } from './ChannelTypeSelector';
import { Button } from '../../landing/ui/button';

export function ConfigureContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Bot>>({});

  useEffect(() => {
    const fetchBot = async () => {
      if (!botId) {
        setError('No bot ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const botData = await botService.getBotById(botId);
        setBot(botData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load bot configuration';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [botId]);

  const handleEdit = (field: keyof Bot) => {
    setEditingField(field);
    setEditValues({ [field]: bot?.[field] ?? '' });
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleSave = async (field: keyof Bot) => {
    if (!bot || !botId) return;

    setSaving(true);
    try {
      const updateData: Record<string, string | number | null | undefined> = {};
      const value = editValues[field];
      
      // Handle different field types
      if (field === 'wait_time') {
        updateData[field] = typeof value === 'number' ? value : Number(value) || 0;
      } else if (field === 'webhook_url') {
        // Allow empty strings to be sent as null/undefined
        updateData[field] = value === '' ? null : (value as string | null);
      } else {
        updateData[field] = value as string | number | null | undefined;
      }

      const updatedBot = await botService.updateBot(botId, updateData);
      setBot(updatedBot);
      setEditingField(null);
      setEditValues({});
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update configuration';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handlePay = async () => {
    // TODO: Implement payment logic
    console.log('Pay button clicked for bot:', botId);
    // This would typically redirect to a payment page or open a payment modal
  };

  const formatDateTime = (dateTime: string | null | undefined): string => {
    if (!dateTime) return 'Not set';
    try {
      const date = new Date(dateTime);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const handleChange = (field: keyof Bot, value: string | number) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

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
      <div className="text-center text-muted-foreground">
        Bot configuration not found.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm overflow-hidden">
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold text-card-foreground">
          Configuration Settings
        </h2>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Working Status Section */}
      {bot.working ? (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Bot is Active</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-card-foreground">
                Start Time
              </label>
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground min-w-0 overflow-hidden">
                  <div className="truncate">
                    {formatDateTime(bot.start_time)}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-card-foreground">
                End Time
              </label>
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground min-w-0 overflow-hidden">
                  <div className="truncate">
                    {formatDateTime(bot.end_time)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-card-foreground">Bot is Inactive</h3>
            </div>
            <Button
              onClick={handlePay}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
        <ConfigField
          label="Bot Name"
          value={bot.name}
          editing={editingField === 'name'}
          editValue={editValues.name ?? bot.name}
          onEdit={() => handleEdit('name')}
          onSave={() => handleSave('name')}
          onCancel={handleCancel}
          onChange={(value) => handleChange('name', value)}
          icon={<BotIcon className="h-5 w-5" />}
          saving={saving}
        />

        <ChannelTypeSelector
          value={bot.channel_type}
          editing={editingField === 'channel_type'}
          editValue={editValues.channel_type ?? bot.channel_type}
          onEdit={() => handleEdit('channel_type')}
          onSave={() => handleSave('channel_type')}
          onCancel={handleCancel}
          onChange={(value) => handleChange('channel_type', value)}
          saving={saving}
        />

        <ApiKeyField
          value={bot.openai_api_key || ''}
          editing={false}
          editValue={bot.openai_api_key || ''}
          onEdit={() => {}}
          onSave={() => {}}
          onCancel={handleCancel}
          onChange={() => {}}
          saving={saving}
          disabled={true}
        />

        <ModelSelector
          value={bot.gpt_model}
          editing={editingField === 'gpt_model'}
          editValue={editValues.gpt_model ?? bot.gpt_model}
          onEdit={() => handleEdit('gpt_model')}
          onSave={() => handleSave('gpt_model')}
          onCancel={handleCancel}
          onChange={(value) => handleChange('gpt_model', value)}
          saving={saving}
        />

        <WaitTimeField
          value={bot.wait_time ?? 0}
          editing={editingField === 'wait_time'}
          editValue={editValues.wait_time ?? bot.wait_time ?? 0}
          onEdit={() => handleEdit('wait_time')}
          onSave={() => handleSave('wait_time')}
          onCancel={handleCancel}
          onChange={(value) => handleChange('wait_time', value)}
          saving={saving}
        />

        <ConfigField
          label="Webhook URL"
          value={bot.webhook_url || ''}
          editing={editingField === 'webhook_url'}
          editValue={editValues.webhook_url ?? bot.webhook_url ?? ''}
          onEdit={() => handleEdit('webhook_url')}
          onSave={() => handleSave('webhook_url')}
          onCancel={handleCancel}
          onChange={(value) => handleChange('webhook_url', value)}
          icon={<Globe className="h-5 w-5" />}
          saving={saving}
        />
      </div>
    </div>
  );
}

