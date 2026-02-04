'use client';

import { memo } from 'react';
import { Code } from 'lucide-react';
import { FunctionCard } from './FunctionCard';
import type { FunctionData } from '../../../types/functions';

interface FunctionListProps {
  functions: FunctionData[];
  menuOpen: string | null;
  onView: (func: FunctionData) => void;
  onEdit: (func: FunctionData) => void;
  onDelete: (func: FunctionData) => void;
  onMenuToggle: (functionId: string | null) => void;
}

export const FunctionList = memo(function FunctionList({
  functions,
  menuOpen,
  onView,
  onEdit,
  onDelete,
  onMenuToggle,
}: FunctionListProps) {
  return (
    <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 space-y-6">
        {functions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Code className="mb-4 h-12 w-12" />
            <p>No functions created yet</p>
            <p className="text-sm">
              Create your first function to add custom capabilities to your bot.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {functions.map((func) => (
              <FunctionCard
                key={func.id}
                function={func}
                menuOpen={menuOpen}
                onView={onView}
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

