import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_KEY, normalizeLocale } from "@/i18n/locale";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Product Passport",
  description:
    "View product identification, compliance, and sustainability information",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = normalizeLocale((await cookies()).get(LOCALE_COOKIE_KEY)?.value);

  return (
    <html lang={locale}>
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased bg-[var(--corp-bg)] min-h-screen flex flex-col`}
      >
        <LanguageProvider initialLocale={locale}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
