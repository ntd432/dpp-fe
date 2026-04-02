import Link from "next/link";
import NavbarLinks from "@/components/NavbarLinks";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/add-product", label: "Add Product" },
  { href: "/add-dpp", label: "Register DPP" },
  { href: "/dpp", label: "View DPP" },
];

export default function Navbar() {
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
              Digital Product Passport
            </span>
          </Link>
          <NavbarLinks items={navItems} />
        </div>
      </div>
    </nav>
  );
}
