"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

export default function NavbarLinks({ items }: Readonly<{ items: ReadonlyArray<NavItem> }>) {
  const pathname = usePathname();

  return (
    <div className="flex space-x-1">
      {items.map((item) => {
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
