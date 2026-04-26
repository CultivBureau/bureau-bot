'use client';

import { Edit, Trash2, AlertCircle } from 'lucide-react';
import type { StopWord } from '../../../types/stopWords';

const formatRuleValue = (item: StopWord) => {
  if (item.mediaType === 'text') {
    return item.text;
  }

  return `All ${item.mediaType} messages`;
};

interface StopWordsTableProps {
  stopWords: StopWord[];
  functions: Array<{ id: string; name: string }>;
  loading?: boolean;
  onEdit: (word: StopWord) => void;
  onDelete: (word: StopWord) => void;
  deletingId?: string | null;
}

export function StopWordsTable({
  stopWords,
  functions,
  loading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: StopWordsTableProps) {
  const getFunctionName = (item: StopWord) => {
    if (item.directFunctionName) {
      return item.directFunctionName;
    }
    if (item.functionId) {
      const matched = functions.find((fn) => fn.id === item.functionId);
      return matched?.name || 'Unknown function';
    }
    return 'Not assigned';
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-8 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-transparent border-t-primary" />
          <span className="text-sm text-muted-foreground">Loading stop words...</span>
        </div>
      </div>
    );
  }

  if (stopWords.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 backdrop-blur-sm p-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-foreground font-medium">No stop words yet</p>
        <p className="text-sm text-muted-foreground">
          Add stop words that your bot should ignore during processing.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Media Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Function Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Rule Value
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Match Type
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stopWords.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-border last:border-b-0 hover:bg-card/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-card-foreground capitalize">{item.mediaType}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">{getFunctionName(item)}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">{formatRuleValue(item)}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {item.mediaType === 'text' ? (
                    <span
                      className={
                        item.equalInclude
                          ? 'inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700'
                          : 'inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'
                      }
                    >
                      {item.equalInclude ? 'Equal' : 'Include'}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary hover:text-card-foreground"
                      title="Edit stop word"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-destructive/80 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete stop word"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border px-6 py-3 bg-card/30 text-xs text-muted-foreground">
        {stopWords.length} stop word{stopWords.length !== 1 ? 's' : ''} total
      </div>
    </div>
  );
}
