'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { File, FileText as FileTextIcon, Link, Trash2, Edit, Eye, HardDrive, MoreVertical } from 'lucide-react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const isFileType = item.source_type === 'file';

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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-card shadow-lg z-10">
              <div className="py-1">
                {!isFileType && (
                  <>
                    <button
                      onClick={() => {
                        onView();
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        onEdit();
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    onDelete();
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary px-2 py-1">
          {item.source_type}
        </span>
      </div>
    </div>
  );
}

