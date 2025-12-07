'use client';

import { memo } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { formatDateTime } from '../../../utils/configure/formatters';
import type { Bot } from '../../../types/bot';

interface BotStatusCardProps {
  bot: Bot;
  onPay: () => void;
}

export const BotStatusCard = memo(function BotStatusCard({ bot, onPay }: BotStatusCardProps) {
  if (bot.working) {
    return (
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 p-4">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Bot is Active</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-card-foreground">Start Time</label>
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground min-w-0 overflow-hidden">
                <div className="truncate">{formatDateTime(bot.start_time)}</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-card-foreground">End Time</label>
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground min-w-0 overflow-hidden">
                <div className="truncate">{formatDateTime(bot.end_time)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-card-foreground">Bot is Inactive</h3>
        </div>
        <Button
          onClick={onPay}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pay
        </Button>
      </div>
    </div>
  );
});

