import Link from "next/link";
import ManufacturerProductTable from "@/components/ManufacturerProductTable";

const categories = [
  {
    title: "Product Identification",
    description:
      "Product names, serial numbers, GTINs, country of origin, and production dates.",
    href: "/identification",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
      </svg>
    ),
    color: "blue",
  },
  {
    title: "Compliance",
    description:
      "Regulations, certifications, labels, and data management methods.",
    href: "/compliance",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "purple",
  },
  {
    title: "Sustainability",
    description:
      "Environmental footprint, resource consumption, and sustainability declarations.",
    href: "/sustainability",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "emerald",
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
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Digital Product Passport
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Access comprehensive product information including identification,
          regulatory compliance, and environmental sustainability data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const style = colorStyles[cat.color];
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`block rounded-xl border-2 ${style.border} ${style.hover} bg-white p-8 transition-all hover:shadow-md group`}
            >
              <div
                className={`w-14 h-14 ${style.bg} rounded-xl flex items-center justify-center ${style.text} mb-5 group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {cat.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {cat.description}
              </p>
              <span className={`inline-flex items-center mt-4 text-sm font-medium ${style.text}`}>
                View details
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <ManufacturerProductTable />
      </div>
    </div>
  );
}
