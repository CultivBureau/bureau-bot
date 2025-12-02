'use client';

import { Code, Edit, Trash2 } from 'lucide-react';
import { Button } from '../landing/ui/button';

interface FunctionCardProps {
  id: string;
  name: string;
  description?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FunctionCard({
  id,
  name,
  description,
  onEdit,
  onDelete,
}: FunctionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="rounded-full bg-primary/15 p-2">
            <Code className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-1">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(id)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(id)}
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

