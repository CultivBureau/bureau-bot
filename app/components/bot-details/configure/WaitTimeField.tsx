'use client';

import { Clock, Edit, Check, X } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';

interface WaitTimeFieldProps {
  value: number;
  editing: boolean;
  editValue: number;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: number) => void;
  saving?: boolean;
}

export function WaitTimeField({
  value,
  editing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  saving = false,
}: WaitTimeFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Wait Time (seconds)
      </label>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        {editing ? (
          <>
            <Input
              type="number"
              value={editValue}
              onChange={(e) => onChange(Number(e.target.value) || 0)}
              min="0"
              className="flex-1"
              disabled={saving}
            />
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
              className="flex-1 px-4 py-2 rounded-xl bg-card/50 text-card-foreground cursor-pointer hover:bg-card/70"
              onClick={onEdit}
            >
              {value || 0} seconds
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

