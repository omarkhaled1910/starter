import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Web3Provider } from "./providers/Web3Provider";
import Footer from "@/components/layout/Footer";
import "@rainbow-me/rainbowkit/styles.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to Pet Store",
  description: "Pet Store",
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
        <Toaster position="top-right" reverseOrder={false} />{" "}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Provider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
