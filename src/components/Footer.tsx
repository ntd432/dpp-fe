import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-gray-200 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section>
            <h2 className="text-base font-semibold text-gray-900">Digital Product Passport</h2>
            <p className="mt-2 text-sm text-gray-600">
              Master's thesis project by <Link target="_blank" href="https://linkedin.com/in/ntd432" className="hover:text-[var(--color-brand-pink-dark)] font-bold text-[var(--color-brand-pink)]">James Nguyen</Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Software Engineering for Green Deals (SE4GD) Erasmus Mundus programme, Cohort 4, 2024-2026
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900">Quick links</h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><Link href="/add-product" className="hover:text-[var(--color-brand-pink-dark)]">Add product</Link></li>
              <li><Link href="/add-dpp" className="hover:text-[var(--color-brand-pink-dark)]">Register DPP</Link></li>
              <li><Link href="/dpp" className="hover:text-[var(--color-brand-pink-dark)]">View DPP</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900">This project is proudly supported by</h2>
            {/* <p className="mt-2 text-sm text-gray-600">This project is proudly supported by</p> */}
            <div className="mt-3 flex items-center gap-3">
              {/* <img src="/next.svg" alt="Example logo 1" className="h-6 w-auto opacity-80" />
              <img src="/vercel.svg" alt="Example logo 2" className="h-6 w-auto opacity-80" /> */}
            </div>
          </section>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Digital Product Passport. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
