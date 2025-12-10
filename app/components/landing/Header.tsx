'use client';

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Bot, Menu, Moon, Sun } from "lucide-react";

import { Button } from "./ui/button";
import { authService } from "../../services/auth";

type ThemeOption = "light" | "dark";

const getDocumentTheme = (): ThemeOption => {
  if (typeof document === "undefined") {
    return "light";
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const createThemeStore = () => {
  let currentTheme: ThemeOption = getDocumentTheme();
  const listeners = new Set<() => void>();
  let initialized = false;

  const setDocumentTheme = (value: ThemeOption) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", value === "dark");
    }
  };

  const persistTheme = (value: ThemeOption) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bb-theme", value);
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
      return "light";
    },
    init() {
      if (initialized || typeof window === "undefined") return;
      initialized = true;
      const stored = window.localStorage.getItem("bb-theme") as ThemeOption | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const nextTheme = stored ?? (prefersDark ? "dark" : "light");
      setTheme(nextTheme, { persist: false });
    },
    toggle() {
      setTheme(currentTheme === "light" ? "dark" : "light");
    },
  };
};

const themeStore = createThemeStore();

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  useEffect(() => {
    themeStore.init();
  }, []);

  useEffect(() => {
    // Check authentication status on mount and when window is available
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkAuth();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case auth state changes in same tab
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const toggleTheme = () => {
    themeStore.toggle();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  const navigation = [
    { name: "Home", id: "home" },
    { name: "Features", id: "features" },
    { name: "About Us", id: "about" },
  ];

  const renderNav = (isMobile = false) => (
    <div className={isMobile ? "flex flex-col gap-4" : "hidden md:flex items-center gap-8"}>
      {navigation.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`text-sm transition-colors relative group ${
            activeSection === item.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {item.name}
          {!isMobile && (
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-chart-2 group-hover:w-full transition-all duration-300" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <nav className="max-w-7xl mx-auto rounded-full bg-card/70 backdrop-blur-xl border border-border shadow-lg">
        <div className="flex justify-between items-center h-16 px-6">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-hero-text bg-clip-text text-transparent">
              BureauBot
            </span>
          </div>

          {renderNav()}

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Link href={isAuthenticated ? "/pages/dashboard" : "/pages/login"}>
              <Button className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90">
                {isAuthenticated ? "Dashboard" : "Login"}
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
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

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border rounded-b-3xl px-6">
            {renderNav(true)}
            <div className="pt-4 border-t border-border flex flex-col gap-3 mt-4">
              <Link href={isAuthenticated ? "/pages/dashboard" : "/pages/login"}>
                <Button className="w-full rounded-full bg-primary text-primary-foreground">
                  {isAuthenticated ? "Dashboard" : "Login"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
