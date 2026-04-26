import { useState, useEffect, useCallback } from 'react';
import { stopWordsService } from '../../../../services/stopWords';
import { functionsService } from '../../../../services/functions';
import type { StopWord, StopWordMediaType } from '../../../../types/stopWords';

interface StopWordCreateInput {
  functionId: string;
  text: string;
  equalInclude: boolean;
  mediaType: StopWordMediaType;
}

interface StopWordFunctionOption {
  id: string;
  name: string;
}

const normalizeStopWordInputs = (items: StopWordCreateInput[]) => {
  const cleaned = items
    .map((item) => ({
      functionId: item.functionId,
      text: item.text.trim(),
      mediaType: item.mediaType,
      equalInclude: item.mediaType === 'text' ? item.equalInclude : false,
    }))
    .filter((item) => item.functionId.length > 0 && item.text.length > 0);

  const unique = new Map<string, StopWordCreateInput>();
  cleaned.forEach((item) => {
    const key = `${item.functionId}::${item.mediaType}::${item.text.toLowerCase()}::${item.equalInclude ? '1' : '0'}`;
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  });

  return {
    cleaned,
    deduped: Array.from(unique.values()),
  };
};

export function useStopWords(botId: string | null) {
  const [stopWords, setStopWords] = useState<StopWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [functionsLoading, setFunctionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [functions, setFunctions] = useState<StopWordFunctionOption[]>([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWord, setEditingWord] = useState<StopWord | null>(null);

  // Operation states
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    word: StopWord | null;
  }>({ isOpen: false, word: null });

  const fetchStopWords = useCallback(async () => {
    if (!botId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await stopWordsService.getStopWords(botId);
      setStopWords(response);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch stop words');
    } finally {
      setLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    fetchStopWords();
  }, [fetchStopWords]);

  const fetchFunctions = useCallback(async () => {
    if (!botId) {
      setFunctions([]);
      return;
    }

    try {
      setFunctionsLoading(true);
      const response = await functionsService.getFunctions({
        bot_id: botId,
        pageNumber: 1,
        pageSize: 100,
      });

      const mapped = (response.results || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));

      setFunctions(mapped);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch functions');
    } finally {
      setFunctionsLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    fetchFunctions();
  }, [fetchFunctions]);

  const handleCreateStopWords = useCallback(async (newWords: StopWordCreateInput[]) => {
    if (!botId) {
      setError('No bot ID provided. Please select a bot first.');
      return;
    }

    if (newWords.length === 0) {
      setError('Please enter at least one stop word.');
      return;
    }

    const { cleaned, deduped } = normalizeStopWordInputs(newWords);
    if (deduped.length === 0) {
      setError('Please enter at least one valid stop word.');
      return;
    }

    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await stopWordsService.createStopWords(botId, deduped);

      const skipped = cleaned.length - deduped.length;
      if (skipped > 0) {
        setSuccess(
          `Created ${deduped.length} stop word(s). Skipped ${skipped} duplicate row(s).`
        );
      } else {
        setSuccess(`Created ${deduped.length} stop word(s) successfully.`);
      }

      setShowCreateModal(false);
      await fetchStopWords();
    } catch (err: any) {
      setError(err?.message || 'Failed to create stop words');
    } finally {
      setCreating(false);
    }
  }, [botId, fetchStopWords]);

  const handleEditStopWord = useCallback(async (updatedWord: StopWordCreateInput) => {
    if (!editingWord) {
      setError('Cannot update stop word.');
      return;
    }

    if (!updatedWord.functionId) {
      setError('Please choose a function.');
      return;
    }

    if (!updatedWord.text.trim()) {
      setError('Please enter a valid stop word.');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await stopWordsService.updateStopWord(editingWord.id, {
        direct_function_id: updatedWord.functionId || null,
        text: updatedWord.text.trim(),
        equal_include: updatedWord.mediaType === 'text' ? updatedWord.equalInclude : false,
        media_type: updatedWord.mediaType,
      });
      setSuccess('Stop word updated successfully!');
      setShowEditModal(false);
      setEditingWord(null);
      await fetchStopWords();
    } catch (err: any) {
      setError(err?.message || 'Failed to update stop word');
    } finally {
      setUpdating(false);
    }
  }, [editingWord, fetchStopWords]);

  const handleDeleteStopWord = useCallback((word: StopWord) => {
    setDeleteConfirmation({ isOpen: true, word });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmation.word) return;

    try {
      setDeletingId(deleteConfirmation.word.id);
      await stopWordsService.deleteStopWord(deleteConfirmation.word.id);
      setSuccess('Stop word deleted successfully!');
      await fetchStopWords();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete stop word');
    } finally {
      setDeletingId(null);
      setDeleteConfirmation({ isOpen: false, word: null });
    }
  }, [deleteConfirmation.word, fetchStopWords]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmation({ isOpen: false, word: null });
  }, []);

  const openEditModal = useCallback((word: StopWord) => {
    setEditingWord(word);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditingWord(null);
    setShowEditModal(false);
  }, []);

  return {
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
  };
}
