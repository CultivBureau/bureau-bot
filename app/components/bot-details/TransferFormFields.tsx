'use client';

interface TransferFormFieldsProps {
  additionalDescription: string;
  botResponse: string;
  onAdditionalDescriptionChange: (value: string) => void;
  onBotResponseChange: (value: string) => void;
}

export function TransferFormFields({
  additionalDescription,
  botResponse,
  onAdditionalDescriptionChange,
  onBotResponseChange,
}: TransferFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Additional Function Description (Maximum 868 characters)
        </label>
        <textarea
          value={additionalDescription}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 868) {
              onAdditionalDescriptionChange(value);
            }
          }}
          placeholder="Type additional response here..."
          rows={6}
          maxLength={868}
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground resize-y"
        />
        <p className="text-xs text-muted-foreground">
          {additionalDescription.length} / 868 characters
        </p>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Bot Response
        </label>
        <textarea
          value={botResponse}
          onChange={(e) => onBotResponseChange(e.target.value)}
          placeholder="Type bot response here..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground resize-y"
        />
      </div>
    </>
  );
}

