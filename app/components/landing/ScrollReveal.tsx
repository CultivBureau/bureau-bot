'use client';

import { motion, useInView, UseInViewOptions } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  width = 'fit-content',
  delay = 0,
  className = '',
  direction = 'up',
  distance = 50,
  duration = 0.5,
  once = true
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      default: return { y: distance, x: 0 };
    }
  };

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, ...getInitialPosition() },
          visible: { opacity: 1, x: 0, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration, delay, ease: "easeOut" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
