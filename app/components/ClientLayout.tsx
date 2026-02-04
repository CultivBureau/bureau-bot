'use client';

import { AuthGuard } from './AuthGuard';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
