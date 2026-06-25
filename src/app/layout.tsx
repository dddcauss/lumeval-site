import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumeval — The MSK Passport & Stuck-File Operating System",
  description:
    "Worker-owned MSK verdicts. The Stuck-File Diagnostic. Physician-signed, governance-first infrastructure for the disability economy.",
  keywords: [
    "MSK",
    "musculoskeletal",
    "stuck file",
    "workers compensation",
    "occupational health",
    "radiology",
    "disability management",
    "mining",
    "heavy industry",
  ],
  authors: [{ name: "Dr. Dan Gill, MD, FRCPC" }],
  openGraph: {
    title: "Lumeval — The MSK Passport",
    description:
      "Worker-owned longitudinal MSK record. The Stuck-File Diagnostic. Physician-signed verdicts.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
