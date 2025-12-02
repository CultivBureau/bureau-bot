'use client';

import { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface KnowledgebaseUploadFormProps {
  uploadType: 'file' | 'text';
  onUploadTypeChange: (type: 'file' | 'text') => void;
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
}: KnowledgebaseUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
      onTitleChange(selectedFile.name);
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
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              uploadType === 'file'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-card-foreground'
            }`}
          >
            File upload
          </button>
          <button
            onClick={() => onUploadTypeChange('text')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              uploadType === 'text'
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

      {uploadType === 'file' ? (
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Upload file
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border text-center text-sm text-muted-foreground hover:border-primary"
          >
            <Upload className="mb-3 h-6 w-6 text-primary" />
            <p>Drop a file here or click to browse</p>
            <p className="text-xs">PDF, DOCX, or TXT</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          {file && (
            <div className="rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm text-card-foreground">
              {file.name} · {formatFileSize(file.size)}
            </div>
          )}
        </div>
      ) : (
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
              Uploading…
            </span>
          ) : (
            'Add to knowledge base'
          )}
        </button>
      </div>
    </section>
  );
}

