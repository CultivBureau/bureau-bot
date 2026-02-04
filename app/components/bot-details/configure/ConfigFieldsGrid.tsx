'use client';

import { memo } from 'react';
import { Bot as BotIcon, Globe } from 'lucide-react';
import { ApiKeyField } from './ApiKeyField';
import { ModelSelector } from './ModelSelector';
import { WaitTimeField } from './WaitTimeField';
import { ConfigField } from './ConfigField';
import type { Bot } from '../../../types/bot';

interface ConfigFieldsGridProps {
  bot: Bot;
  editingField: string | null;
  editValues: Partial<Bot>;
  saving: boolean;
  onEdit: (field: keyof Bot) => void;
  onSave: (field: keyof Bot) => void;
  onCancel: () => void;
  onChange: (field: keyof Bot, value: string | number) => void;
}

export const ConfigFieldsGrid = memo(function ConfigFieldsGrid({
  bot,
  editingField,
  editValues,
  saving,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: ConfigFieldsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
      <ConfigField
        label="Bot Name"
        value={bot.name}
        editing={editingField === 'name'}
        editValue={editValues.name ?? bot.name}
        onEdit={() => onEdit('name')}
        onSave={() => onSave('name')}
        onCancel={onCancel}
        onChange={(value) => onChange('name', value)}
        icon={<BotIcon className="h-5 w-5" />}
        saving={saving}
      />

      <ApiKeyField
        value={bot.openai_api_key || ''}
        editing={editingField === 'openai_api_key'}
        editValue={editValues.openai_api_key ?? bot.openai_api_key ?? ''}
        onEdit={() => onEdit('openai_api_key')}
        onSave={() => onSave('openai_api_key')}
        onCancel={onCancel}
        onChange={(value) => onChange('openai_api_key', value)}
        saving={saving}
        disabled={false}
      />

      <ModelSelector
        value={bot.gpt_model}
        editing={editingField === 'gpt_model'}
        editValue={editValues.gpt_model ?? bot.gpt_model}
        onEdit={() => onEdit('gpt_model')}
        onSave={() => onSave('gpt_model')}
        onCancel={onCancel}
        onChange={(value) => onChange('gpt_model', value)}
        saving={saving}
      />

      <WaitTimeField
        value={bot.wait_time ?? 0}
        editing={editingField === 'wait_time'}
        editValue={editValues.wait_time ?? bot.wait_time ?? 0}
        onEdit={() => onEdit('wait_time')}
        onSave={() => onSave('wait_time')}
        onCancel={onCancel}
        onChange={(value) => onChange('wait_time', value)}
        saving={saving}
      />

      <ConfigField
        label="Webhook URL"
        value={bot.webhook_url || ''}
        editing={editingField === 'webhook_url'}
        editValue={editValues.webhook_url ?? bot.webhook_url ?? ''}
        onEdit={() => onEdit('webhook_url')}
        onSave={() => onSave('webhook_url')}
        onCancel={onCancel}
        onChange={(value) => onChange('webhook_url', value)}
        icon={<Globe className="h-5 w-5" />}
        saving={saving}
      />
    </div>
  );
});

