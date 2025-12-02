import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import Chatbot from "@/components/organisms/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://makin.vercel.app"),
  title: {
    default: "Makin | Premier Business Solutions in Saudi Arabia",
    template: "%s | Makin",
  },
  description: "Makin (مكين) provides comprehensive HR, Government Relations, Accounting, and Legal solutions for businesses scaling in Saudi Arabia. Your trusted partner for Vision 2030 success.",
  keywords: ["Saudi Arabia", "Business Setup", "HR Services", "Government Relations", "Accounting", "Legal Compliance", "Makin", "BSKSA", "Riyadh"],
  authors: [{ name: "Makin Team" }],
  creator: "Makin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://makin.vercel.app",
    title: "Makin | Empowering Business Growth in Saudi Arabia",
    description: "Expert HR, Government Relations, and Financial services tailored for the Saudi market. Simplify your operations with Makin.",
    siteName: "Makin",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Makin - Business Solutions in Saudi Arabia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Makin | Business Solutions Saudi Arabia",
    description: "Your trusted partner for HR, GRO, and Accounting in KSA.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SessionProvider>
            <LanguageProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Chatbot />
            </LanguageProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
