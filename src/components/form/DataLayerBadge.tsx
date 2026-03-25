"use client";

interface DataLayerBadgeProps {
  layer: string;
}

export function DataLayerBadge({ layer }: Readonly<DataLayerBadgeProps>) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[var(--color-brand-pink-super-light)] text-[var(--color-brand-pink-dark)]`}
    >
      {layer}
    </span>
  );
}
