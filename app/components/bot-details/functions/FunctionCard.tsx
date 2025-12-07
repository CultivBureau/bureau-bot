'use client';

import { memo, useState } from 'react';
import { Settings, Edit, Trash2 } from 'lucide-react';
import type { FunctionData } from '../../../types/functions';

interface FunctionCardProps {
  function: FunctionData;
  menuOpen: string | null;
  onView: (func: FunctionData) => void;
  onEdit: (func: FunctionData) => void;
  onDelete: (func: FunctionData) => void;
  onMenuToggle: (functionId: string | null) => void;
}

export const FunctionCard = memo(function FunctionCard({
  function: func,
  menuOpen,
  onView,
  onEdit,
  onDelete,
  onMenuToggle,
}: FunctionCardProps) {
  return (
    <div 
      onClick={() => onView(func)}
      className="p-4 rounded-xl border border-border bg-card/50 relative cursor-pointer hover:bg-card/70 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-card-foreground">
          {func.name}
        </h3>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onMenuToggle(menuOpen === func.id ? null : func.id)}
            className="p-1 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {menuOpen === func.id && (
            <div className="absolute right-0 top-8 w-48 rounded-lg border border-border bg-card z-10 shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(func);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(func);
                  onMenuToggle(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm mb-3 text-muted-foreground">
        {func.instruction ? func.instruction.substring(0, 100) + '...' : 'No description'}
      </p>
      <div className="text-xs text-muted-foreground">
        {func.properties.length} properties • {func.phase || 'No phase'}
      </div>
    </div>
  );
});
