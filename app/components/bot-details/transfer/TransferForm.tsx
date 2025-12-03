'use client';

import { useState } from 'react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';
import { Label } from '../../landing/ui/label';
import { Textarea } from '../../landing/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface TransferFormData {
  recipientEmail: string;
  recipientUserId?: string;
  message?: string;
}

interface TransferFormProps {
  botName: string;
  onTransfer: (data: TransferFormData) => void;
  onCancel: () => void;
  transferring?: boolean;
}

export function TransferForm({
  botName,
  onTransfer,
  onCancel,
  transferring = false,
}: TransferFormProps) {
  const [formData, setFormData] = useState<TransferFormData>({
    recipientEmail: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TransferFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TransferFormData, string>> = {};

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Recipient email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onTransfer(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Transfer Warning</p>
            <p>
              You are about to transfer <strong>{botName}</strong> to another user.
              This action will transfer ownership and you will lose access to this bot.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="recipientEmail">
          Recipient Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="recipientEmail"
          type="email"
          value={formData.recipientEmail}
          onChange={(e) =>
            setFormData({ ...formData, recipientEmail: e.target.value })
          }
          placeholder="user@example.com"
          required
          disabled={transferring}
          className={errors.recipientEmail ? 'border-destructive' : ''}
        />
        {errors.recipientEmail && (
          <p className="text-xs text-destructive mt-1">{errors.recipientEmail}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          placeholder="Add a message to the recipient..."
          disabled={transferring}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={transferring}>
          Cancel
        </Button>
        <Button type="submit" disabled={transferring} className="bg-destructive hover:bg-destructive/90">
          {transferring ? 'Transferring...' : 'Transfer Bot'}
        </Button>
      </div>
    </form>
  );
}

