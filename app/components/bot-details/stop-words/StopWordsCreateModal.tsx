'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Label } from '../../landing/ui/label';
import { Input } from '../../landing/ui/input';
import type { StopWordMediaType } from '../../../types/stopWords';

interface StopWordCreateRow {
  id: string;
  functionId: string;
  mediaType: StopWordMediaType;
  text: string;
  equalInclude: boolean;
}

const makeRow = (): StopWordCreateRow => ({
  id: `row-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  functionId: '',
  mediaType: 'text',
  text: '',
  equalInclude: false,
});

const mediaTypeOptions: Array<{ value: StopWordMediaType; label: string }> = [
  { value: 'text', label: 'Text' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
];

const getTypeMeta = (mediaType: StopWordMediaType) => {
  switch (mediaType) {
    case 'audio':
      return {
        title: 'Audio Rule',
        help: 'This rule applies to all audio messages. No keyword text is required.',
      };
    case 'video':
      return {
        title: 'Video Rule',
        help: 'This rule applies to all video messages. No keyword text is required.',
      };
    case 'image':
      return {
        title: 'Image Rule',
        help: 'This rule applies to all image messages. No keyword text is required.',
      };
    default:
      return {
        title: 'Text Stop Word',
      };
  }
};

const resolveRowText = (row: StopWordCreateRow) => (
  row.mediaType === 'text' ? row.text.trim() : `__media_only__${row.mediaType}`
);

interface StopWordsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (words: Array<{ functionId: string; text: string; equalInclude: boolean; mediaType: StopWordMediaType }>) => void;
  functions: Array<{ id: string; name: string }>;
  functionsLoading?: boolean;
  saving?: boolean;
}

export function StopWordsCreateModal({
  isOpen,
  onClose,
  onSave,
  functions,
  functionsLoading = false,
  saving = false,
}: StopWordsCreateModalProps) {
  const [rows, setRows] = useState<StopWordCreateRow[]>([makeRow()]);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const words = rows
      .map((row) => ({
        functionId: row.functionId,
        text: resolveRowText(row),
        equalInclude: row.mediaType === 'text' ? row.equalInclude : false,
        mediaType: row.mediaType,
      }))
      .filter((row) => row.functionId.length > 0 && (row.mediaType !== 'text' || row.text.length > 0));

    if (words.length === 0) {
      setFormError('Please choose a function and add at least one valid stop-word rule before submitting.');
      return;
    }

    setFormError('');
    onSave(words);
    setRows([makeRow()]);
  };

  const handleClose = () => {
    setRows([makeRow()]);
    setFormError('');
    onClose();
  };

  const updateRow = (id: string, patch: Partial<StopWordCreateRow>) => {
    setFormError('');
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      if (prev.length === 1) {
        return [{ ...prev[0], functionId: '', mediaType: 'text', text: '', equalInclude: false }];
      }
      return prev.filter((row) => row.id !== id);
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, makeRow()]);
  };

  const validCountComputed = rows.filter(
    (row) => row.functionId.length > 0 && (row.mediaType !== 'text' || row.text.trim().length > 0)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-card-foreground">
            Add Stop Words
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Stop Words *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Choose a function and media type first. Text needs a stop word phrase, while audio/video/image apply as media-level rules.
              </p>

              {formError && (
                <p className="mb-2 text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <div className="space-y-3">
                {rows.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-3">
                      <select
                        value={row.mediaType}
                        onChange={(e) =>
                          updateRow(row.id, {
                            mediaType: e.target.value as StopWordMediaType,
                            equalInclude: e.target.value === 'text' ? row.equalInclude : false,
                          })
                        }
                        disabled={saving}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                        aria-label={`Media type for row ${index + 1}`}
                      >
                        {mediaTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <select
                        value={row.functionId}
                        onChange={(e) => updateRow(row.id, { functionId: e.target.value })}
                        disabled={saving || functionsLoading || functions.length === 0}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                        aria-label={`Function for row ${index + 1}`}
                      >
                        <option value="">{functionsLoading ? 'Loading functions...' : 'Select function'}</option>
                        {functions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-muted-foreground">Choose which function this rule belongs to.</p>
                    </div>
                    {row.mediaType === 'text' ? (
                      <div className="col-span-5">
                        <Label htmlFor={`word-${row.id}`} className="sr-only">
                          Text stop word for row {index + 1}
                        </Label>
                        <Input
                          id={`word-${row.id}`}
                          value={row.text}
                          onChange={(e) => updateRow(row.id, { text: e.target.value })}
                          placeholder={`Text stop word ${index + 1}`}
                          disabled={saving}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {getTypeMeta('text').help}
                        </p>
                      </div>
                    ) : (
                      <div className="col-span-5 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2">
                        <p className="text-sm font-medium text-foreground">{getTypeMeta(row.mediaType).title}</p>
                        <p className="text-xs text-muted-foreground">{getTypeMeta(row.mediaType).help}</p>
                      </div>
                    )}
                    <div className="col-span-1" />
                    {row.mediaType === 'text' && (
                      <div className="col-span-5 col-start-7">
                        <label
                          htmlFor={`equal-include-${row.id}`}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <input
                            id={`equal-include-${row.id}`}
                            type="checkbox"
                            checked={row.equalInclude}
                            onChange={(e) =>
                              updateRow(row.id, { equalInclude: e.target.checked })
                            }
                            disabled={saving}
                            className="h-4 w-4 rounded border-border"
                            aria-describedby={`equal-include-help-${row.id}`}
                          />
                          Exact Match
                        </label>
                        <span id={`equal-include-help-${row.id}`} className="sr-only">
                          Enabled means exact word match only. Disabled means include or contains match.
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={saving}
                      className="col-span-1 inline-flex items-center justify-center rounded-lg p-2 text-destructive/80 hover:bg-destructive/10 disabled:opacity-50"
                      aria-label="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addRow}
                disabled={saving}
                className="mt-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>

              {validCountComputed > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {validCountComputed} valid row{validCountComputed !== 1 ? 's' : ''} ready to submit
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || validCountComputed === 0}
              >
                {saving ? 'Adding...' : 'Add Stop Words'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
