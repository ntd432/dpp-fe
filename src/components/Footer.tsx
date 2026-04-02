import Image from "next/image";
import Link from "next/link";
import { TriplyLogo } from "./TriplyLogo";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-gray-200 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section>
            <h2 className="text-base font-semibold text-gray-900">Digital Product Passport</h2>
            <p className="mt-2 text-sm text-gray-600">
              Master's thesis project by James Nguyen 
              <Link
                href="https://linkedin.com/in/ntd432"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-6 h-6 text-gray-600 hover:text-[var(--color-brand-pink)] hover:scale-110 transition-colors translate-y-0.5"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.81 0-9.728h3.554v1.375c.427-.659 1.191-1.597 2.897-1.597 2.117 0 3.704 1.385 3.704 4.362l.001 5.588zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.955.771-1.715 1.921-1.715 1.148 0 1.919.759 1.921 1.715 0 .953-.773 1.715-1.921 1.715zm1.581 11.597H3.715V9.579h3.203v10.873zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </Link>
              <Link
                href="https://github.com/ntd432"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-6 h-6 text-gray-600 hover:text-[var(--color-brand-pink)] hover:scale-110 transition-colors translate-y-0.5 translate-x-[calc(-2px)]"
                title="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
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
            <div className="flex items-center gap-3">
              <Image width={60} height={40} style={{minWidth: '50px'}} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src="https://se4gd.lutsoftware.com/wp-content/uploads/2020/10/cropped-logo.png" className="custom-logo" alt="SE4GD" decoding="async"/>
              <TriplyLogo/>
              <Image width={180} height={60} style={{minHeight: '50px'}} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src="https://erasmus-plus.ec.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/positive/logo-ec--en.svg" className="eac-site-branding-logo translate-y-[-2px] translate-x-[10px]" alt="Erasmus" decoding="async"/>
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
