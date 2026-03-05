'use client';

interface TransferFormFieldsProps {
  triggerInstructions: string;
  onTriggerInstructionsChange: (value: string) => void;
}

export function TransferFormFields({
  triggerInstructions,
  onTriggerInstructionsChange,
}: TransferFormFieldsProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Trigger Instructions <span className="text-destructive">*</span>
      </label>
      <p className="text-xs text-muted-foreground mb-2">
        Instructions for when to trigger this transfer
      </p>
      <textarea
        value={triggerInstructions}
        onChange={(e) => onTriggerInstructionsChange(e.target.value)}
        placeholder="Enter instructions for when to trigger this transfer..."
        rows={6}
        required
        minLength={1}
        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground resize-y"
      />
    </div>
  );
}

