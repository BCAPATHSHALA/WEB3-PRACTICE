import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Web3 Wallet",
  description:
    "Create and manage Solana and Ethereum wallets locally. This fun project is designed to help you understand how multiple wallets can be derived from a single master seed phrase in Web3.",
  keywords: ["web3 wallet", "solana wallet", "ethereum wallet"],
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {process.env.NODE_ENV === "production" && <Analytics />}
          <Toaster />
          <div className="max-w-full min-h-screen mx-auto relative overflow-hidden">
            {/* Background Grid with Subtle Gradient */}
            <div className="absolute inset-0 -z-10 bg-background">
              <div
                className="absolute inset-0 opacity-[0.6] dark:opacity-[0.3]"
                style={{
                  backgroundImage: `
              linear-gradient(to right, rgba(120,120,120,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(120,120,120,0.1) 1px, transparent 1px)
            `,
                  backgroundSize: "24px 24px",
                }}
              ></div>

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-purple-100 dark:from-zinc-900 dark:via-transparent dark:to-zinc-800 animate-gradient-slow"></div>
            </div>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
