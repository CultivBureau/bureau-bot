'use client';

import { FileText, Edit, Check, X } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Textarea } from '../../landing/ui/textarea';

interface InstructionsFieldProps {
  value: string;
  editing: boolean;
  editValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  saving?: boolean;
}

export function InstructionsField({
  value,
  editing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  saving = false,
}: InstructionsFieldProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <label className="block text-sm font-medium text-card-foreground">
        Instructions
      </label>
      <div className="flex items-start gap-2">
        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-2" />
        {editing ? (
          <div className="flex-1 space-y-2">
            <Textarea
              value={editValue}
              onChange={(e) => onChange(e.target.value)}
              rows={6}
              className="w-full"
              disabled={saving}
            />
            <div className="flex gap-2">
              <Button
                onClick={onSave}
                disabled={saving}
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={onCancel}
                disabled={saving}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <div
              className="px-4 py-3 rounded-xl bg-card/50 text-card-foreground cursor-pointer hover:bg-card/70 whitespace-pre-wrap min-h-[100px]"
              onClick={onEdit}
            >
              {value || 'No instructions set'}
            </div>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Instructions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

