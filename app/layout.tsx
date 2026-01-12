import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./store/ReduxProvider";
import { ClientLayout } from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

  const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem('bb-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (_) {}
})();
`;

export const metadata: Metadata = {
  title: "Bureau Bot",
  description: "Automate your Bitrix24 CRM with AI-powered chatbots.",
  icons: {
    icon: '/Floating-Robot.png',
    apple: '/Floating-Robot.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ReduxProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
