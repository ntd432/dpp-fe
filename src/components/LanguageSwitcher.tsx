"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LOCALES } from "@/i18n/translations";
import { LOCALE_NATIVE_LABELS } from "@/i18n/locale";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 outline-none focus:border-[var(--color-brand-pink)] focus:ring-2 focus:ring-[var(--color-brand-pink)]/20"
        aria-label={t("language.label")}
      >
        {SUPPORTED_LOCALES.map((localeCode) => (
          <option key={localeCode} value={localeCode}>
            {LOCALE_NATIVE_LABELS[localeCode]}
          </option>
        ))}
      </select>
    </label>
  );
}
