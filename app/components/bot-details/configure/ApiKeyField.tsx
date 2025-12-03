'use client';

import { useState } from 'react';
import { Key, Edit, Check, X, Eye, EyeOff } from 'lucide-react';
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
}: ApiKeyFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        OpenAI API Key
      </label>
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        {editing ? (
          <>
            <div className="flex-1 relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={editValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
                disabled={saving}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
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
            <div
              className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground font-mono text-sm cursor-pointer hover:bg-card/70"
              onClick={onEdit}
            >
              {value ? `${value.substring(0, 12)}...` : 'Not set'}
            </div>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

