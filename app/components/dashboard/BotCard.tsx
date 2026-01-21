'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MoreVertical, Play, Pause, Edit, Power } from "lucide-react";
import type { BotData } from "../../types/bot";

interface BotCardProps {
  bot: BotData;
  onEdit?: (botId: string) => void;
  onToggleActive?: (botId: string) => void;
}

export function BotCard({ bot, onEdit, onToggleActive }: BotCardProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const isActive = bot.is_active;
  const statusClasses = isActive
    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
    : 'bg-secondary text-secondary-foreground';

  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-primary/50">
      <Link
        href={`/pages/bot-details/configure?botId=${bot.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Open ${bot.name}`}
      />

      {/* Menu Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenMenu(!openMenu);
        }}
        className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-secondary"
        aria-label="Open menu"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {openMenu && (
        <div className="absolute right-5 top-16 z-30 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(bot.id);
                setOpenMenu(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-card-foreground transition hover:bg-secondary"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
          {onToggleActive && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleActive(bot.id);
                setOpenMenu(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition ${
                isActive
                  ? 'text-orange-600 hover:bg-orange-500/10'
                  : 'text-green-600 hover:bg-green-500/10'
              }`}
            >
              <Power className="h-4 w-4" />
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      )}

      {/* Centered Content */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Circular Bot Image */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 overflow-hidden">
          <Image
            src="/Floating-Robot.png"
            alt="Bot"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Bot Name */}
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-xl font-semibold text-card-foreground">
            {bot.name}
          </h3>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusClasses}`}
          >
            {isActive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {isActive ? 'Active' : 'Inactive'}
          </span>
          {bot.working !== undefined && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                bot.working
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
              }`}
            >
              {bot.working ? 'Working' : 'Idle'}
            </span>
          )}
        </div>
      </div>

      {/* Bot Details */}
      <dl className="mt-6 space-y-2 text-sm text-center">
        <div className="flex flex-col items-center gap-1">
          <dt className="text-muted-foreground">Model</dt>
          <dd className="font-medium text-card-foreground">
            {bot.gpt_model ?? '—'}
          </dd>
        </div>
        {typeof bot.usage_count === 'number' && (
          <div className="flex flex-col items-center gap-1">
            <dt className="text-muted-foreground">Conversations</dt>
            <dd className="text-card-foreground">{bot.usage_count}</dd>
          </div>
        )}
        {typeof bot.total_sessions === 'number' && (
          <div className="flex flex-col items-center gap-1">
            <dt className="text-muted-foreground">Active sessions</dt>
            <dd className="text-card-foreground">{bot.total_sessions}</dd>
          </div>
        )}
      </dl>

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition group-hover:border-primary/30" />
    </div>
  );
}

