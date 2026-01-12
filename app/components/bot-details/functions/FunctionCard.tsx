'use client';

import { memo } from 'react';
import { Code, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import type { FunctionData } from '../../../types/functions';

interface FunctionCardProps {
  function: FunctionData;
  menuOpen: string | null;
  onView: (func: FunctionData) => void;
  onEdit: (func: FunctionData) => void;
  onDelete: (func: FunctionData) => void;
  onMenuToggle: (functionId: string | null) => void;
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

export const FunctionCard = memo(function FunctionCard({
  function: func,
  menuOpen,
  onView,
  onEdit,
  onDelete,
  onMenuToggle,
}: FunctionCardProps) {
  const propertyCount = func.properties?.length || 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground">
              {func.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              Created {formatDate(func.created_at)}
            </p>
          </div>
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMenuToggle(menuOpen === func.id ? null : func.id)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen === func.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => onMenuToggle(null)}
              />
              <div className="absolute right-0 top-8 w-48 rounded-xl border border-border bg-card z-20 shadow-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(func);
                    onMenuToggle(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary flex items-center gap-2 text-card-foreground"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(func);
                    onMenuToggle(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary flex items-center gap-2 text-card-foreground"
                >
                  <Edit className="w-4 h-4" />
                  Edit Function
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(func);
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
          {propertyCount} {propertyCount === 1 ? 'field' : 'fields'}
        </span>
        {func.phase && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
            {func.phase}
          </span>
        )}
      </div>

      {func.instruction && (
        <div className="mt-3 text-xs text-muted-foreground line-clamp-2">
          {func.instruction}
        </div>
      )}
    </div>
  );
});
