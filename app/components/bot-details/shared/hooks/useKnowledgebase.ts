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

  const fetchItems = useCallback(async () => {
    if (!botId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const response = await knowledgeBaseService.getKnowledgeBaseItems({ bot_id: botId });
      const data = response;
      const itemsList = Array.isArray(data) ? data : (data.results || data.data || []);
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

  const handleAddItem = async () => {
    if (!botId) {
      setError('No bot ID provided. Please select a bot first.');
      return;
    }
    
    if (!newItem.title.trim()) {
      setError('Please enter a title for your knowledge item.');
      return;
    }

    if (uploadType === 'file' && !newItem.file) {
      setError('Please select a file to upload.');
      return;
    }

    if (uploadType === 'text' && !newItem.content.trim()) {
      setError('Please enter some content for your knowledge item.');
      return;
    }

    if (uploadType === 'url' && !newItem.url.trim()) {
      setError('Please enter a URL for your knowledge item.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      if (uploadType === 'file' && newItem.file) {
        const formData = new FormData();
        formData.append('bot_id', botId!);
        formData.append('title', newItem.title);
        formData.append('source_type', 'file');
        formData.append('file', newItem.file);

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
    } catch (err: any) {
      setError(err?.message || 'Failed to upload knowledge base item');
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
    setUploadType(item.source_type === 'file' ? 'file' : 'text');
    setNewItem({
      title: item.title,
      content: item.content || '',
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

  const handleDownloadItem = (item: KnowledgeBaseItem) => {
    if (item.source_type === 'file') {
      const blob = new Blob([`This is a simulated download of ${item.title}`], { 
        type: 'application/octet-stream' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (item.content) {
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

  const handleViewItem = (item: KnowledgeBaseItem) => {
    if (item.content) {
      const newWindow = window.open('', '_blank', 'width=800,height=600');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${item.title}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .meta { color: #666; font-size: 14px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1>${item.title}</h1>
              <div class="content">${item.content.replace(/\n/g, '<br>')}</div>
              <div class="meta">
                <p><strong>Type:</strong> ${item.source_type.toUpperCase()}</p>
                <p><strong>Created:</strong> ${new Date(item.created_at).toLocaleString()}</p>
                <p><strong>File ID:</strong> ${item.openai_file_id}</p>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else {
      alert(`Viewing file: ${item.title}\n\nThis would open the file viewer for uploaded files.`);
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
    setShowUploadForm,
    setUploadType,
    setNewItem,
    setExpandedCard,
    setError,
    setSuccess,
    handleAddItem,
    handleDeleteItem,
    handleEditItem,
    handleDownloadItem,
    handleViewItem,
    formatFileSize,
  };
}

