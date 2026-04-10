"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

export default function NavbarLinks({ items }: Readonly<{ items: ReadonlyArray<NavItem> }>) {
  const pathname = usePathname();
  const [isPhoneDevice, setIsPhoneDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(max-width: 767px)");

    const syncDeviceType = () => {
      setIsPhoneDevice(mediaQuery.matches);
    };

    syncDeviceType();
    mediaQuery.addEventListener("change", syncDeviceType);

    return () => {
      mediaQuery.removeEventListener("change", syncDeviceType);
    };
  }, []);

  const isMobileRestrictedRoute = (href: string): boolean => href === "/add-product" || href === "/add-dpp";
  const visibleItems = isPhoneDevice
    ? items.filter((item) => !isMobileRestrictedRoute(item.href))
    : items;

  return (
    <div className="flex space-x-1">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--color-brand-pink)]/20 text-[var(--color-brand-pink)]"
                : "text-gray-600 hover:text-white hover:bg-[var(--color-brand-pink)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
