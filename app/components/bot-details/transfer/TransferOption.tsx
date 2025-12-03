'use client';

import { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface TransferOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  children?: ReactNode;
}

export function TransferOption({ label, checked, onChange, children }: TransferOptionProps) {
  return (
    <>
      <label className="group relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] bg-card/50 border-border hover:border-primary/50">
        <div className={`relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all ${
          checked
            ? 'bg-primary border-primary scale-110'
            : 'bg-background border-border group-hover:border-primary group-hover:scale-105'
        }`}>
          {checked && (
            <Check className="w-4 h-4 text-white transition-all" strokeWidth={3} />
          )}
        </div>
        <span className={`text-base font-semibold flex-1 transition-colors ${
          checked ? 'text-primary' : 'text-card-foreground'
        }`}>
          {label}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
      </label>
      {checked && children && (
        <div className="ml-8 mt-4 space-y-4 p-4 rounded-xl border-2 border-border bg-card/30">
          {children}
        </div>
      )}
    </>
  );
}

