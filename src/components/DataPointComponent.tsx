export default function DataPointComponent({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <details
      open
      className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          {label}
          <svg
            className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </summary>
      <div className="space-y-4 px-4 pb-4 pt-2">
        {children}
      </div>
    </details>
  );
}
