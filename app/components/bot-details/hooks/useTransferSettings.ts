import { useState, useEffect, useMemo } from 'react';
import { bitrixService } from '../../../services/bitrix';

interface TransferSettings {
  channel_transfer: boolean;
  user_transfer: boolean;
  bot_leave_chat_condition: boolean;
  channel_additional_function_description?: string;
  selected_channels?: string;
  channel_bot_response?: string;
  user_additional_function_description?: string;
  selected_users?: string;
  user_bot_response?: string;
  leave_additional_function_description?: string;
  leave_bot_response?: string;
}

interface User {
  id: string | number;
  name: string;
  email?: string;
}

interface Channel {
  id: string | number;
  name: string;
  code?: string;
}

export function useTransferSettings(botId: string | null) {
  const [settings, setSettings] = useState<TransferSettings>({
    channel_transfer: false,
    user_transfer: false,
    bot_leave_chat_condition: false,
    channel_additional_function_description: '',
    selected_channels: '',
    channel_bot_response: '',
    user_additional_function_description: '',
    selected_users: '',
    user_bot_response: '',
    leave_additional_function_description: '',
    leave_bot_response: '',
  });

  const [initialSettings, setInitialSettings] = useState<TransferSettings>(settings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [bitrixIntegrationReady, setBitrixIntegrationReady] = useState(false);
  const [integrationPrerequisiteMessage, setIntegrationPrerequisiteMessage] = useState('');

  const hasChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(initialSettings);
  }, [settings, initialSettings]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!botId) {
        setError('No bot ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await bitrixService.getTransferSettings(botId);
        const loadedSettings: TransferSettings = {
          channel_transfer: Boolean(response.channel_transfer),
          user_transfer: Boolean(response.user_transfer),
          bot_leave_chat_condition: Boolean(response.bot_leave_chat_condition),
          channel_additional_function_description: response.channel_additional_function_description || '',
          selected_channels: response.selected_channels || '',
          channel_bot_response: response.channel_bot_response || '',
          user_additional_function_description: response.user_additional_function_description || '',
          selected_users: response.selected_users || '',
          user_bot_response: response.user_bot_response || '',
          leave_additional_function_description: response.leave_additional_function_description || '',
          leave_bot_response: response.leave_bot_response || '',
        };
        setSettings(loadedSettings);
        setInitialSettings(loadedSettings);
      } catch (err) {
        console.error('Error fetching transfer settings:', err);
        setError('Failed to load transfer settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [botId]);

  useEffect(() => {
    const verifyIntegration = async () => {
      if (!botId) {
        setBitrixIntegrationReady(false);
        setIntegrationPrerequisiteMessage('');
        return;
      }

      try {
        const response = await bitrixService.getIntegrationSettings({ bot_id: botId });
        const data = response;
        const settingsList = Array.isArray(data) ? data : data.results ?? [];
        const activeSetting = settingsList[0];
        if (activeSetting?.webhook_url) {
          setBitrixIntegrationReady(true);
          setIntegrationPrerequisiteMessage('');
        } else {
          setBitrixIntegrationReady(false);
          setIntegrationPrerequisiteMessage('Connect a Bitrix webhook in the Integration tab to load Bitrix users and channels.');
        }
      } catch (error) {
        setBitrixIntegrationReady(false);
        setIntegrationPrerequisiteMessage('Unable to verify Bitrix integration settings.');
      }
    };

    verifyIntegration();
  }, [botId]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!botId || !bitrixIntegrationReady) {
        setUsers([]);
        return;
      }
      
      try {
        setLoadingUsers(true);
        const response = await bitrixService.getBitrixUsers({ bot_id: botId });
        const data = response;
        const usersList = Array.isArray(data) ? data : (data.results ?? []);
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [botId, bitrixIntegrationReady]);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!botId || !bitrixIntegrationReady) {
        setChannels([]);
        return;
      }
      
      try {
        setLoadingChannels(true);
        const response = await bitrixService.getBitrixChannels({ bot_id: botId });
        const data = response;
        const channelsList = Array.isArray(data) ? data : (data.results ?? []);
        setChannels(channelsList);
      } catch (error) {
        console.error('Error fetching channels:', error);
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchChannels();
  }, [botId, bitrixIntegrationReady]);

  const updateSettings = (updates: Partial<TransferSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const saveSettings = async () => {
    if (!botId) {
      setError('No bot ID provided');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const settingsData = {
        channel_transfer: settings.channel_transfer,
        channel_additional_function_description: settings.channel_additional_function_description || '',
        selected_channels: settings.selected_channels || '',
        channel_bot_response: settings.channel_bot_response || '',
        user_transfer: settings.user_transfer,
        user_additional_function_description: settings.user_additional_function_description || '',
        selected_users: settings.selected_users || '',
        user_bot_response: settings.user_bot_response || '',
        bot_leave_chat_condition: settings.bot_leave_chat_condition,
        leave_additional_function_description: settings.leave_additional_function_description || '',
        leave_bot_response: settings.leave_bot_response || '',
      };

      const response = await bitrixService.updateTransferSettings(botId, settingsData);
      
      const loadedSettings: TransferSettings = {
        channel_transfer: response.channel_transfer || false,
        user_transfer: response.user_transfer || false,
        bot_leave_chat_condition: response.bot_leave_chat_condition || false,
        channel_additional_function_description: response.channel_additional_function_description || '',
        selected_channels: response.selected_channels || '',
        channel_bot_response: response.channel_bot_response || '',
        user_additional_function_description: response.user_additional_function_description || '',
        selected_users: response.selected_users || '',
        user_bot_response: response.user_bot_response || '',
        leave_additional_function_description: response.leave_additional_function_description || '',
        leave_bot_response: response.leave_bot_response || '',
      };
      
      setSettings(loadedSettings);
      setInitialSettings(loadedSettings);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save transfer settings';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const cancelChanges = () => {
    setSettings(initialSettings);
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return {
    settings,
    initialSettings,
    loading,
    saving,
    error,
    success,
    hasChanges,
    users,
    channels,
    loadingUsers,
    loadingChannels,
    bitrixIntegrationReady,
    integrationPrerequisiteMessage,
    updateSettings,
    saveSettings,
    cancelChanges,
  };
}

