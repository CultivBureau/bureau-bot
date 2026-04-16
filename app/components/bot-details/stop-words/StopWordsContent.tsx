'use client';

import { useSearchParams } from 'next/navigation';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useStopWords } from './hooks/useStopWords';
import { StopWordsTable } from './StopWordsTable';
import { StopWordsCreateModal } from './StopWordsCreateModal';
import { StopWordsEditModal } from './StopWordsEditModal';
import { ConfirmationToast } from '../../shared/ConfirmationToast';

export function StopWordsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const {
    stopWords,
    loading,
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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Stop Words
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Stop Words
        </button>
      </div>

      {/* Table */}
      <StopWordsTable
        stopWords={stopWords}
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
        saving={creating}
      />

      {/* Edit Modal */}
      <StopWordsEditModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSave={handleEditStopWord}
        stopWord={editingWord}
        saving={updating}
      />

      {/* Delete Confirmation Toast */}
      <ConfirmationToast
        message={`Are you sure you want to delete the stop word "${deleteConfirmation.word?.text}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isOpen={deleteConfirmation.isOpen}
      />
    </div>
  );
}
