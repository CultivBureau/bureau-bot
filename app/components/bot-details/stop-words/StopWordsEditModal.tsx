'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';
import { Label } from '../../landing/ui/label';
import type { StopWord, StopWordMediaType } from '../../../types/stopWords';

interface StopWordsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { functionId?: string; text: string; equalInclude: boolean; mediaType: StopWordMediaType }) => void;
  stopWord?: StopWord | null;
  functions: Array<{ id: string; name: string }>;
  functionsLoading?: boolean;
  saving?: boolean;
}

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
        help: 'Enter a word or phrase the bot should ignore in text messages.',
      };
  }
};

const resolveFormText = (text: string, mediaType: StopWordMediaType) => (
  mediaType === 'text' ? text.trim() : `__media_only__${mediaType}`
);

export function StopWordsEditModal({
  isOpen,
  onClose,
  onSave,
  stopWord,
  functions,
  functionsLoading = false,
  saving = false,
}: StopWordsEditModalProps) {
  const [formData, setFormData] = useState({
    functionId: '',
    text: '',
    equalInclude: false,
    mediaType: 'text' as StopWordMediaType,
  });

  useEffect(() => {
    if (stopWord) {
      setFormData({
        functionId: stopWord.functionId || '',
        text: stopWord.text,
        equalInclude: stopWord.equalInclude,
        mediaType: stopWord.mediaType,
      });
    }
  }, [stopWord, isOpen]);

  const selectedFunctionName = functions.find((item) => item.id === formData.functionId)?.name;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedText = resolveFormText(formData.text, formData.mediaType);

    if (resolvedText) {
      onSave({
        functionId: formData.functionId,
        text: resolvedText,
        equalInclude: formData.mediaType === 'text' ? formData.equalInclude : false,
        mediaType: formData.mediaType,
      });
      setFormData({ functionId: '', text: '', equalInclude: false, mediaType: 'text' });
    }
  };

  const handleClose = () => {
    setFormData({ functionId: '', text: '', equalInclude: false, mediaType: 'text' });
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
              <Label htmlFor="media-type">Media Type *</Label>
              <select
                id="media-type"
                value={formData.mediaType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mediaType: e.target.value as StopWordMediaType,
                    equalInclude: e.target.value === 'text' ? prev.equalInclude : false,
                  }))
                }
                disabled={saving}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {mediaTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="function-id">Function</Label>
              <select
                id="function-id"
                value={formData.functionId}
                onChange={(e) => setFormData((prev) => ({ ...prev, functionId: e.target.value }))}
                disabled={saving || functionsLoading || functions.length === 0}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">{functionsLoading ? 'Loading functions...' : 'Select function'}</option>
                {functions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">Choose which function this rule belongs to.</p>
              {formData.functionId && (
                <p className="mt-1 text-xs text-foreground">
                  Selected function: <span className="font-medium">{selectedFunctionName || 'Unknown function'}</span>
                </p>
              )}
            </div>

            {formData.mediaType === 'text' ? (
              <div>
                <Label htmlFor="word">Text Stop Word *</Label>
                <Input
                  id="word"
                  value={formData.text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter text stop word"
                  required
                  disabled={saving}
                  autoFocus
                />
                <p className="mt-1 text-xs text-muted-foreground">{getTypeMeta('text').help}</p>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2">
                <p className="text-sm font-medium text-foreground">{getTypeMeta(formData.mediaType).title}</p>
                <p className="text-xs text-muted-foreground">{getTypeMeta(formData.mediaType).help}</p>
              </div>
            )}

            {formData.mediaType === 'text' && (
              <>
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
              </>
            )}

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
                disabled={
                  saving ||
                  (formData.mediaType === 'text' && !formData.text.trim())
                }
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
