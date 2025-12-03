'use client';

import { Textarea } from '../../landing/ui/textarea';
import { cn } from '../../landing/ui/utils';

interface InstructionsEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
}

export function InstructionsEditor({
  value,
  onChange,
  disabled = false,
  rows = 12,
}: InstructionsEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={cn(
        'font-mono text-sm',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      placeholder="Enter instructions for your bot..."
    />
  );
}

