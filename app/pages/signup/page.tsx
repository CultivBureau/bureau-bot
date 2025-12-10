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

interface SignupFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormState, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [theme, setTheme] = useState<ThemeOption>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bb-theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleChange = (field: keyof SignupFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof SignupFormState, string>> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});

    try {
      await authService.register({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone || "",
        password: formData.password,
        password_confirm: formData.confirmPassword,
      });
      // Redirect to dashboard on success
      router.push('/pages/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      // Handle field-specific errors
      if (err instanceof Error && err.message.includes('email')) {
        setErrors({ email: 'Email is already registered or invalid.' });
      } else if (err instanceof Error && err.message.includes('password')) {
        setErrors({ password: 'Password does not meet requirements.' });
      } else {
        setErrors({ email: errorMessage });
      }
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
          {!mounted ? (
            <Moon className="h-5 w-5 text-hero-text sm:h-6 sm:w-6" />
          ) : theme === "light" ? (
            <Moon className="h-5 w-5 text-hero-text sm:h-6 sm:w-6" />
          ) : (
            <Sun className="h-5 w-5 text-hero-text sm:h-6 sm:w-6" />
          )}
        </button>
      </div>

      <div className="relative w-full max-w-7xl flex-1 self-center">
        <div className="relative mx-auto flex w-full flex-1 items-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative z-10 mx-auto w-full max-w-xl lg:mx-0 space-y-6">
              <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight text-hero-text sm:text-4xl md:text-5xl">
                  Create Account
                </h1>
                <p className="mt-3 text-base text-hero-subtext sm:text-lg">
                  Create your AI chatbot and automate your CRM workflows
                </p>
              </div>
              <div className="rounded-[32px] border border-hero-circle/20 bg-card/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-hero-text" htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(event) => handleChange("firstName", event.target.value)}
                        placeholder="First name"
                        className={`w-full rounded-full border-2 px-4 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.firstName ? "border-destructive" : "border-hero-circle/30 bg-background/30"
                        }`}
                        required
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-hero-text" htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(event) => handleChange("lastName", event.target.value)}
                        placeholder="Last name"
                        className={`w-full rounded-full border-2 px-4 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.lastName ? "border-destructive" : "border-hero-circle/30 bg-background/30"
                        }`}
                        required
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-hero-text" htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full rounded-full border-2 px-4 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.email ? "border-destructive" : "border-hero-circle/30 bg-background/30"
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-hero-text" htmlFor="phone">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full rounded-full border-2 border-hero-circle/30 bg-background/30 px-4 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.phone ? "border-destructive" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-hero-text" htmlFor="password">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                        placeholder="Create a strong password"
                        className={`w-full rounded-full border-2 px-4 pr-12 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.password ? "border-destructive" : "border-hero-circle/30 bg-background/30"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-hero-subtext transition hover:text-hero-text"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-hero-text" htmlFor="confirmPassword">
                      Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(event) => handleChange("confirmPassword", event.target.value)}
                        placeholder="Confirm your password"
                        className={`w-full rounded-full border-2 px-4 pr-12 py-2.5 text-sm text-hero-text placeholder:text-hero-subtext/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.confirmPassword ? "border-destructive" : "border-hero-circle/30 bg-background/30"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-hero-subtext transition hover:text-hero-text"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="border-t border-hero-circle/20 pt-4 text-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex h-11 min-w-[200px] items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-hero-subtext">
                    Already have an account?{" "}
                    <Link
                      href="/pages/login"
                      className="font-semibold text-primary transition hover:text-primary/80"
                    >
                      Sign In
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

