'use client';

export function LoadingState() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end">
      <div className="relative flex items-center gap-3 text-hero-text z-10">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading bots…
      </div>
    </div>
  );
}

