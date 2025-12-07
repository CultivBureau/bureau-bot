'use client';

import { memo } from 'react';
import { Plus } from 'lucide-react';
import { FunctionCard } from './FunctionCard';
import { EmptyState } from './EmptyState';
import type { FunctionData } from '../../../types/functions';

interface FunctionListProps {
  functions: FunctionData[];
  menuOpen: string | null;
  onCreateClick: () => void;
  onView: (func: FunctionData) => void;
  onEdit: (func: FunctionData) => void;
  onDelete: (func: FunctionData) => void;
  onMenuToggle: (functionId: string | null) => void;
}

export const FunctionList = memo(function FunctionList({
  functions,
  menuOpen,
  onCreateClick,
  onView,
  onEdit,
  onDelete,
  onMenuToggle,
}: FunctionListProps) {
  if (functions.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-card-foreground">
          Functions ({functions.length})
        </h2>
        <button 
          onClick={onCreateClick}
          className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Function
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
});

