'use client';

import { UnifiedLoadingScreen } from '../shared/UnifiedLoadingScreen';

export function LoadingState({ message }: { message?: string }) {
  return <UnifiedLoadingScreen message={message || 'Loading...'} />;
}

