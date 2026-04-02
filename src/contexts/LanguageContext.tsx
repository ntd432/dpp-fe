"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  type Locale,
} from "@/i18n/translations";
import { LOCALE_COOKIE_KEY, normalizeLocale } from "@/i18n/locale";
import { translate } from "@/i18n/translate";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = LOCALE_COOKIE_KEY;

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
}: Readonly<{ children: ReactNode; initialLocale?: Locale }>) {
  const [locale, setLocale] = useState(initialLocale ?? DEFAULT_LOCALE);

  useEffect(() => {
    const stored = globalThis.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLocale(normalizeLocale(stored));
    }
  }, []);

  useEffect(() => {
    globalThis.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale: (nextLocale: Locale) => setLocale(nextLocale),
    t: (key: string) => translate(locale, key),
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
