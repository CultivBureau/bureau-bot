'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useSyncExternalStore, useRef } from 'react';
import { LayoutDashboard, CreditCard, Bot, User, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { authService } from '../../services/auth';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import { Button } from '../landing/ui/button';

type ThemeOption = 'light' | 'dark';

const getDocumentTheme = (): ThemeOption => {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const createThemeStore = () => {
  let currentTheme: ThemeOption = getDocumentTheme();
  const listeners = new Set<() => void>();
  let initialized = false;

  const setDocumentTheme = (value: ThemeOption) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
  };

  const persistTheme = (value: ThemeOption) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bb-theme', value);
    }
  };

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setTheme = (value: ThemeOption, options: { persist?: boolean } = {}) => {
    const shouldPersist = options.persist ?? true;
    if (currentTheme === value) return;
    currentTheme = value;
    setDocumentTheme(value);
    if (shouldPersist) {
      persistTheme(value);
    }
    notify();
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return currentTheme;
    },
    getServerSnapshot() {
      return 'light';
    },
    init() {
      if (initialized || typeof window === 'undefined') return;
      initialized = true;
      const stored = window.localStorage.getItem('bb-theme') as ThemeOption | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const nextTheme = stored ?? (prefersDark ? 'dark' : 'light');
      setTheme(nextTheme, { persist: false });
    },
    toggle() {
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    },
  };
};

const themeStore = createThemeStore();

export function DashboardNavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const decodedToken = useAppSelector((state) => state.auth.decodedToken);
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const userEmail = (decodedToken?.email as string) || 'User';
  const userName = (decodedToken?.first_name as string) || 'User';

  const navigation = [
    { name: 'Dashboard', href: '/pages/dashboard', icon: LayoutDashboard },
    { name: 'Bots', href: '/pages/bots', icon: Bot },
    { name: 'Payment', href: '/pages/payment', icon: CreditCard },
  ];

  useEffect(() => {
    themeStore.init();
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const toggleTheme = () => {
    themeStore.toggle();
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/');
    setProfileMenuOpen(false);
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page
    console.log('Navigate to profile');
    setProfileMenuOpen(false);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const renderNav = (isMobile = false) => (
    <div className={isMobile ? 'flex flex-col gap-4' : 'hidden md:flex items-center gap-8'}>
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`text-sm transition-colors relative group flex items-center gap-2 ${
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isMobile && <Icon className="h-4 w-4" />}
            {item.name}
            {!isMobile && (
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-chart-2 transition-all duration-300 ${
                  active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <nav className="max-w-7xl mx-auto rounded-full bg-card/70 backdrop-blur-xl border border-border shadow-lg">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <Link href="/pages/dashboard" className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-hero-text bg-clip-text text-transparent">
              BureauBot
            </span>
          </Link>

          {/* Navigation Links */}
          {renderNav()}

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="hidden lg:flex items-center gap-3 rounded-full hover:bg-hero-circle/10 transition p-1"
                aria-label="Profile menu"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
              </button>
              
              {/* Mobile Profile Button */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
                aria-label="Profile menu"
              >
                <User className="h-5 w-5" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg backdrop-blur-sm z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-medium text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-hero-circle/10 transition"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-hero-circle/10 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border rounded-b-3xl px-6">
            {renderNav(true)}
            <div className="pt-4 border-t border-border flex flex-col gap-2 mt-4">
              {/* User Info Mobile */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-hero-circle/10 transition"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-hero-circle/10 transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

