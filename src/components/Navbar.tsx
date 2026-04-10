"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarLinks from "@/components/NavbarLinks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isPhoneDevice, setIsPhoneDevice] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(max-width: 767px)");

    const syncDeviceType = () => {
      const onPhone = mediaQuery.matches;
      setIsPhoneDevice(onPhone);

      if (!onPhone) {
        setIsMenuOpen(false);
      }
    };

    syncDeviceType();
    mediaQuery.addEventListener("change", syncDeviceType);

    return () => {
      mediaQuery.removeEventListener("change", syncDeviceType);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/", label: t("navbar.dashboard") },
    { href: "/add-product", label: t("navbar.addProduct") },
    { href: "/add-dpp", label: t("navbar.registerDpp") },
    { href: "/dpp", label: t("navbar.viewDpp") },
  ];

  const mobileNavItems = navItems.filter((item) => item.href !== "/add-product" && item.href !== "/add-dpp");

  if (isPhoneDevice) {
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:cursor-pointer">
              <div className="w-8 h-8 bg-[var(--color-brand-pink)] rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 8h8M8 11h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="10" cy="15" r="1.6" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M13 14.2c1 .7 1 1.9 0 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M14.8 13.2c1.7 1.1 1.7 3.5 0 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-base font-semibold text-gray-900">
                {t("navbar.brand")}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 text-gray-700 hover:text-[var(--color-brand-pink)] hover:border-[var(--color-brand-pink)] transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="pb-4">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-2 space-y-1">
                {mobileNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[var(--color-brand-pink)]/20 text-[var(--color-brand-pink)]"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-gray-100">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:cursor-pointer">
            <div className="w-8 h-8 bg-[var(--color-brand-pink)] rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-white"
                fill="none"
                aria-hidden="true"
              >
                <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 8h8M8 11h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="10" cy="15" r="1.6" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13 14.2c1 .7 1 1.9 0 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M14.8 13.2c1.7 1.1 1.7 3.5 0 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {t("navbar.brand")}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <NavbarLinks items={navItems} />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
