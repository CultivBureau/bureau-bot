'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface UnifiedLoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

export function UnifiedLoadingScreen({ 
  message = 'Loading...',
  showProgress = true 
}: UnifiedLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          // Keep it at 95% until loading is done
          return 95;
        }
        return prev + Math.random() * 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [showProgress]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          className="w-24 h-24 mb-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">B</span>
          </div>
        </motion.div>

        {/* Text Animation */}
        <motion.h1
          className="text-2xl font-bold text-hero-text mb-2 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          BureauBot
        </motion.h1>
        
        <motion.p
          className="text-hero-subtext text-sm mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>

        {/* Progress Bar */}
        {showProgress && (
          <>
            <div className="w-64 h-1 bg-secondary/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            <div className="mt-2 text-xs text-hero-subtext font-mono">
              {Math.min(95, Math.floor(progress))}%
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

