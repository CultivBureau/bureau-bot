'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle, File as FileIcon } from 'lucide-react';
import { KnowledgeBaseSourceType } from '../shared/hooks/useKnowledgebase';

interface KnowledgebaseUploadFormProps {
  uploadType: KnowledgeBaseSourceType;
  onUploadTypeChange: (type: KnowledgeBaseSourceType) => void;
  title: string;
  content: string;
  file: File | null;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSave: () => void;
  onCancel: () => void;
  uploading: boolean;
  disabled: boolean;
  formatFileSize: (bytes: number) => string;
  isEditing?: boolean;
}

export function KnowledgebaseUploadForm({
  uploadType,
  onUploadTypeChange,
  title,
  content,
  file,
  onTitleChange,
  onContentChange,
  onFileChange,
  onSave,
  onCancel,
  uploading,
  disabled,
  formatFileSize,
  isEditing = false,
}: KnowledgebaseUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
      onTitleChange(selectedFile.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileChange(droppedFile);
      onTitleChange(droppedFile.name);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 space-y-6" data-upload-form>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Upload knowledge
          </h3>
          <p className="text-sm text-muted-foreground">
            Store PDFs or raw text inside the assistant's vector store.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onUploadTypeChange('file')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${uploadType === 'file'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-card-foreground'
              }`}
          >
            File upload
          </button>
          <button
            onClick={() => onUploadTypeChange('text')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${uploadType === 'text'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-card-foreground'
              }`}
          >
            Text input
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground">
          Title<span className="text-red-500"> *</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g. Onboarding handbook"
        />
      </div>

      {uploadType === 'file' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Upload file
          </label>
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center text-sm text-muted-foreground transition-colors ${isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary'
                }`}
            >
              <Upload className="mb-3 h-6 w-6 text-primary" />
              <p>Drop a file here or click to browse</p>
              <p className="text-xs">PDF, DOCX, or TXT (max 512MB)</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 px-4 py-4">
              <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900 p-2">
                <FileIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onFileChange(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="rounded-full px-3 py-1 text-xs text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                Remove
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {uploadType === 'text' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Text content
          </label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Paste the knowledge base article…"
          />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-secondary"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={disabled}
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {uploading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? 'Updating…' : 'Uploading…'}
            </span>
          ) : (
            isEditing ? 'Update knowledge base' : 'Add to knowledge base'
          )}
        </button>
      </div>
    </section>
  );
}

