interface InfoCardProps {
  label?: string;
  value: string;
  link?: string;
}

export default function InfoCard({ label, value }: Readonly<InfoCardProps>) {
  const isUrl =
    value.startsWith("http://") || value.startsWith("https://");

  return (
    <div className="flex flex-col gap-1 rounded-lg">
      {label && (
        <span className="text-sm font-semibold">
          {label}
        </span>
      )}
      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-brand-pink)] hover:text-[var(--color-brand-pink-dark)] underline break-all text-sm"
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-900 text-sm leading-relaxed">{value}</span>
      )}
    </div>
  );
}

export function InfoCardWithLink({ label, value, link }: Readonly<InfoCardProps>) {
  return (
    <div className="flex flex-col gap-1 rounded-lg">
      {label && (
        <span className="text-sm font-semibold">
          {label}
        </span>
      )}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-brand-pink)] hover:text-[var(--color-brand-pink-dark)] underline break-all text-sm"
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-900 text-sm leading-relaxed">{value}</span>
      )}

    </div>
  );
}

export function ImageInfoCard({ label, value }: Readonly<InfoCardProps>) {
  return (
    <div className="flex flex-col gap-1 rounded-lg">
      {label && (
        <span className="text-sm font-semibold">
          {label}
        </span>
      )}
      <img src={value} alt={label} className="max-w-full h-auto rounded-md border border-gray-200" />
    </div>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
