'use client';

import { memo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { TransferCard } from './TransferCard';
import type { UserTransfer, ChannelTransfer } from '../../../services/transfer';

type Transfer = (UserTransfer & { type: 'user' }) | (ChannelTransfer & { type: 'channel' });

interface TransferListProps {
  transfers: Transfer[];
  menuOpen: string | null;
  onEdit: (transfer: Transfer) => void;
  onDelete: (transfer: Transfer) => void;
  onMenuToggle: (transferId: string | null) => void;
}

export const TransferList = memo(function TransferList({
  transfers,
  menuOpen,
  onEdit,
  onDelete,
  onMenuToggle,
}: TransferListProps) {
  return (
    <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 space-y-6">
      {transfers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <ArrowRightLeft className="mb-4 h-12 w-12" />
          <p>No transfers created yet</p>
          <p className="text-sm">
            Create your first transfer to enable user or channel transfers.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {transfers.map((transfer) => (
            <TransferCard
              key={transfer.id}
              transfer={transfer}
              menuOpen={menuOpen}
              onEdit={onEdit}
              onDelete={onDelete}
              onMenuToggle={onMenuToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
});

