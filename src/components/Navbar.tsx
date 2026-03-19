"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/add-product", label: "Add Product" },
  { href: "/add-dpp", label: "Register DPP" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button className="flex items-center gap-2 hover:cursor-pointer" onClick={() => globalThis.location.href = "/"}>
            <div className="w-8 h-8 bg-[var(--color-brand-pink)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DPP</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Digital Product Passport
            </span>
          </button>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 transition duration-500 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-brand-pink)]/20 text-[var(--color-brand-pink)]"
                      : "text-gray-600 hover:text-white transition duration-300 hover:bg-[var(--color-brand-pink)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
