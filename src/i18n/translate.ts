import { runtimeMessages } from "@/i18n/runtime-messages";
import { messages, DEFAULT_LOCALE, type Locale } from "@/i18n/translations";

export function translate(locale: Locale, key: string): string {
  return (
    runtimeMessages[locale]?.[key] ??
    messages[locale][key] ??
    runtimeMessages[DEFAULT_LOCALE]?.[key] ??
    messages[DEFAULT_LOCALE][key] ??
    key
  );
}
