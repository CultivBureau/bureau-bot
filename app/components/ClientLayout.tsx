'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./landing/LoadingScreen";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onFinished={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      <div className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        {children}
      </div>
    </>
  );
}
