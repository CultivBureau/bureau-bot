import { useState, useEffect, useCallback } from 'react';
import { knowledgeBaseService, KnowledgeBaseItem, KnowledgeBaseSourceType } from '../../../../services/knowledgebase';

export type { KnowledgeBaseItem, KnowledgeBaseSourceType } from '../../../../services/knowledgebase';

export function useKnowledgebase(botId: string | null) {
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadType, setUploadType] = useState<KnowledgeBaseSourceType>('file');
  const [uploading, setUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    url: '',
    file: null as File | null,
  });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Edit and View states
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<KnowledgeBaseItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!botId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await knowledgeBaseService.getKnowledgeBaseItems({ bot_id: botId });
      const itemsList = Array.isArray(response) ? response : [];
      setItems(itemsList);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while fetching knowledge base items.');
    } finally {
      setLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSaveItem = async () => {
    if (!botId) {
      setError('No bot ID provided. Please select a bot first.');
      return;
    }

    if (!newItem.title.trim()) {
      setError('Please enter a title for your knowledge item.');
      return;
    }

    if (uploadType === 'file' && !newItem.file && !editingItemId) {
      setError('Please select a file to upload.');
      return;
    }

    if (uploadType === 'text' && !newItem.content.trim()) {
      setError('Please enter some content for your knowledge item.');
      return;
    }

    if (uploadType === 'url' && !newItem.url.trim() && !editingItemId) { // URL is only for creation, not update in this flow
      setError('Please enter a URL for your knowledge item.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // UPDATE existing item
      if (editingItemId) {
        if (uploadType === 'file' && newItem.file) {
          // Update with new file
          const formData = new FormData();
          formData.append('title', newItem.title);
          formData.append('file', newItem.file);

          if (process.env.NODE_ENV === 'development') {
            console.log('📝 Updating item with file:', editingItemId);
            console.log('  - title:', newItem.title);
            console.log('  - file:', newItem.file.name);
          }

          await knowledgeBaseService.updateKnowledgeBaseItem(editingItemId, formData);
          setSuccess('Knowledge base item updated with new file!');
        } else if (uploadType === 'text' && newItem.content.trim()) {
          // Update text content
          await knowledgeBaseService.updateKnowledgeBaseItem(editingItemId, {
            title: newItem.title,
            content: newItem.content,
          });
          setSuccess('Knowledge base item updated!');
        } else {
          // Update title only (e.g., for existing files or if content wasn't changed)
          await knowledgeBaseService.updateKnowledgeBaseItem(editingItemId, {
            title: newItem.title,
          });
          setSuccess('Knowledge base item updated!');
        }

        setEditingItemId(null);
        fetchItems();
        setNewItem({ title: '', content: '', url: '', file: null });
        setShowUploadForm(false);
      }
      // CREATE new item
      else {
        if (uploadType === 'file' && newItem.file) {
          const formData = new FormData();
          formData.append('bot_id', botId!);
          formData.append('title', newItem.title);
          formData.append('source_type', 'file');
          formData.append('file', newItem.file);

          // Log FormData contents for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('📤 Uploading file with FormData:');
            console.log('  - bot_id:', botId);
            console.log('  - title:', newItem.title);
            console.log('  - source_type: file');
            console.log('  - file:', newItem.file.name, `(${newItem.file.size} bytes, type: ${newItem.file.type})`);
          }

          await knowledgeBaseService.uploadFile(formData);
          setSuccess('File uploaded successfully to OpenAI and knowledge base!');
          fetchItems();
          setNewItem({ title: '', content: '', url: '', file: null });
          setShowUploadForm(false);
        } else if (uploadType === 'text' && newItem.content.trim()) {
          await knowledgeBaseService.uploadText({
            bot_id: botId!,
            title: newItem.title,
            content: newItem.content,
          });
          setSuccess('Text content added to knowledge base successfully!');
          fetchItems();
          setNewItem({ title: '', content: '', url: '', file: null });
          setShowUploadForm(false);
        } else if (uploadType === 'url' && newItem.url.trim()) {
          await knowledgeBaseService.uploadUrl({
            bot_id: botId!,
            title: newItem.title,
            url: newItem.url,
          });
          setSuccess('URL added to knowledge base successfully!');
          fetchItems();
          setNewItem({ title: '', content: '', url: '', file: null });
          setShowUploadForm(false);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save knowledge base item');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (openaiFileId: string) => {
    try {
      await knowledgeBaseService.deleteKnowledgeBaseItem(openaiFileId);
      setSuccess('Knowledge base item deleted successfully!');
      fetchItems();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete item');
    }
  };

  const handleEditItem = (item: KnowledgeBaseItem) => {
    setEditingItemId(item.openai_file_id);
    setUploadType(item.source_type === 'file' ? 'file' : 'text');
    setNewItem({
      title: item.title,
      content: item.content || '',
      url: '',
      file: null,
    });
    setShowUploadForm(true);
    setExpandedCard(null);

    setTimeout(() => {
      const formElement = document.querySelector('[data-upload-form]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDownloadItem = async (item: KnowledgeBaseItem) => {
    if (item.source_type === 'file') {
      try {
        // Download actual file from API
        const fileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://test.staging.cultiv.llc'}/api/KnowledgeBase/knowledge-base/${item.openai_file_id}/download/`;

        // Create temporary link to trigger download
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = item.title;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err: any) {
        setError(err?.message || 'Failed to download file');
      }
    } else if (item.content) {
      // Download text content as file
      const blob = new Blob([item.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleViewItem = async (item: KnowledgeBaseItem) => {
    // For files, open in new tab
    if (item.source_type === 'file') {
      // Construct file URL - adjust based on your API structure
      const fileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://test.staging.cultiv.llc'}/api/KnowledgeBase/knowledge-base/${item.openai_file_id}/file/`;
      window.open(fileUrl, '_blank');
      return;
    }

    // For text/url, show in modal
    try {
      setLoadingDetails(true);
      const fullItem = await knowledgeBaseService.getKnowledgeBaseItem(item.openai_file_id);
      setViewingItem(fullItem);
    } catch (err: any) {
      setError(err?.message || 'Failed to load item details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    items,
    loading,
    error,
    success,
    showUploadForm,
    uploadType,
    uploading,
    newItem,
    expandedCard,
    editingItemId,
    viewingItem,
    loadingDetails,
    setShowUploadForm,
    setUploadType,
    setNewItem,
    setExpandedCard,
    setEditingItemId,
    setViewingItem,
    setError,
    setSuccess,
    handleSaveItem,
    handleDeleteItem,
    handleEditItem,
    handleDownloadItem,
    handleViewItem,
    formatFileSize,
  };
}

