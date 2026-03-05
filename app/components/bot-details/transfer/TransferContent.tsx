'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Save, X, ArrowRightLeft, Loader2, Plus } from 'lucide-react';
import { useTransferSettings } from '../shared/hooks/useTransferSettings';
import { TransferOption } from './TransferOption';
import { ChannelSelector } from './ChannelSelector';
import { UserSelector } from './UserSelector';
import { TransferFormFields } from './TransferFormFields';
import { TransferList } from './TransferList';
import { BitrixIntegrationSelector } from './BitrixIntegrationSelector';
import { transferService } from '../../../services/transfer';
import type { UserTransfer, ChannelTransfer } from '../../../services/transfer';

type Transfer = (UserTransfer & { type: 'user' }) | (ChannelTransfer & { type: 'channel' });

export function TransferContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);

  const {
    // All transfers
    allTransfers,
    refreshTransfers,
    hasUserTransfer,
    hasChannelTransfer,
    
    // User Transfer
    userTransferEnabled,
    userTriggerInstructions,
    selectedUsers,
    userBitrixIntegration,
    updateUserTransfer,
    
    // Channel Transfer
    channelTransferEnabled,
    channelTriggerInstructions,
    selectedChannels,
    channelBitrixIntegration,
    updateChannelTransfer,
    
    // Common
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
    saveSettings,
  } = useTransferSettings(botId);

  const handleCreateUserTransfer = useCallback(() => {
    setEditingTransfer(null);
    setShowCreateForm(true);
    updateUserTransfer({
      userTransfer: null,
      userTransferEnabled: true,
      userTriggerInstructions: '',
      selectedUsers: [],
      userBitrixIntegration: null,
    });
    updateChannelTransfer({
      channelTransfer: null,
      channelTransferEnabled: false,
      channelTriggerInstructions: '',
      selectedChannels: [],
      channelBitrixIntegration: null,
    });
  }, [updateUserTransfer, updateChannelTransfer]);

  const handleCreateChannelTransfer = useCallback(() => {
    setEditingTransfer(null);
    setShowCreateForm(true);
    updateChannelTransfer({
      channelTransfer: null,
      channelTransferEnabled: true,
      channelTriggerInstructions: '',
      selectedChannels: [],
      channelBitrixIntegration: null,
    });
    updateUserTransfer({
      userTransfer: null,
      userTransferEnabled: false,
      userTriggerInstructions: '',
      selectedUsers: [],
      userBitrixIntegration: null,
    });
  }, [updateChannelTransfer, updateUserTransfer]);

  const handleEditTransfer = useCallback((transfer: Transfer) => {
    setEditingTransfer(transfer);
    setShowCreateForm(true);
    
    if (transfer.type === 'user') {
      const userTransfer = transfer as UserTransfer & { type: 'user' };
      updateUserTransfer({
        userTransfer: userTransfer as UserTransfer,
        userTransferEnabled: true,
        userTriggerInstructions: userTransfer.trigger_instructions || '',
        selectedUsers: userTransfer.users || [],
        userBitrixIntegration: userTransfer.bitrix_integration || null,
      });
      // Disable channel transfer when editing user transfer
      updateChannelTransfer({
        channelTransfer: null,
        channelTransferEnabled: false,
        channelTriggerInstructions: '',
        selectedChannels: [],
        channelBitrixIntegration: null,
      });
    } else {
      const channelTransfer = transfer as ChannelTransfer & { type: 'channel' };
      updateChannelTransfer({
        channelTransfer: channelTransfer as ChannelTransfer,
        channelTransferEnabled: true,
        channelTriggerInstructions: channelTransfer.trigger_instructions || '',
        selectedChannels: channelTransfer.channels || [],
        channelBitrixIntegration: channelTransfer.bitrix_integration || null,
      });
      // Disable user transfer when editing channel transfer
      updateUserTransfer({
        userTransfer: null,
        userTransferEnabled: false,
        userTriggerInstructions: '',
        selectedUsers: [],
        userBitrixIntegration: null,
      });
    }
    setMenuOpen(null);
  }, [updateUserTransfer, updateChannelTransfer]);

  const handleDeleteTransfer = useCallback(async (transfer: Transfer) => {
    if (!transfer.id) return;
    
    try {
      if (transfer.type === 'user') {
        await transferService.deleteUserTransfer(transfer.id);
      } else {
        await transferService.deleteChannelTransfer(transfer.id);
      }
      await refreshTransfers();
      setMenuOpen(null);
      // Success message will be shown via the hook's success state
    } catch (err: unknown) {
      // Error will be shown via the hook's error state
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transfer';
      console.error('Delete transfer error:', errorMessage);
    }
  }, [refreshTransfers]);

  const handleSave = useCallback(async () => {
    await saveSettings();
    await refreshTransfers();
    setShowCreateForm(false);
    setEditingTransfer(null);
  }, [saveSettings, refreshTransfers]);

  const handleCancel = useCallback(() => {
    setShowCreateForm(false);
    setEditingTransfer(null);
    updateUserTransfer({
      userTransfer: null,
      userTransferEnabled: false,
      userTriggerInstructions: '',
      selectedUsers: [],
      userBitrixIntegration: null,
    });
    updateChannelTransfer({
      channelTransfer: null,
      channelTransferEnabled: false,
      channelTriggerInstructions: '',
      selectedChannels: [],
      channelBitrixIntegration: null,
    });
  }, [updateUserTransfer, updateChannelTransfer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">Loading transfer settings…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Transfers List */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Transfers
        </h2>
        <div className="flex gap-2">
          {!hasChannelTransfer && (
            <button
              onClick={handleCreateChannelTransfer}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Channel Transfer
            </button>
          )}
          {!hasUserTransfer && (
            <button
              onClick={handleCreateUserTransfer}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              User Transfer
            </button>
          )}
        </div>
      </div>

      <TransferList
        transfers={allTransfers}
        menuOpen={menuOpen}
        onEdit={handleEditTransfer}
        onDelete={handleDeleteTransfer}
        onMenuToggle={setMenuOpen}
      />

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <ArrowRightLeft className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-card-foreground">
              {editingTransfer ? 'Edit Transfer' : 'Create Transfer'}
            </h2>
          </div>

          <div className="space-y-6 mb-8">
            {/* Channel Transfer Section */}
            <TransferOption
              label="Channel Transfer"
              checked={channelTransferEnabled}
              onChange={() => {
                if (channelTransferEnabled) {
                  updateChannelTransfer({ channelTransferEnabled: false });
                } else {
                  updateChannelTransfer({ channelTransferEnabled: true });
                  updateUserTransfer({ userTransferEnabled: false });
                }
              }}
            >
            {channelTransferEnabled && (
              <div className="space-y-4 mt-4">
                <BitrixIntegrationSelector
                  botId={botId}
                  selectedIntegrationId={channelBitrixIntegration}
                  onSelect={(integrationId) => updateChannelTransfer({ channelBitrixIntegration: integrationId })}
                  disabled={!bitrixIntegrationReady}
                />
                <TransferFormFields
                  triggerInstructions={channelTriggerInstructions}
                  onTriggerInstructionsChange={(value) =>
                    updateChannelTransfer({ channelTriggerInstructions: value })
                  }
                />
                <ChannelSelector
                  channels={channels}
                  selectedChannelIds={selectedChannels}
                  onSelect={(channelIds) => updateChannelTransfer({ selectedChannels: channelIds })}
                  disabled={!bitrixIntegrationReady}
                  loading={loadingChannels}
                  prerequisiteMessage={integrationPrerequisiteMessage}
                />
              </div>
            )}
            </TransferOption>

            {/* User Transfer Section */}
            <TransferOption
              label="User Transfer"
              checked={userTransferEnabled}
              onChange={() => {
                if (userTransferEnabled) {
                  updateUserTransfer({ userTransferEnabled: false });
                } else {
                  updateUserTransfer({ userTransferEnabled: true });
                  updateChannelTransfer({ channelTransferEnabled: false });
                }
              }}
            >
            {userTransferEnabled && (
              <div className="space-y-4 mt-4">
                <BitrixIntegrationSelector
                  botId={botId}
                  selectedIntegrationId={userBitrixIntegration}
                  onSelect={(integrationId) => updateUserTransfer({ userBitrixIntegration: integrationId })}
                  disabled={!bitrixIntegrationReady}
                />
                <TransferFormFields
                  triggerInstructions={userTriggerInstructions}
                  onTriggerInstructionsChange={(value) =>
                    updateUserTransfer({ userTriggerInstructions: value })
                  }
                />
                <UserSelector
                  users={users}
                  selectedUserIds={selectedUsers}
                  onSelect={(userIds) => updateUserTransfer({ selectedUsers: userIds })}
                  disabled={!bitrixIntegrationReady}
                  loading={loadingUsers}
                  prerequisiteMessage={integrationPrerequisiteMessage}
                />
              </div>
            )}
            </TransferOption>
          </div>

          {hasChanges && (
            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
