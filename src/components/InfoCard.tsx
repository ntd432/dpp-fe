interface InfoCardProps {
  label: string;
  value: string;
}

export default function InfoCard({ label, value }: InfoCardProps) {
  const isUrl =
    value.startsWith("http://") || value.startsWith("https://");

  return (
    <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {formatLabel(label)}
      </span>
      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 underline break-all text-sm"
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-900 text-sm leading-relaxed">{value}</span>
      )}
    </div>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
