'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '../store/hooks';

const publicRoutes = ['/', '/pages/login', '/pages/signup'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait a bit for auth initialization from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isChecking) return;

    const isPublicRoute = publicRoutes.includes(pathname || '');

    if (!isAuthenticated && !isPublicRoute) {
      // User is not authenticated and trying to access protected route
      router.push('/pages/login');
    } else if (isAuthenticated && (pathname === '/pages/login' || pathname === '/pages/signup')) {
      // User is authenticated but trying to access login/signup
      router.push('/pages/bots');
    }
  }, [isAuthenticated, pathname, router, isChecking]);

  // Show nothing while checking auth to prevent flash
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show children regardless - routing will handle redirects
  return <>{children}</>;
}
