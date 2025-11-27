'use client';

import { Bot, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateBot?: () => void;
}

export function EmptyState({ onCreateBot }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/70 backdrop-blur-sm p-16 text-center">
      <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold text-card-foreground">
        No bots yet
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create your first assistant to start routing conversations and measuring
        performance.
      </p>
      {onCreateBot && (
        <button
          onClick={onCreateBot}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create bot
        </button>
      )}
    </div>
  );
}

