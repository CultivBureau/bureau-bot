'use client';

import { ReactNode } from 'react';
import { File, FileText as FileTextIcon, Link, Trash2, Edit, Eye, HardDrive } from 'lucide-react';
import { KnowledgeBaseItem } from '../shared/hooks/useKnowledgebase';

interface KnowledgebaseItemCardProps {
  item: KnowledgeBaseItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
  formatFileSize: (bytes: number) => string;
  getFileIcon: (sourceType: string, fileType?: string) => ReactNode;
}

export function KnowledgebaseItemCard({
  item,
  isExpanded,
  onToggleExpand,
  onDelete,
  onEdit,
  onView,
  formatFileSize,
  getFileIcon,
}: KnowledgebaseItemCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-secondary p-2 text-card-foreground">
            {getFileIcon(item.source_type)}
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground">
              {item.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              Added {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onToggleExpand}
            className="rounded-full border border-border p-1 text-xs text-muted-foreground hover:bg-secondary"
          >
            {isExpanded ? 'Hide' : 'Details'}
          </button>
          <button
            onClick={onDelete}
            className="rounded-full border border-red-200 p-1 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary px-2 py-1">
          {item.source_type}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
          {item.content && (
            <div className="rounded-xl bg-secondary/50 p-3 text-card-foreground">
              {item.content.length > 200
                ? `${item.content.slice(0, 200)}…`
                : item.content}
            </div>
          )}
          {item.source_type !== 'file' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onView}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-card-foreground hover:bg-secondary"
              >
                <Eye className="h-3 w-3" />
                View
              </button>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-card-foreground hover:bg-secondary"
              >
                <Edit className="h-3 w-3" />
                Edit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

