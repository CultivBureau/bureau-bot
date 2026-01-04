'use client';

import { KnowledgebaseItem } from './KnowledgebaseItem';

interface KnowledgebaseItem {
  id: string;
  name: string;
  type: string;
  size?: number;
  uploadedAt: string;
  description?: string;
}

interface KnowledgebaseListProps {
  items: KnowledgebaseItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function KnowledgebaseList({
  items,
  onEdit,
  onDelete,
}: KnowledgebaseListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
        <p className="text-muted-foreground">No knowledge base items yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <KnowledgebaseItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

