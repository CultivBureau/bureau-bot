'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '../../landing/ui/button';

interface TransferConfirmationProps {
  botName: string;
  recipientEmail: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirming?: boolean;
}

export function TransferConfirmation({
  botName,
  recipientEmail,
  onConfirm,
  onCancel,
  confirming = false,
}: TransferConfirmationProps) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-card/70 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-destructive/15 p-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Confirm Transfer
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to transfer <strong>{botName}</strong> to{' '}
            <strong>{recipientEmail}</strong>?
          </p>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 mb-4">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              This action cannot be undone. You will lose all access to this bot
              and its configuration.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel} disabled={confirming}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={confirming}
              className="bg-destructive hover:bg-destructive/90"
            >
              {confirming ? 'Transferring...' : 'Confirm Transfer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

