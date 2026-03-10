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
  defaultOpen = false,
}: Readonly<CollapsibleSectionProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const borderColor = BORDER_COLORS[color] || "border-l-gray-500";
  const bgColor = BG_COLORS[color] || "bg-gray-50";

  return (
    <div className={`border-l-4 ${borderColor} bg-white rounded-lg shadow-sm overflow-hidden`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 ${bgColor} hover:opacity-90 transition-opacity`}
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-6 py-4 space-y-6">{children}</div>}
    </div>
  );
}

interface DataLayerGroupProps {
  layer: string;
  children: React.ReactNode;
}

export function DataLayerGroup({ layer, children }: Readonly<DataLayerGroupProps>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DataLayerBadge layer={layer} />
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="space-y-4 pl-2">{children}</div>
    </div>
  );
}
