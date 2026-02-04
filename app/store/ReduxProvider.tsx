'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect, useState } from 'react';
import { initializeAuth } from './slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    store.dispatch(initializeAuth());
    setInitialized(true);
  }, []);

  // Wait for auth initialization before rendering children
  if (!initialized) {
    return null;
  }

  return <Provider store={store}>{children}</Provider>;
}

