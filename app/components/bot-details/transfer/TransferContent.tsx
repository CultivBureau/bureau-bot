'use client';

import { useSearchParams } from 'next/navigation';
import { Save, X, ArrowRightLeft, Loader2 } from 'lucide-react';
import { useTransferSettings } from '../shared/hooks/useTransferSettings';
import { TransferOption } from './TransferOption';
import { ChannelSelector } from './ChannelSelector';
import { UserSelector } from './UserSelector';
import { TransferFormFields } from './TransferFormFields';

export function TransferContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const {
    settings,
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
  } = useTransferSettings(botId);

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

      <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <ArrowRightLeft className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-card-foreground">
            Transfer Settings
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          <TransferOption
            label="Channel Transfer?"
            checked={settings.channel_transfer}
            onChange={() => updateSettings({ channel_transfer: !settings.channel_transfer })}
          >
            <TransferFormFields
              additionalDescription={settings.channel_additional_function_description || ''}
              botResponse={settings.channel_bot_response || ''}
              onAdditionalDescriptionChange={(value) =>
                updateSettings({ channel_additional_function_description: value })
              }
              onBotResponseChange={(value) =>
                updateSettings({ channel_bot_response: value })
              }
            />
            <ChannelSelector
              channels={channels}
              selectedChannelId={settings.selected_channels}
              onSelect={(channelId) => updateSettings({ selected_channels: channelId })}
              disabled={!bitrixIntegrationReady}
              loading={loadingChannels}
              prerequisiteMessage={integrationPrerequisiteMessage}
            />
          </TransferOption>

          <TransferOption
            label="User Transfer?"
            checked={settings.user_transfer}
            onChange={() => updateSettings({ user_transfer: !settings.user_transfer })}
          >
            <TransferFormFields
              additionalDescription={settings.user_additional_function_description || ''}
              botResponse={settings.user_bot_response || ''}
              onAdditionalDescriptionChange={(value) =>
                updateSettings({ user_additional_function_description: value })
              }
              onBotResponseChange={(value) =>
                updateSettings({ user_bot_response: value })
              }
            />
            <UserSelector
              users={users}
              selectedUserIds={settings.selected_users || ''}
              onSelect={(userIds) => updateSettings({ selected_users: userIds })}
              disabled={!bitrixIntegrationReady}
              loading={loadingUsers}
              prerequisiteMessage={integrationPrerequisiteMessage}
            />
          </TransferOption>

          <TransferOption
            label="Condition for the bot to leave the chat"
            checked={settings.bot_leave_chat_condition}
            onChange={() => updateSettings({ bot_leave_chat_condition: !settings.bot_leave_chat_condition })}
          >
            <TransferFormFields
              additionalDescription={settings.leave_additional_function_description || ''}
              botResponse={settings.leave_bot_response || ''}
              onAdditionalDescriptionChange={(value) =>
                updateSettings({ leave_additional_function_description: value })
              }
              onBotResponseChange={(value) =>
                updateSettings({ leave_bot_response: value })
              }
            />
          </TransferOption>
        </div>

        {hasChanges && (
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              onClick={cancelChanges}
              className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={saveSettings}
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
    </div>
  );
}
