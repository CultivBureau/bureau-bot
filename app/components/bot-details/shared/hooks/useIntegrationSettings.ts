import { useState, useEffect, useCallback } from 'react';
import { botService } from '../../../../services/bot';
import { bitrixService } from '../../../../services/bitrix';
import type { Bot } from '../../../../types/bot';

export function useIntegrationSettings(botId: string | null) {
  const [botMeta, setBotMeta] = useState<Bot | null>(null);
  const [integrationSettings, setIntegrationSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingWebhook, setEditingWebhook] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [connectorCode, setConnectorCode] = useState('');
  const [lineId, setLineId] = useState('');
  const [registering, setRegistering] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!botId) {
        setError('No bot ID provided');
        setLoading(false);
        return;
      }

      try {
        const botResponse = await botService.getBotById(botId);
        setBotMeta(botResponse);

        const integrationResponse = await bitrixService.getIntegrationSettings({ bot_id: botId });
        const integrationData = integrationResponse;
        if (integrationData.results && integrationData.results.length > 0) {
          const settings = integrationData.results[0];
          setIntegrationSettings(settings);
          setWebhookUrl(settings.webhook_url || '');
          setConnectorCode(settings.connector_code || '');
          setLineId(settings.line_id || '');
          setClientId(settings.client_id || '');
          setClientSecret(settings.client_secret || '');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch integration data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [botId]);

  const handleSyncCRMData = useCallback(async () => {
    if (!botId) {
      setError('Bot ID is missing');
      return;
    }

    const webhookToUse = webhookUrl.trim() || integrationSettings?.webhook_url || '';
    
    if (!webhookToUse) {
      setError('Please enter a webhook URL first');
      return;
    }

    setSyncing(true);
    setError('');
    setSuccess('');

    try {
      let settingsResponse;
      if (integrationSettings) {
        settingsResponse = await bitrixService.updateIntegrationSetting(integrationSettings.id, {
          webhook_url: webhookToUse,
          crm_entity_type: 'DEAL',
          waiting_seconds: 0,
        });
      } else {
        settingsResponse = await bitrixService.createIntegrationSetting({
          bot_id: botId,
          webhook_url: webhookToUse,
          crm_entity_type: 'DEAL',
          waiting_seconds: 0,
        });
      }

      const syncResponse = await bitrixService.syncCrmData(botId, webhookToUse);
      const syncData = syncResponse;
      setSuccess(`Successfully synced CRM data! Found ${syncData.data?.fields_count || 0} fields, ${syncData.data?.pipelines_count || 0} pipelines, and ${syncData.data?.stages_count || 0} stages.`);
        
      const updatedSettings = settingsResponse;
      setIntegrationSettings(updatedSettings);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while syncing CRM data');
    } finally {
      setSyncing(false);
    }
  }, [webhookUrl, botId, integrationSettings]);

  const handleSaveWebhook = useCallback(async () => {
    if (!webhookUrl.trim()) {
      setError('Please enter a webhook URL');
      return;
    }

    try {
      const settingsData = {
        webhook_url: webhookUrl,
        crm_entity_type: 'DEAL',
        waiting_seconds: 0,
      };

      let response;
      if (integrationSettings) {
        response = await bitrixService.updateIntegrationSetting(integrationSettings.id, settingsData);
      } else {
        response = await bitrixService.createIntegrationSetting({
          ...settingsData,
          bot_id: botId!,
        });
      }
      const data = response;
      setIntegrationSettings(data);
      setEditingWebhook(false);
      setSuccess('Webhook URL saved successfully! Now you can sync CRM data.');
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to save webhook URL');
    }
  }, [webhookUrl, botId, integrationSettings]);

  const handleRegisterConnector = async () => {
    if (!connectorCode.trim() || !lineId.trim()) {
      setError('Please enter both Connector Code and Line ID');
      return;
    }
    try {
      setRegistering(true);
      const response = await bitrixService.imConnectorRegister({
        bot_id: botId!,
        connector_code: connectorCode,
        line_id: lineId,
      });
      const data = response;
      setIntegrationSettings(data);
      setSuccess('IM connector registered successfully.');
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to register IM connector');
    } finally {
      setRegistering(false);
    }
  };

  const handleSaveClientCredentials = async () => {
    if (!clientId.trim()) {
      setError('Client ID is required');
      return;
    }
    try {
      const data = {
        webhook_url: webhookUrl,
        crm_entity_type: 'DEAL',
        waiting_seconds: 0,
        client_id: clientId,
        client_secret: clientSecret || undefined,
      };
      let response;
      if (integrationSettings) {
        response = await bitrixService.updateIntegrationSetting(integrationSettings.id, data);
      } else {
        response = await bitrixService.createIntegrationSetting({ ...data, bot_id: botId! });
      }
      const resData = response;
      setIntegrationSettings(resData);
      setSuccess('Client credentials saved successfully');
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to save client credentials');
    }
  };

  return {
    botMeta,
    integrationSettings,
    loading,
    syncing,
    error,
    success,
    webhookUrl,
    connectorCode,
    lineId,
    registering,
    clientId,
    clientSecret,
    setWebhookUrl,
    setConnectorCode,
    setLineId,
    setClientId,
    setClientSecret,
    handleSyncCRMData,
    handleSaveWebhook,
    handleRegisterConnector,
    handleSaveClientCredentials,
  };
}

