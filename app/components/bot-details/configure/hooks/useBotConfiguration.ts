import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { botService } from '../../../../services/bot';
import { prepareFieldValue } from '../../../../utils/configure/validators';
import type { Bot, UpdateBotRequest } from '../../../../types/bot';

export function useBotConfiguration() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Bot>>({});

  const fetchBot = useCallback(async () => {
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
  }, [botId]);

  useEffect(() => {
    fetchBot();
  }, [fetchBot]);

  const handleEdit = useCallback((field: keyof Bot) => {
    setEditingField(field);
    setEditValues({ [field]: bot?.[field] ?? '' });
  }, [bot]);

  const handleCancel = useCallback(() => {
    setEditingField(null);
    setEditValues({});
  }, []);

  const handleSave = useCallback(async (field: keyof Bot) => {
    if (!bot || !botId) return;

    setSaving(true);
    try {
      const updateData: Partial<UpdateBotRequest> = {};
      const value = editValues[field];

      if (field === 'name') {
        updateData.name = String(value ?? '');
      }

      if (field === 'llm_provider') {
        updateData.llm_provider = String(value ?? '') as UpdateBotRequest['llm_provider'];
      }

      if (field === 'llm_model') {
        updateData.llm_model = String(value ?? '');
        updateData.gpt_model = String(value ?? '');
      }

      if (field === 'encrypted_provider_api_key') {
        updateData.encrypted_provider_api_key = prepareFieldValue(
          'encrypted_provider_api_key',
          String(value ?? '')
        ) as string | null;
        updateData.openai_api_key = value === '' ? null : String(value ?? '');
      }

      if (field === 'provider_resource_id') {
        const normalized = prepareFieldValue(
          'provider_resource_id',
          String(value ?? '')
        ) as string | null;
        updateData.assistant_id = normalized;
        updateData.provider_resource_id = normalized;
      }

      if (field === 'wait_time') {
        updateData.wait_time = prepareFieldValue('wait_time', Number(value ?? 0)) as number;
      }

      if (field === 'webhook_url') {
        updateData.webhook_url = prepareFieldValue('webhook_url', String(value ?? '')) as string | null;
      }

      if (field === 'instructions') {
        updateData.instructions = String(value ?? '');
      }

      if (field === 'n8nWorkFlow') {
        updateData.n8nWorkFlow = String(value ?? '') || null;
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
  }, [bot, botId, editValues]);

  const handleChange = useCallback((field: keyof Bot, value: string | number) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePay = useCallback(() => {
    // TODO: Implement payment logic
  }, [botId]);

  return {
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
  };
}

