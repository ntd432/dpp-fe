"use client";

import React from "react";

const LAYER_COLORS: Record<string, string> = {
  Regulatory: "bg-red-50 text-red-700 border-red-200",
  Sectoral: "bg-amber-50 text-amber-700 border-amber-200",
  Commercial: "bg-blue-50 text-blue-700 border-blue-200",
  "Downstream Data": "bg-purple-50 text-purple-700 border-purple-200",
};

interface DataLayerBadgeProps {
  layer: string;
}

export function DataLayerBadge({ layer }: Readonly<DataLayerBadgeProps>) {
  const color = LAYER_COLORS[layer] || "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color}`}
    >
      {layer}
    </span>
  );
}
