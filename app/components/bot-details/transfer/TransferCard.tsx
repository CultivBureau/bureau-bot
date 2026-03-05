'use client';

import { memo } from 'react';
import { ArrowRightLeft, Users, Hash, Edit, Trash2, MoreVertical } from 'lucide-react';
import type { UserTransfer, ChannelTransfer } from '../../../services/transfer';

type Transfer = (UserTransfer & { type: 'user' }) | (ChannelTransfer & { type: 'channel' });

interface TransferCardProps {
  transfer: Transfer;
  menuOpen: string | null;
  onEdit: (transfer: Transfer) => void;
  onDelete: (transfer: Transfer) => void;
  onMenuToggle: (transferId: string | null) => void;
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export const TransferCard = memo(function TransferCard({
  transfer,
  menuOpen,
  onEdit,
  onDelete,
  onMenuToggle,
}: TransferCardProps) {
  const isUserTransfer = transfer.type === 'user';
  const transferId = transfer.id || '';
  const count = isUserTransfer 
    ? (transfer as UserTransfer).users?.length || 0
    : (transfer as ChannelTransfer).channels?.length || 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2 ${
            isUserTransfer ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
          }`}>
            {isUserTransfer ? (
              <Users className="w-5 h-5" />
            ) : (
              <Hash className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground">
              {isUserTransfer ? 'User Transfer' : 'Channel Transfer'}
            </h4>
            <p className="text-xs text-muted-foreground">
              Created {formatDate(transfer.created_on)}
            </p>
          </div>
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMenuToggle(menuOpen === transferId ? null : transferId)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen === transferId && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => onMenuToggle(null)}
              />
              <div className="absolute right-0 top-8 w-48 rounded-xl border border-border bg-card z-20 shadow-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(transfer);
                    onMenuToggle(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary flex items-center gap-2 text-card-foreground"
                >
                  <Edit className="w-4 h-4" />
                  Edit Transfer
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(transfer);
                    onMenuToggle(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
          {count} {isUserTransfer ? 'user' : 'channel'}{count !== 1 ? 's' : ''}
        </span>
        <span className={`rounded-full px-2.5 py-1 ${
          isUserTransfer 
            ? 'bg-blue-500/10 text-blue-500' 
            : 'bg-purple-500/10 text-purple-500'
        }`}>
          {isUserTransfer ? 'User' : 'Channel'}
        </span>
      </div>

      {transfer.trigger_instructions && (
        <div className="mt-3 text-xs text-muted-foreground line-clamp-2">
          {transfer.trigger_instructions}
        </div>
      )}
    </div>
  );
});

