'use client';

import { DashboardNavHeader } from './DashboardNavHeader';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end">
      <DashboardNavHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pt-24">
        {children}
      </main>
    </div>
  );
}