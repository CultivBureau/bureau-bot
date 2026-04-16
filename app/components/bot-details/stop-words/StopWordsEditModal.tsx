'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';
import { Label } from '../../landing/ui/label';
import type { StopWord } from '../../../types/stopWords';

interface StopWordsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { text: string; equalInclude: boolean }) => void;
  stopWord?: StopWord | null;
  saving?: boolean;
}

export function StopWordsEditModal({
  isOpen,
  onClose,
  onSave,
  stopWord,
  saving = false,
}: StopWordsEditModalProps) {
  const [formData, setFormData] = useState({
    text: '',
    equalInclude: false,
  });

  useEffect(() => {
    if (stopWord) {
      setFormData({
        text: stopWord.text,
        equalInclude: stopWord.equalInclude,
      });
    }
  }, [stopWord, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.text.trim()) {
      onSave({
        text: formData.text.trim(),
        equalInclude: formData.equalInclude,
      });
      setFormData({ text: '', equalInclude: false });
    }
  };

  const handleClose = () => {
    setFormData({ text: '', equalInclude: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-card-foreground">
            Edit Stop Word
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
              <Label htmlFor="word">Stop Word *</Label>
              <Input
                id="word"
                value={formData.text}
                onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
                placeholder="Enter stop word"
                required
                disabled={saving}
                autoFocus
              />
            </div>

            <label htmlFor="edit-equal-include" className="flex items-center gap-2 text-sm text-foreground">
              <input
                id="edit-equal-include"
                type="checkbox"
                checked={formData.equalInclude}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, equalInclude: e.target.checked }))
                }
                disabled={saving}
                className="h-4 w-4 rounded border-border"
                aria-describedby="edit-equal-include-help"
              />
              Exact Match
            </label>
            <p id="edit-equal-include-help" className="text-xs text-muted-foreground">
              Enabled means exact word match only. Disabled means include or contains match.
            </p>

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
                disabled={saving || !formData.text.trim()}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
