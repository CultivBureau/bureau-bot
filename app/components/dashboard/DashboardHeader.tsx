'use client';

import { Moon, Sun, Plus } from "lucide-react";
import { useState, useEffect } from "react";

type ThemeOption = "light" | "dark";

const getDocumentTheme = (): ThemeOption => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

interface DashboardHeaderProps {
  onCreateBot?: () => void;
}

export function DashboardHeader({ onCreateBot }: DashboardHeaderProps) {
  const [theme, setTheme] = useState<ThemeOption>(() => getDocumentTheme());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bb-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-hero-text sm:text-4xl">
          All bots
        </h1>
        <p className="max-w-2xl text-hero-subtext">
          Monitor performance and jump into any assistant with one click.
          Configure, track, and iterate with confidence.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hero-circle/30 backdrop-blur-lg bg-hero-circle/10 text-hero-text transition hover:bg-hero-circle/20"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        {onCreateBot && (
          <button
            onClick={onCreateBot}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            New bot
          </button>
        )}
      </div>
    </header>
  );
}

