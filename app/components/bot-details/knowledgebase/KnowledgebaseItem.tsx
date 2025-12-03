'use client';

import { FileText, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '../../landing/ui/button';

interface KnowledgebaseItem {
  id: string;
  name: string;
  type: string;
  size?: number;
  uploadedAt: string;
  description?: string;
}

interface KnowledgebaseItemProps {
  item: KnowledgebaseItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

export function KnowledgebaseItem({
  item,
  onEdit,
  onDelete,
  onDownload,
}: KnowledgebaseItemProps) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="rounded-full bg-primary/15 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span>{item.type}</span>
              <span>{formatSize(item.size)}</span>
              <span>
                {new Date(item.uploadedAt).toLocaleDateString()}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onDownload(item.id)}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onEdit(item.id)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(item.id)}
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

