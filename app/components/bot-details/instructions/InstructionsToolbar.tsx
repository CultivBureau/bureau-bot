'use client';

import { Save, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '../../landing/ui/button';

interface InstructionsToolbarProps {
  onSave: () => void;
  onCancel: () => void;
  onTogglePreview: () => void;
  previewMode: boolean;
  saving?: boolean;
  characterCount?: number;
}

export function InstructionsToolbar({
  onSave,
  onCancel,
  onTogglePreview,
  previewMode,
  saving = false,
  characterCount,
}: InstructionsToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 rounded-t-xl">
      <div className="flex items-center gap-4">
        <Button
          onClick={onTogglePreview}
          variant="outline"
          size="sm"
        >
          {previewMode ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Edit
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          )}
        </Button>
        {characterCount !== undefined && (
          <span className="text-sm text-muted-foreground">
            {characterCount.toLocaleString()} characters
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          disabled={saving}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={onSave}
          size="sm"
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

