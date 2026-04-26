'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useStopWords } from './hooks/useStopWords';
import { StopWordsTable } from './StopWordsTable';
import { StopWordsCreateModal } from './StopWordsCreateModal';
import { StopWordsEditModal } from './StopWordsEditModal';
import { ConfirmationToast } from '../../shared/ConfirmationToast';
import type { StopWordMediaType } from '../../../types/stopWords';

const mediaFilterOptions: Array<{ value: 'all' | StopWordMediaType; label: string }> = [
  { value: 'all', label: 'All Media' },
  { value: 'text', label: 'Text' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
];

const getDeleteWordLabel = (mediaType?: StopWordMediaType, text?: string) => {
  if (!mediaType) {
    return text || '';
  }

  if (mediaType === 'text') {
    return text || '';
  }

  return `all ${mediaType} messages`;
};

export function StopWordsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');
  const [mediaFilter, setMediaFilter] = useState<'all' | StopWordMediaType>('all');

  const {
    stopWords,
    functions,
    loading,
    functionsLoading,
    error,
    success,
    showCreateModal,
    showEditModal,
    editingWord,
    creating,
    updating,
    deletingId,
    deleteConfirmation,
    setShowCreateModal,
    setError,
    setSuccess,
    handleCreateStopWords,
    handleEditStopWord,
    handleDeleteStopWord,
    confirmDelete,
    cancelDelete,
    openEditModal,
    closeEditModal,
  } = useStopWords(botId);

  const filteredStopWords = useMemo(() => {
    if (mediaFilter === 'all') {
      return stopWords;
    }

    return stopWords.filter((item) => item.mediaType === mediaFilter);
  }, [stopWords, mediaFilter]);

  if (!botId) {
    return (
      <div className="text-center text-muted-foreground">
        Please select a bot to manage its stop words.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-4 text-sm text-emerald-700 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Stop Words
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="media-filter" className="text-sm text-muted-foreground">
              Filter
            </label>
            <select
              id="media-filter"
              value={mediaFilter}
              onChange={(e) => setMediaFilter(e.target.value as 'all' | StopWordMediaType)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {mediaFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Stop Words
          </button>
        </div>
      </div>

      {/* Table */}
      <StopWordsTable
        stopWords={filteredStopWords}
        functions={functions}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDeleteStopWord}
        deletingId={deletingId}
      />

      {/* Create Modal */}
      <StopWordsCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateStopWords}
        functions={functions}
        functionsLoading={functionsLoading}
        saving={creating}
      />

      {/* Edit Modal */}
      <StopWordsEditModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSave={handleEditStopWord}
        stopWord={editingWord}
        functions={functions}
        functionsLoading={functionsLoading}
        saving={updating}
      />

      {/* Delete Confirmation Toast */}
      <ConfirmationToast
        message={`Are you sure you want to delete the stop word "${getDeleteWordLabel(deleteConfirmation.word?.mediaType, deleteConfirmation.word?.text)}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isOpen={deleteConfirmation.isOpen}
      />
    </div>
  );
}
