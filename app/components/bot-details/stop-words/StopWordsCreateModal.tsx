'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Label } from '../../landing/ui/label';
import { Input } from '../../landing/ui/input';

interface StopWordCreateRow {
  id: string;
  text: string;
  equalInclude: boolean;
}

const makeRow = (): StopWordCreateRow => ({
  id: `row-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  text: '',
  equalInclude: false,
});

interface StopWordsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (words: Array<{ text: string; equalInclude: boolean }>) => void;
  saving?: boolean;
}

export function StopWordsCreateModal({
  isOpen,
  onClose,
  onSave,
  saving = false,
}: StopWordsCreateModalProps) {
  const [rows, setRows] = useState<StopWordCreateRow[]>([makeRow()]);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const words = rows
      .map((row) => ({
        text: row.text.trim(),
        equalInclude: row.equalInclude,
      }))
      .filter((row) => row.text.length > 0);

    if (words.length === 0) {
      setFormError('Please add at least one stop word before submitting.');
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
        return [{ ...prev[0], text: '', equalInclude: false }];
      }
      return prev.filter((row) => row.id !== id);
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, makeRow()]);
  };

  const validCount = rows.filter((row) => row.text.trim().length > 0).length;

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
                Add one or more stop words in a single submit. Choose match mode per row.
              </p>

              {formError && (
                <p className="mb-2 text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <div className="space-y-3">
                {rows.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-7">
                      <Input
                        value={row.text}
                        onChange={(e) => updateRow(row.id, { text: e.target.value })}
                        placeholder={`Stop word ${index + 1}`}
                        disabled={saving}
                      />
                    </div>
                    <label
                      htmlFor={`equal-include-${row.id}`}
                      className="col-span-4 flex items-center gap-2 text-sm text-foreground"
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

              {validCount > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {validCount} valid row{validCount !== 1 ? 's' : ''} ready to submit
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
                disabled={saving || validCount === 0}
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
