'use client';

import { Edit, Check, X } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';
import { cn } from '../../landing/ui/utils';

interface ConfigFieldProps {
  label: string;
  value: string | number;
  editing: boolean;
  editValue: string | number;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'password';
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  saving?: boolean;
}

export function ConfigField({
  label,
  value,
  editing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  type = 'text',
  placeholder,
  icon,
  disabled = false,
  saving = false,
}: ConfigFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {icon && (
          <div className="text-muted-foreground flex-shrink-0">{icon}</div>
        )}
        {editing ? (
          <>
            <Input
              type={type}
              value={editValue}
              onChange={(e) =>
                onChange(type === 'number' ? Number(e.target.value) : e.target.value)
              }
              placeholder={placeholder}
              className="flex-1"
              disabled={disabled || saving}
            />
            <Button
              onClick={onSave}
              disabled={disabled || saving}
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
            <div
              className={cn(
                'flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground',
                !disabled && 'cursor-pointer hover:bg-card/70'
              )}
              onClick={!disabled ? onEdit : undefined}
            >
              {type === 'password' && typeof value === 'string'
                ? `${value.substring(0, 12)}...`
                : value}
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

