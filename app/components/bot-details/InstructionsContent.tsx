'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, Sparkles, Edit, Save, RefreshCw, X } from 'lucide-react';
import { botService } from '../../services/bot';
import type { Bot } from '../../types/bot';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../landing/ui/dialog';

const templates = [
  {
    id: 1,
    name: 'Customer Support',
    description: 'Professional customer service instructions',
    content: 'You are a helpful customer support assistant. Always be polite, patient, and solution-oriented. Provide clear and accurate information to help customers resolve their issues.',
  },
  {
    id: 2,
    name: 'Sales Assistant',
    description: 'Sales-focused conversation instructions',
    content: 'You are a knowledgeable sales assistant. Focus on understanding customer needs and recommending appropriate products. Be persuasive but not pushy.',
  },
  {
    id: 3,
    name: 'Technical Support',
    description: 'Technical troubleshooting instructions',
    content: 'You are a technical support specialist. Help users troubleshoot technical issues step by step. Ask clarifying questions and provide detailed solutions.',
  },
];

export function InstructionsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const [bot, setBot] = useState<Bot | null>(null);
  const [instructions, setInstructions] = useState('');
  const [originalInstructions, setOriginalInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    const fetchBot = async () => {
      if (!botId) {
        setError('No bot ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const botData = await botService.getBotById(botId);
        setBot(botData);
        setInstructions(botData.instructions || '');
        setOriginalInstructions(botData.instructions || '');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load instructions';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [botId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(instructions);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSave = async () => {
    if (!botId) {
      setError('No bot ID available');
      return;
    }

    setSaving(true);
    try {
      await botService.updateBot(botId, {
        instructions: instructions,
      });
      setBot(prev => prev ? { ...prev, instructions } : null);
      setOriginalInstructions(instructions);
      setEditing(false);
      setError('');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save instructions';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setInstructions(originalInstructions);
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setShowConfirmDialog(true);
  };

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      setInstructions(selectedTemplate.content);
      setEditing(true);
      setShowConfirmDialog(false);
      setSelectedTemplate(null);
    }
  };

  const handleCancelTemplate = () => {
    setShowConfirmDialog(false);
    setSelectedTemplate(null);
  };

  const characterCount = instructions.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-muted-foreground">Loading instructions...</div>
      </div>
    );
  }

  if (error && !bot) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-card-foreground">
                  System Instructions
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                  {characterCount} characters
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-border hover:bg-secondary"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter your system instructions here..."
                disabled={!editing}
                className={`w-full h-96 p-4 rounded-xl border-2 resize-none transition-all ${
                  editing
                    ? 'border-primary/50 bg-background text-foreground focus:border-primary'
                    : 'border-border bg-card/50 text-foreground'
                }`}
              />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-card-foreground">
                Instruction Templates
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 rounded-xl border-2 border-border cursor-pointer transition-all hover:scale-105 hover:border-primary bg-card/50"
                >
                  <h4 className="font-semibold mb-2 text-card-foreground">
                    {template.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {!editing ? (
              <button
                onClick={handleEdit}
                className="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Edit className="w-5 h-5" />
                Edit Instructions
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Template Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to edit the instructions? This will replace your current instructions with the template content and enable edit mode.
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h4 className="font-semibold mb-2 text-card-foreground">
                {selectedTemplate.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate.description}
              </p>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={handleCancelTemplate}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmTemplate}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              OK
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
