'use client';

import { useSearchParams } from 'next/navigation';
import { Plus, Database, Loader2, AlertCircle, CheckCircle, File, FileText as FileTextIcon, Link } from 'lucide-react';
import { useKnowledgebase } from './hooks/useKnowledgebase';
import { KnowledgebaseUploadForm } from './KnowledgebaseUploadForm';
import { KnowledgebaseItemCard } from './KnowledgebaseItemCard';

export function KnowledgebaseContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const {
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
  } = useKnowledgebase(botId);

  const getFileIcon = (sourceType: string, fileType?: string) => {
    if (sourceType === 'file') {
      if (fileType === 'pdf') return <File className="w-5 h-5" />;
      if (fileType === 'doc' || fileType === 'docx') return <FileTextIcon className="w-5 h-5" />;
      if (fileType === 'txt') return <FileTextIcon className="w-5 h-5" />;
      return <File className="w-5 h-5" />;
    }
    if (sourceType === 'text') return <FileTextIcon className="w-5 h-5" />;
    if (sourceType === 'url') return <Link className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  if (!botId) {
    return (
      <div className="text-center text-muted-foreground">
        Please select a bot to manage its knowledge base.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">Loading knowledge base items…</span>
      </div>
    );
  }

  const uploadDisabled =
    uploading ||
    !newItem.title.trim() ||
    (uploadType === 'file' ? !newItem.file : !newItem.content.trim());

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-red-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-emerald-100"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Knowledge Base
        </h2>
        <button
          onClick={() => setShowUploadForm((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {showUploadForm ? 'Close form' : 'Add knowledge'}
        </button>
      </div>

      {showUploadForm && (
        <KnowledgebaseUploadForm
          uploadType={uploadType}
          onUploadTypeChange={setUploadType}
          title={newItem.title}
          content={newItem.content}
          file={newItem.file}
          onTitleChange={(value) => setNewItem({ ...newItem, title: value })}
          onContentChange={(value) => setNewItem({ ...newItem, content: value })}
          onFileChange={(file) => setNewItem({ ...newItem, file, title: file ? file.name : newItem.title })}
          onSave={handleAddItem}
          onCancel={() => {
            setShowUploadForm(false);
            setNewItem({ title: '', content: '', file: null });
          }}
          uploading={uploading}
          disabled={uploadDisabled}
          formatFileSize={formatFileSize}
        />
      )}

      <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            Stored items ({items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Database className="mb-4 h-12 w-12" />
            <p>No knowledge items yet</p>
            <p className="text-sm">
              Upload files or text so this assistant can rely on verified sources.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <KnowledgebaseItemCard
                key={item.source_id}
                item={item}
                isExpanded={expandedCard === item.source_id}
                onToggleExpand={() => setExpandedCard(expandedCard === item.source_id ? null : item.source_id)}
                onDelete={() => handleDeleteItem(item.source_id)}
                onEdit={() => handleEditItem(item)}
                onDownload={() => handleDownloadItem(item)}
                onView={() => handleViewItem(item)}
                formatFileSize={formatFileSize}
                getFileIcon={getFileIcon}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
