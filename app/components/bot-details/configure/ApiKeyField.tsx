'use client';

import { Key, Edit, Check, X } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';
import { cn } from '../../landing/ui/utils';

interface ApiKeyFieldProps {
  value: string;
  editing: boolean;
  editValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  saving?: boolean;
  disabled?: boolean;
}

export function ApiKeyField({
  value,
  editing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  saving = false,
  disabled = false,
}: ApiKeyFieldProps) {

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        OpenAI API Key
      </label>
      <div className="flex items-center gap-2 min-w-0">
        <Key className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        {editing ? (
          <>
            <div className="flex-1 relative min-w-0">
              <Input
                type="text"
                value={editValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder="sk-..."
                className="min-w-0"
                disabled={saving}
              />
            </div>
            <Button
              onClick={onSave}
              disabled={saving}
              size="sm"
              className="flex-shrink-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              onClick={onCancel}
              disabled={saving}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex-1 relative min-w-0">
              <div
                className={cn(
                  "px-4 py-2 rounded-xl bg-card/50 text-card-foreground font-mono text-sm overflow-hidden",
                  disabled ? "cursor-default" : "cursor-pointer hover:bg-card/70"
                )}
                onClick={disabled ? undefined : onEdit}
              >
                <div className="truncate">
                  {value || 'Not set'}
                </div>
              </div>
            </div>
            {!disabled && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

