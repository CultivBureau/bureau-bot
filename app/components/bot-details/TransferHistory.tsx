'use client';

import { Calendar, ArrowRight } from 'lucide-react';

interface TransferRecord {
  id: string;
  transferredTo: string;
  transferredFrom: string;
  transferredAt: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransferHistoryProps {
  transfers: TransferRecord[];
}

export function TransferHistory({ transfers }: TransferHistoryProps) {
  if (transfers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
        <p className="text-muted-foreground">No transfer history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">
        Transfer History
      </h3>
      <div className="space-y-3">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="rounded-xl border border-border bg-card/70 backdrop-blur-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Transferred to: {transfer.transferredTo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    From: {transfer.transferredFrom}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(transfer.transferredAt).toLocaleDateString()}
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    transfer.status === 'completed'
                      ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                      : transfer.status === 'pending'
                      ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                      : 'bg-destructive/15 text-destructive'
                  }`}
                >
                  {transfer.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

