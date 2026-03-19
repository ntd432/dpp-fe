"use client";

import React, { useState } from "react";
import { DataLayerBadge } from "./DataLayerBadge";

interface CollapsibleSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const BORDER_COLORS: Record<string, string> = {
  blue: "border-l-blue-500",
  purple: "border-l-purple-500",
  amber: "border-l-amber-500",
  emerald: "border-l-emerald-500",
  rose: "border-l-rose-500",
  cyan: "border-l-cyan-500",
  indigo: "border-l-indigo-500",
};

const BG_COLORS: Record<string, string> = {
  blue: "bg-blue-50",
  purple: "bg-purple-50",
  amber: "bg-amber-50",
  emerald: "bg-emerald-50",
  rose: "bg-rose-50",
  cyan: "bg-cyan-50",
  indigo: "bg-indigo-50",
};

export function CollapsibleSection({
  title,
  color,
  children,
  // defaultOpen is kept for API compatibility but this section is always visible
  defaultOpen: _defaultOpen,
}: Readonly<CollapsibleSectionProps>) {
  const borderColor = BORDER_COLORS[color] || "border-l-gray-500";
  const bgColor = BG_COLORS[color] || "bg-gray-50";

  return (
    <div className={`border-l-4 border-[var(--color-brand-blue)] bg-white rounded-lg shadow-sm overflow-hidden`}>
      <div className={`px-6 py-4 bg-[var(--color-brand-blue)]/20`}>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-4 space-y-6">{children}</div>
    </div>
  );
}

interface DataLayerGroupProps {
  layer: string;
  children: React.ReactNode;
}

export function DataLayerGroup({ layer, children }: Readonly<DataLayerGroupProps>) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-2 hover:cursor-pointer"
      >
        <DataLayerBadge layer={layer} />
        <div className="flex-1 h-px bg-gray-200" />
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="space-y-4 pl-2">{children}</div>}
    </div>
  );
}
