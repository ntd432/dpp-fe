"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";


export default function UnsupportedDevicePage() {
    const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-900">
          {t("unsupportedDevice.title")}
        </h1>
        <p className="mt-3 text-sm text-red-800">
          {t("unsupportedDevice.message")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-[var(--color-brand-pink)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-pink-dark)]"
        >
          {t("unsupportedDevice.backToDashboard")}
        </Link>
      </div>
    </div>
  );
}
