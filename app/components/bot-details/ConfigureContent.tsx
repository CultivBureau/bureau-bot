'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Settings, Hash, Bot as BotIcon } from 'lucide-react';
import { botService } from '../../services/bot';
import type { Bot } from '../../types/bot';
import { ApiKeyField } from './ApiKeyField';
import { ModelSelector } from './ModelSelector';
import { WaitTimeField } from './WaitTimeField';
import { ConfigField } from './ConfigField';

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
    if (!bot || !editValues[field]) return;

    setSaving(true);
    try {
      const updateData: Record<string, string | number> = {};
      updateData[field] = editValues[field] as string | number;

      const updatedBot = await botService.updateBot(botId, updateData);
      setBot(updatedBot);
      setEditingField(null);
      setEditValues({});
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update configuration';
      setError(errorMessage);
    } finally {
      setSaving(false);
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
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <ApiKeyField
          value={bot.openai_api_key || ''}
          editing={editingField === 'openai_api_key'}
          editValue={editValues.openai_api_key ?? bot.openai_api_key ?? ''}
          onEdit={() => handleEdit('openai_api_key')}
          onSave={() => handleSave('openai_api_key')}
          onCancel={handleCancel}
          onChange={(value) => handleChange('openai_api_key', value)}
          saving={saving}
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-card-foreground">
            Assistant ID
          </label>
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground font-mono text-sm">
              {bot.assistant_id || 'Not created yet'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

