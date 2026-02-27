import InfoCard from "./InfoCard";

interface ProductCardProps {
  title: string;
  data: Record<string, unknown>;
  accentColor?: string;
}

function formatValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    // Handle objects with a `name` field (e.g. Country, Organization)
    if ("name" in value && typeof (value as Record<string, unknown>).name === "string") {
      return (value as Record<string, string>).name;
    }
    return JSON.stringify(value);
  }
  return String(value);
}

export default function ProductCard({
  title,
  data,
  accentColor = "emerald",
}: ProductCardProps) {
  const entries = Object.entries(data).filter(
    ([, value]) => value != null && value !== ""
  );

  const colorMap: Record<string, string> = {
    emerald: "border-emerald-500",
    blue: "border-blue-500",
    purple: "border-purple-500",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${
        colorMap[accentColor] || colorMap.emerald
      } overflow-hidden`}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map(([key, value]) => (
            <InfoCard key={key} label={key} value={formatValue(value)} />
          ))}
        </div>
      </div>
    </div>
  );
}
