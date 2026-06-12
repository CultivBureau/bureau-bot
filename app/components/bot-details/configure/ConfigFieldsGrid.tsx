'use client';

import { memo } from 'react';
import { Bot as BotIcon, Globe, Workflow } from 'lucide-react';
import { ApiKeyField } from './ApiKeyField';
import { ModelSelector } from './ModelSelector';
import { WaitTimeField } from './WaitTimeField';
import { ConfigField } from './ConfigField';
import { ProviderField } from './ProviderField';
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
      <ProviderField
        value={bot.llm_provider || 'openai'}
        editing={editingField === 'llm_provider'}
        editValue={(editValues.llm_provider as Bot['llm_provider']) || bot.llm_provider || 'openai'}
        onEdit={() => onEdit('llm_provider')}
        onSave={() => onSave('llm_provider')}
        onCancel={onCancel}
        onChange={(value) => onChange('llm_provider', value)}
        saving={saving}
      />

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
        value={bot.encrypted_provider_api_key || bot.openai_api_key || ''}
        editing={editingField === 'encrypted_provider_api_key'}
        editValue={
          editValues.encrypted_provider_api_key ??
          bot.encrypted_provider_api_key ??
          bot.openai_api_key ??
          ''
        }
        onEdit={() => onEdit('encrypted_provider_api_key')}
        onSave={() => onSave('encrypted_provider_api_key')}
        onCancel={onCancel}
        onChange={(value) => onChange('encrypted_provider_api_key', value)}
        saving={saving}
        disabled={false}
        provider={bot.llm_provider || 'openai'}
      />

      <ModelSelector
        value={bot.llm_model || bot.gpt_model}
        editing={editingField === 'llm_model'}
        editValue={editValues.llm_model ?? bot.llm_model ?? bot.gpt_model}
        provider={bot.llm_provider || 'openai'}
        onEdit={() => onEdit('llm_model')}
        onSave={() => onSave('llm_model')}
        onCancel={onCancel}
        onChange={(value) => onChange('llm_model', value)}
        saving={saving}
      />

      <ConfigField
        label={bot.llm_provider === 'openai' ? 'Provider Resource ID' : 'Provider Resource ID'}
        value={bot.provider_resource_id || bot.assistant_id || ''}
        editing={editingField === 'provider_resource_id' && bot.llm_provider === 'openai'}
        editValue={editValues.provider_resource_id ?? bot.provider_resource_id ?? bot.assistant_id ?? ''}
        onEdit={() => onEdit('provider_resource_id')}
        onSave={() => onSave('provider_resource_id')}
        onCancel={onCancel}
        onChange={(value) => onChange('provider_resource_id', value)}
        icon={<BotIcon className="h-5 w-5" />}
        saving={saving}
        disabled={bot.llm_provider !== 'openai'}
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

      <ConfigField
        label="n8n Workflow Link"
        value={bot.n8nWorkFlow || ''}
        editing={editingField === 'n8nWorkFlow'}
        editValue={editValues.n8nWorkFlow ?? bot.n8nWorkFlow ?? ''}
        onEdit={() => onEdit('n8nWorkFlow')}
        onSave={() => onSave('n8nWorkFlow')}
        onCancel={onCancel}
        onChange={(value) => onChange('n8nWorkFlow', value)}
        icon={<Workflow className="h-5 w-5" />}
        saving={saving}
      />
    </div>
  );
});

