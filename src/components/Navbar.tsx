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
              <span className="text-white font-bold text-sm">DPP</span>
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
