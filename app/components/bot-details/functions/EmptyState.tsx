'use client';

import { Code, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Code className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">
        No functions created yet
      </h3>
      <p className="mb-6 text-muted-foreground">
        Create your first function to get started with custom bot capabilities
      </p>
      <button 
        onClick={onCreateClick}
        className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="w-5 h-5" />
        Create First Function
      </button>
    </div>
  );
}

