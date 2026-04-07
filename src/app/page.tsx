"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = [
  {
    titleKey: "dashboard.passportInfo.title",
    descriptionKey: "dashboard.passportInfo.desc",
    href: "/dpp-information",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm3 5h6M9 11h2m-2 3h6m-9 0h1m0-3h1m4 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    color: "cyan",
  },
  {
    titleKey: "dashboard.productInfo.title",
    descriptionKey: "dashboard.productInfo.desc",
    href: "/product-information",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
      </svg>
    ),
    color: "blue",
  },
  {
    titleKey: "dashboard.sustainability.title",
    descriptionKey: "dashboard.sustainability.desc",
    href: "/sustainability",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "emerald",
  },
  {
    titleKey: "dashboard.usage.title",
    descriptionKey: "dashboard.usage.desc",
    href: "/usage-and-maintenance",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.7 6.3a1 1 0 010 1.4l-6 6a1 1 0 01-1.4 0l-2-2a1 1 0 111.4-1.4L8 11.6l5.3-5.3a1 1 0 011.4 0zM13 13h6m-6 4h4" />
      </svg>
    ),
    color: "amber",
  },
  {
    titleKey: "dashboard.eol.title",
    descriptionKey: "dashboard.eol.desc",
    href: "/end-of-life",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12a8 8 0 0113.657-5.657M20 12a8 8 0 01-13.657 5.657M20 4v6h-6M4 20v-6h6" />
      </svg>
    ),
    color: "rose",
  },
  {
    titleKey: "dashboard.supply.title",
    descriptionKey: "dashboard.supply.desc",
    href: "/supply-chain",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h4v4H6V6zm8 8h4v4h-4v-4zM6 14h4v4H6v-4zm4-6h4m-2 2v4m0 2h2" />
      </svg>
    ),
    color: "indigo",
  },
  {
    titleKey: "dashboard.guidelines.title",
    descriptionKey: "dashboard.guidelines.desc",
    href: "/guidelines",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a2 2 0 012-2h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5z" />
      </svg>
    ),
    color: "teal",
  },
  {
    titleKey: "dashboard.compliance.title",
    descriptionKey: "dashboard.compliance.desc",
    href: "/compliance",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "violet",
  },
];

const colorStyles: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    hover: "hover:border-blue-400",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    hover: "hover:border-purple-400",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    hover: "hover:border-emerald-400",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    hover: "hover:border-amber-400",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    hover: "hover:border-rose-400",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    hover: "hover:border-indigo-400",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200",
    hover: "hover:border-teal-400",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    hover: "hover:border-violet-400",
  },
  cyan: {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-200",
    hover: "hover:border-cyan-400",
  },
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const firstRow = categories.slice(0, 4);
  const secondRow = categories.slice(4, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("dashboard.title")}
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          {t("dashboard.subtitle")}
        </p>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("dashboard.whatIsTitle")}
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          {t("dashboard.whatIsBody")}
        </p>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("dashboard.whatSeeTitle")}
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          {t("dashboard.whatSeeBody")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-fr gap-6">
        {firstRow.map((cat) => {
          const style = colorStyles[cat.color];
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`flex h-full flex-col rounded-xl border-2 ${style.border} ${style.hover} bg-white p-8 transition-all hover:shadow-md group`}
            >
              <div
                className={`w-14 h-14 ${style.bg} rounded-xl flex items-center justify-center ${style.text} mb-5 group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t(cat.titleKey)}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t(cat.descriptionKey)}
              </p>
              <span className={`inline-flex items-center mt-auto pt-4 text-sm font-medium ${style.text}`}>
                {t("dashboard.viewDetails")}
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 md:auto-rows-fr gap-6">
        {secondRow.map((cat) => {
          const style = colorStyles[cat.color];
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`flex h-full flex-col rounded-xl border-2 ${style.border} ${style.hover} bg-white p-8 transition-all hover:shadow-md group`}
            >
              <div
                className={`w-14 h-14 ${style.bg} rounded-xl flex items-center justify-center ${style.text} mb-5 group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t(cat.titleKey)}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t(cat.descriptionKey)}
              </p>
              <span className={`inline-flex items-center mt-auto pt-4 text-sm font-medium ${style.text}`}>
                {t("dashboard.viewDetails")}
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>

      {/* <div className="mt-12">
        <ManufacturerProductTable />
      </div> */}
    </div>
  );
}
