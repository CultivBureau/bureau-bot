'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    className?: string;
    variant?: 'default' | 'inline';
}

export function CopyButton({ text, className = '', variant = 'default' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            // Check if clipboard API is available
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                }

                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    if (variant === 'inline') {
        return (
            <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${copied
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    } ${className}`}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
                {copied ? (
                    <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleCopy}
            className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors ${copied
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                } ${className}`}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
    );
}
