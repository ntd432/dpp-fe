import Link from "next/link";
import { translate } from "@/i18n/translate";
import type { Locale } from "@/i18n/translations";

interface UnsupportedDevicePageProps {
  locale: Locale;
}

export default function UnsupportedDevicePage({ locale }: Readonly<UnsupportedDevicePageProps>) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-900">
          {translate(locale, "unsupportedDevice.title")}
        </h1>
        <p className="mt-3 text-sm text-red-800">
          {translate(locale, "unsupportedDevice.message")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-[var(--color-brand-pink)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-pink-dark)]"
        >
          {translate(locale, "unsupportedDevice.backToDashboard")}
        </Link>
      </div>
    </div>
  );
}
