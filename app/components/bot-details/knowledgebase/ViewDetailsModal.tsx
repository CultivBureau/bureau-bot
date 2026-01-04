'use client';

import { X, FileText, Link as LinkIcon, Database, Calendar, User, File } from 'lucide-react';
import { KnowledgeBaseItem } from '../shared/hooks/useKnowledgebase';

interface ViewDetailsModalProps {
    item: KnowledgeBaseItem | null;
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export function ViewDetailsModal({ item, isOpen, onClose, loading }: ViewDetailsModalProps) {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getSourceIcon = () => {
        if (!item) return <File className="h-5 w-5" />;
        switch (item.source_type) {
            case 'file':
                return <File className="h-5 w-5 text-blue-500" />;
            case 'text':
                return <FileText className="h-5 w-5 text-green-500" />;
            default:
                return <File className="h-5 w-5" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-card/90 px-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        {getSourceIcon()}
                        <h2 className="text-lg font-semibold text-card-foreground">
                            Knowledge Base Details
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-card-foreground transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <span className="ml-3 text-muted-foreground">Loading details...</span>
                        </div>
                    ) : item ? (
                        <div className="space-y-6">
                            {/* Title Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Title
                                </label>
                                <p className="text-lg font-semibold text-card-foreground">{item.title}</p>
                            </div>

                            {/* File Information */}
                            <div className="space-y-2 rounded-2xl border border-border bg-secondary/30 p-4">
                                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Source Type
                                </label>
                                <p className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                                    {getSourceIcon()}
                                    <span className="capitalize">{item.source_type}</span>
                                </p>
                            </div>

                            {/* Content Section (if available) */}
                            {item.content && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Content
                                    </label>
                                    <div className="rounded-2xl border border-border bg-secondary/30 p-4 max-h-64 overflow-y-auto">
                                        <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans">
                                            {item.content}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 rounded-2xl border border-border bg-secondary/30 p-4">
                                    <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        Created
                                    </label>
                                    <p className="text-sm text-card-foreground">{formatDate(item.created_at)}</p>
                                    {item.created_by && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            By: {item.created_by}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 rounded-2xl border border-border bg-secondary/30 p-4">
                                    <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        Last Updated
                                    </label>
                                    <p className="text-sm text-card-foreground">{formatDate(item.updated_at)}</p>
                                    {item.updated_by && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            By: {item.updated_by}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            No item data available
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-border bg-card/90 px-6 py-4 backdrop-blur-sm">
                    <button
                        onClick={onClose}
                        className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
