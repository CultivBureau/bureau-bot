import { useState, useEffect, useMemo } from 'react';
import { transferService, type UserTransfer, type ChannelTransfer } from '../../../../services/transfer';
import { bitrixService } from '../../../../services/bitrix';

interface User {
  id: string | number;
  name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  active?: boolean;
}

interface Channel {
  id: string | number;
  name: string;
  line_id?: string;
  active?: boolean;
}

interface TransferState {
  // User Transfer
  userTransfer: UserTransfer | null;
  userTransferLoading: boolean;
  userTransferEnabled: boolean;
  userTriggerInstructions: string;
  selectedUsers: number[];
  userBitrixIntegration: string | null;
  
  // Channel Transfer
  channelTransfer: ChannelTransfer | null;
  channelTransferLoading: boolean;
  channelTransferEnabled: boolean;
  channelTriggerInstructions: string;
  selectedChannels: number[];
  channelBitrixIntegration: string | null;
  
  // Common
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  users: User[];
  channels: Channel[];
  loadingUsers: boolean;
  loadingChannels: boolean;
  bitrixIntegrationReady: boolean;
  integrationId: string | null;
  integrationPrerequisiteMessage: string;
}

export function useTransferSettings(botId: string | null) {
  const [state, setState] = useState<TransferState>({
    userTransfer: null,
    userTransferLoading: false,
    userTransferEnabled: false,
    userTriggerInstructions: '',
    selectedUsers: [],
    userBitrixIntegration: null,
    
    channelTransfer: null,
    channelTransferLoading: false,
    channelTransferEnabled: false,
    channelTriggerInstructions: '',
    selectedChannels: [],
    channelBitrixIntegration: null,
    
    loading: true,
    saving: false,
    error: '',
    success: '',
    users: [],
    channels: [],
    loadingUsers: false,
    loadingChannels: false,
    bitrixIntegrationReady: false,
    integrationId: null,
    integrationPrerequisiteMessage: '',
  });

  // Get integration by bot ID
  useEffect(() => {
    const fetchIntegration = async () => {
      if (!botId) {
        setState(prev => ({
          ...prev,
          bitrixIntegrationReady: false,
          integrationPrerequisiteMessage: 'No bot ID provided',
          loading: false,
        }));
        return;
      }

      try {
        const integration = await bitrixService.getIntegrationByBotId(botId);
        if (integration && integration.id) {
          setState(prev => ({
            ...prev,
            bitrixIntegrationReady: true,
            integrationId: integration.id,
            integrationPrerequisiteMessage: '',
          }));
        } else {
          setState(prev => ({
            ...prev,
            bitrixIntegrationReady: false,
            integrationId: null,
            integrationPrerequisiteMessage: 'Connect a Bitrix integration in the Integration tab to use transfer features.',
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          bitrixIntegrationReady: false,
          integrationId: null,
          integrationPrerequisiteMessage: 'Unable to verify Bitrix integration. Please check your integration settings.',
        }));
      }
    };

    fetchIntegration();
  }, [botId]);

  // All transfers list
  const [allTransfers, setAllTransfers] = useState<Array<(UserTransfer & { type: 'user' }) | (ChannelTransfer & { type: 'channel' })>>([]);

  // Load existing transfers
  useEffect(() => {
    const loadTransfers = async () => {
      if (!botId || !state.bitrixIntegrationReady) {
        setState(prev => ({ ...prev, loading: false }));
        setAllTransfers([]);
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: '' }));

      try {
        // Load all user transfers
        const userTransferList = await transferService.getUserTransfers({
          bot_id: botId,
          pageNumber: 1,
          pageSize: 20,
        });

        // Load all channel transfers
        const channelTransferList = await transferService.getChannelTransfers({
          bot_id: botId,
          pageNumber: 1,
          pageSize: 20,
        });

        // Combine all transfers
        const combinedTransfers: Array<(UserTransfer & { type: 'user' }) | (ChannelTransfer & { type: 'channel' })> = [
          ...(userTransferList.results || []).map(t => ({ ...t, type: 'user' as const })),
          ...(channelTransferList.results || []).map(t => ({ ...t, type: 'channel' as const })),
        ];
        setAllTransfers(combinedTransfers);

        // Set the first user transfer if exists (for editing)
        if (userTransferList.results && userTransferList.results.length > 0) {
          const userTransfer = userTransferList.results[0];
          setState(prev => ({
            ...prev,
            userTransfer,
            userTransferEnabled: true,
            userTriggerInstructions: userTransfer.trigger_instructions || '',
            selectedUsers: userTransfer.users || [],
            userBitrixIntegration: userTransfer.bitrix_integration || null,
          }));
        }

        // Set the first channel transfer if exists (for editing)
        if (channelTransferList.results && channelTransferList.results.length > 0) {
          const channelTransfer = channelTransferList.results[0];
          setState(prev => ({
            ...prev,
            channelTransfer,
            channelTransferEnabled: true,
            channelTriggerInstructions: channelTransfer.trigger_instructions || '',
            selectedChannels: channelTransfer.channels || [],
            channelBitrixIntegration: channelTransfer.bitrix_integration || null,
          }));
        }
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load transfer settings',
        }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadTransfers();
  }, [botId, state.bitrixIntegrationReady]);

  // Sync and load users
  useEffect(() => {
    const loadUsers = async () => {
      if (!botId || !state.bitrixIntegrationReady) {
        setState(prev => ({ ...prev, users: [] }));
        return;
      }

      try {
        setState(prev => ({ ...prev, loadingUsers: true }));
        const syncResponse = await transferService.syncUsers(botId);
        const usersList = syncResponse.users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          position: user.position,
          active: user.active,
        }));
        setState(prev => ({ ...prev, users: usersList }));
      } catch (error) {
        // Error fetching users - keep existing list
      } finally {
        setState(prev => ({ ...prev, loadingUsers: false }));
      }
    };

    loadUsers();
  }, [botId, state.bitrixIntegrationReady]);

  // Sync and load channels
  useEffect(() => {
    const loadChannels = async () => {
      if (!botId || !state.bitrixIntegrationReady) {
        setState(prev => ({ ...prev, channels: [] }));
        return;
      }

      try {
        setState(prev => ({ ...prev, loadingChannels: true }));
        const syncResponse = await transferService.syncChannels(botId);
        const channelsList = syncResponse.channels.map(channel => ({
          id: channel.id,
          name: channel.name,
          line_id: channel.line_id,
          active: channel.active,
        }));
        setState(prev => ({ ...prev, channels: channelsList }));
      } catch (error) {
        // Error fetching channels - keep existing list
      } finally {
        setState(prev => ({ ...prev, loadingChannels: false }));
      }
    };

    loadChannels();
  }, [botId, state.bitrixIntegrationReady]);

  const updateUserTransfer = (updates: Partial<Pick<TransferState, 'userTransferEnabled' | 'userTriggerInstructions' | 'selectedUsers' | 'userBitrixIntegration'>> & { userTransfer?: UserTransfer | null }) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateChannelTransfer = (updates: Partial<Pick<TransferState, 'channelTransferEnabled' | 'channelTriggerInstructions' | 'selectedChannels' | 'channelBitrixIntegration'>> & { channelTransfer?: ChannelTransfer | null }) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const saveSettings = async () => {
    if (!botId) {
      setState(prev => ({ ...prev, error: 'No bot ID provided' }));
      return;
    }

    if (!state.bitrixIntegrationReady || !state.integrationId) {
      setState(prev => ({ ...prev, error: 'Bitrix integration is required to save transfer settings' }));
      return;
    }

    setState(prev => ({ ...prev, saving: true, error: '', success: '' }));

    try {
      // Save user transfer
      if (state.userTransferEnabled) {
        if (!state.userTriggerInstructions.trim()) {
          setState(prev => ({ ...prev, error: 'Trigger instructions are required for user transfer', saving: false }));
          return;
        }

        if (!state.userBitrixIntegration) {
          setState(prev => ({ ...prev, error: 'Please select a Bitrix integration for user transfer', saving: false }));
          return;
        }

        if (state.selectedUsers.length === 0) {
          setState(prev => ({ ...prev, error: 'Please select at least one user for user transfer', saving: false }));
          return;
        }

        if (state.userTransfer?.id) {
          // Update existing
          await transferService.updateUserTransfer(state.userTransfer.id, {
            bot: botId,
            bitrix_integration: state.userBitrixIntegration || undefined,
            trigger_instructions: state.userTriggerInstructions,
            users: state.selectedUsers,
          });
        } else {
          // Create new
          const newTransfer = await transferService.createUserTransfer({
            bot: botId,
            bitrix_integration: state.userBitrixIntegration || undefined,
            trigger_instructions: state.userTriggerInstructions,
            users: state.selectedUsers,
          });
          setState(prev => ({ ...prev, userTransfer: newTransfer }));
        }
      } else if (state.userTransfer?.id) {
        // Delete if disabled
        await transferService.deleteUserTransfer(state.userTransfer.id);
        setState(prev => ({ ...prev, userTransfer: null }));
      }

      // Save channel transfer
      if (state.channelTransferEnabled) {
        if (!state.channelTriggerInstructions.trim()) {
          setState(prev => ({ ...prev, error: 'Trigger instructions are required for channel transfer', saving: false }));
          return;
        }

        if (!state.channelBitrixIntegration) {
          setState(prev => ({ ...prev, error: 'Please select a Bitrix integration for channel transfer', saving: false }));
          return;
        }

        if (state.selectedChannels.length === 0) {
          setState(prev => ({ ...prev, error: 'Please select at least one channel for channel transfer', saving: false }));
          return;
        }

        if (state.channelTransfer?.id) {
          // Update existing
          await transferService.updateChannelTransfer(state.channelTransfer.id, {
            bot: botId,
            bitrix_integration: state.channelBitrixIntegration || undefined,
            trigger_instructions: state.channelTriggerInstructions,
            channels: state.selectedChannels,
          });
        } else {
          // Create new
          const newTransfer = await transferService.createChannelTransfer({
            bot: botId,
            bitrix_integration: state.channelBitrixIntegration || undefined,
            trigger_instructions: state.channelTriggerInstructions,
            channels: state.selectedChannels,
          });
          setState(prev => ({ ...prev, channelTransfer: newTransfer }));
        }
      } else if (state.channelTransfer?.id) {
        // Delete if disabled
        await transferService.deleteChannelTransfer(state.channelTransfer.id);
        setState(prev => ({ ...prev, channelTransfer: null }));
      }

      // Refresh transfers list
      const [userTransferList, channelTransferList] = await Promise.all([
        transferService.getUserTransfers({ bot_id: botId, pageNumber: 1, pageSize: 20 }),
        transferService.getChannelTransfers({ bot_id: botId, pageNumber: 1, pageSize: 20 }),
      ]);

      const combinedTransfers: Array<(UserTransfer & { type: 'user' }) | (ChannelTransfer & { type: 'channel' })> = [
        ...(userTransferList.results || []).map(t => ({ ...t, type: 'user' as const })),
        ...(channelTransferList.results || []).map(t => ({ ...t, type: 'channel' as const })),
      ];
      setAllTransfers(combinedTransfers);

      setState(prev => ({
        ...prev,
        success: 'Transfer settings saved successfully!',
        saving: false,
      }));

      setTimeout(() => {
        setState(prev => ({ ...prev, success: '' }));
      }, 5000);
    } catch (err: unknown) {
      let errorMessage = 'Failed to save transfer settings';
      if (err instanceof Error) {
        errorMessage = err.message;
        // Check if there are additional error details
        const errorDetails = (err as any).details;
        if (errorDetails) {
          // Try to extract more specific error messages
          if (typeof errorDetails === 'object') {
            const errorKeys = Object.keys(errorDetails);
            if (errorKeys.length > 0) {
              // Check for duplicate transfer errors
              const botErrors = errorDetails.bot;
              if (Array.isArray(botErrors) && botErrors.length > 0) {
                const duplicateError = botErrors.find((e: string) => 
                  e.includes('already exists') || e.includes('Only one')
                );
                if (duplicateError) {
                  errorMessage = duplicateError;
                } else {
                  errorMessage = botErrors.join(', ');
                }
              } else {
                // Show field-specific errors if available
                const fieldErrors = errorKeys
                  .filter(key => {
                    const value = errorDetails[key];
                    return (Array.isArray(value) || typeof value === 'string') && key !== 'bot';
                  })
                  .map(key => {
                    const value = errorDetails[key];
                    if (Array.isArray(value)) {
                      return `${key}: ${value.join(', ')}`;
                    }
                    return `${key}: ${value}`;
                  })
                  .join('; ');
                if (fieldErrors) {
                  errorMessage = fieldErrors;
                } else if (errorDetails.detail) {
                  errorMessage = errorDetails.detail;
                } else if (errorDetails.error) {
                  errorMessage = errorDetails.error;
                }
              }
            }
          }
        }
      }
      setState(prev => ({
        ...prev,
        error: errorMessage,
        saving: false,
      }));
    }
  };

  const hasChanges = useMemo(() => {
    // Check if there are any changes from the loaded state
    // This is a simplified check - you might want to compare with initial state
    return state.userTransferEnabled || state.channelTransferEnabled;
  }, [state.userTransferEnabled, state.channelTransferEnabled]);

  const refreshTransfers = async () => {
    if (!botId || !state.bitrixIntegrationReady) return;
    
    try {
      const [userTransferList, channelTransferList] = await Promise.all([
        transferService.getUserTransfers({ bot_id: botId, pageNumber: 1, pageSize: 20 }),
        transferService.getChannelTransfers({ bot_id: botId, pageNumber: 1, pageSize: 20 }),
      ]);

      const combinedTransfers: Array<(UserTransfer & { type: 'user' }) | (ChannelTransfer & { type: 'channel' })> = [
        ...(userTransferList.results || []).map(t => ({ ...t, type: 'user' as const })),
        ...(channelTransferList.results || []).map(t => ({ ...t, type: 'channel' as const })),
      ];
      setAllTransfers(combinedTransfers);
    } catch (err) {
      // Error refreshing
    }
  };

  // Check if transfers already exist
  const hasUserTransfer = useMemo(() => {
    return allTransfers.some(t => t.type === 'user');
  }, [allTransfers]);

  const hasChannelTransfer = useMemo(() => {
    return allTransfers.some(t => t.type === 'channel');
  }, [allTransfers]);

  return {
    // All transfers list
    allTransfers,
    refreshTransfers,
    hasUserTransfer,
    hasChannelTransfer,
    
    // User Transfer
    userTransferEnabled: state.userTransferEnabled,
    userTriggerInstructions: state.userTriggerInstructions,
    selectedUsers: state.selectedUsers,
    userBitrixIntegration: state.userBitrixIntegration,
    updateUserTransfer,
    
    // Channel Transfer
    channelTransferEnabled: state.channelTransferEnabled,
    channelTriggerInstructions: state.channelTriggerInstructions,
    selectedChannels: state.selectedChannels,
    channelBitrixIntegration: state.channelBitrixIntegration,
    updateChannelTransfer,
    
    // Common
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    success: state.success,
    hasChanges,
    users: state.users,
    channels: state.channels,
    loadingUsers: state.loadingUsers,
    loadingChannels: state.loadingChannels,
    bitrixIntegrationReady: state.bitrixIntegrationReady,
    integrationPrerequisiteMessage: state.integrationPrerequisiteMessage,
    saveSettings,
  };
}
