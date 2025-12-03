'use client';

import { FunctionCard } from './FunctionCard';
import { Plus, Code } from 'lucide-react';
import { Button } from '../../landing/ui/button';

interface Function {
  id: string;
  name: string;
  description?: string;
}

interface FunctionsListProps {
  functions: Function[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FunctionsList({
  functions,
  onAdd,
  onEdit,
  onDelete,
}: FunctionsListProps) {
  if (functions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
        <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          No functions yet
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add functions to extend your bot&apos;s capabilities.
        </p>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Function
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Functions ({functions.length})
        </h2>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Function
        </Button>
      </div>
      <div className="grid gap-4">
        {functions.map((func) => (
          <FunctionCard
            key={func.id}
            id={func.id}
            name={func.name}
            description={func.description}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

