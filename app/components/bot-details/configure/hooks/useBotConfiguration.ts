import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { botService } from '../../../../services/bot';
import { prepareFieldValue } from '../../../../utils/configure/validators';
import type { Bot } from '../../../../types/bot';

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
      const updateData: Record<string, string | number | null | undefined> = {};
      const value = editValues[field];
      
      updateData[field] = prepareFieldValue(field, value);

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
    console.log('Pay button clicked for bot:', botId);
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

