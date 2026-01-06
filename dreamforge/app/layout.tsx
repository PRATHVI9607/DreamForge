import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DebugAssistant } from "@/components/ui/debug-assistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DreamForge DTL",
  description: "Accelerate your career with AI-driven insights",
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
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
          <DebugAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
