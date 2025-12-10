'use client';

import { useEffect, useRef, useState } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [primaryColor, setPrimaryColor] = useState<string>('6, 182, 212'); // Default cyan-500 in RGB

  useEffect(() => {
    const updateColor = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const primaryValue = computedStyle.getPropertyValue('--primary').trim();
      
      // Handle Hex format (#RRGGBB)
      if (primaryValue.startsWith('#')) {
        const r = parseInt(primaryValue.slice(1, 3), 16);
        const g = parseInt(primaryValue.slice(3, 5), 16);
        const b = parseInt(primaryValue.slice(5, 7), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          setPrimaryColor(`${r}, ${g}, ${b}`);
        }
      } 
      // Handle RGB/RGBA format (rgb(r, g, b))
      else if (primaryValue.startsWith('rgb')) {
        const rgbValues = primaryValue.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          setPrimaryColor(`${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}`);
        }
      }
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 1; // Increased size for better visibility
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3; // Increased opacity
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(${primaryColor}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Increased particle count: 0.15 * width, capped at 200
      const particleCount = Math.min(window.innerWidth * 0.15, 200);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((a, index) => {
        for (let i = index + 1; i < particles.length; i++) {
          const b = particles[i];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) { // Increased connection distance
            ctx.strokeStyle = `rgba(${primaryColor}, ${0.2 * (1 - distance / 120)})`; // Increased line opacity
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [primaryColor]); // Re-run when color changes

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60" 
    />
  );
}
