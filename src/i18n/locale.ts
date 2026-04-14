import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/i18n/translations";

export const LOCALE_COOKIE_KEY = "dpp.locale";

export const LOCALE_NATIVE_LABELS: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  ja: "日本語",
  vi: "Tiếng Việt",
};

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(value);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
