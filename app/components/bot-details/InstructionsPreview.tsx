'use client';

interface InstructionsPreviewProps {
  value: string;
}

export function InstructionsPreview({ value }: InstructionsPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-6">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans">
          {value || 'No instructions to preview'}
        </pre>
      </div>
    </div>
  );
}

