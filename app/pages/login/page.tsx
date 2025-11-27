'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { authService } from "../../services/auth";

type ThemeOption = "light" | "dark";

const getInitialTheme = (): ThemeOption => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<ThemeOption>(() => getInitialTheme());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bb-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      // Redirect to dashboard on success
      router.push('/pages/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 h-48 w-48 rounded-full bg-hero-circle/10 blur-3xl animate-pulse sm:h-64 sm:w-64 lg:h-96 lg:w-96" />
        <div className="absolute -bottom-1/4 -left-1/4 h-48 w-48 rounded-full bg-hero-circle/5 blur-3xl animate-pulse delay-1000 sm:h-64 sm:w-64 lg:h-96 lg:w-96" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero-circle/5 blur-3xl animate-pulse delay-500 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
      </div>

      <div className="fixed left-4 top-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-hero-circle/20 bg-hero-circle/10 p-3 shadow-lg backdrop-blur-sm transition hover:bg-hero-circle/20"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5 text-hero-text sm:h-6 sm:w-6" />
        </Link>
      </div>

      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={toggleTheme}
          className="rounded-full border border-hero-circle/20 bg-hero-circle/10 p-3 shadow-lg backdrop-blur-sm transition hover:bg-hero-circle/20"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-hero-text sm:h-6 sm:w-6" />
          ) : (
            <Sun className="h-5 w-5 text-hero-text sm:h-6 sm:w-6" />
          )}
        </button>
      </div>

      <div className="relative w-full max-w-7xl flex-1 self-center">
        <div className="px-4 pt-16 pb-8 text-center sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-hero-text sm:text-4xl md:text-5xl lg:text-6xl">
            Welcome Back
          </h1>
          <p className="mt-3 text-base text-hero-subtext sm:text-lg lg:text-xl">
            Sign in to manage your AI chatbots and CRM integrations
          </p>
        </div>

        <div className="relative mx-auto flex w-full flex-1 items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative z-10 mx-auto w-full max-w-md lg:mx-0">
              <div className="rounded-[32px] border border-hero-circle/20 bg-card/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-hero-text"
                    >
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-full border-2 border-hero-circle/30 bg-background/40 px-4 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-hero-text"
                    >
                      Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-full border-2 border-hero-circle/30 bg-background/40 px-4 pr-12 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-hero-subtext transition hover:text-hero-text"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 rounded border-hero-circle/30 bg-background/40 text-primary focus:ring-2 focus:ring-primary/30"
                      />
                      <span className="text-sm text-hero-text">Remember me</span>
                    </label>
                    <Link
                      href="#"
                      className="text-sm text-primary transition hover:text-primary/80"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <div className="rounded-full border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="border-t border-hero-circle/20 pt-4 text-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex h-11 min-w-[200px] items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-hero-subtext">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/pages/signup"
                      className="font-semibold text-primary transition hover:text-primary/80"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative hidden justify-center px-4 lg:flex">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute h-[220px] w-[220px] rounded-full border-2 border-hero-circle shadow-hero-circle/60 shadow-[0_0_25px] animate-[spin_20s_linear_infinite] sm:h-[280px] sm:w-[280px] lg:h-[320px] lg:w-[320px]" />
                  <div className="absolute h-[280px] w-[280px] rounded-full border-2 border-hero-circle shadow-hero-circle/50 shadow-[0_0_25px] animate-[spin_30s_linear_infinite_reverse] sm:h-[350px] sm:w-[350px] lg:h-[400px] lg:w-[400px]" />
                  <div className="absolute h-[340px] w-[340px] rounded-full border-2 border-hero-circle shadow-hero-circle/40 shadow-[0_0_25px] animate-[spin_40s_linear_infinite] sm:h-[420px] sm:w-[420px] lg:h-[480px] lg:w-[480px]" />
                </div>
                <Image
                  src="/Floating-Robot.png"
                  alt="Floating AI assistant robot"
                  width={500}
                  height={500}
                  priority
                  className="relative z-10 h-auto w-full animate-float object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

