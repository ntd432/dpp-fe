"use client";

import React from "react";

const LAYER_COLORS: Record<string, string> = {
  Regulatory: "bg-red-50 text-red-700 border-red-200",
  Sectoral: "bg-amber-50 text-amber-700 border-amber-200",
  Commercial: "bg-blue-50 text-blue-700 border-blue-200",
  "Downstream Data": "bg-purple-50 text-purple-700 border-purple-200",
};

interface AddEntryButtonProps {
  type?: "button" | "submit" | "reset";
  label: string;
  onClick: () => void;
}

export function AddEntryButton({ type = "button", label, onClick }: Readonly<AddEntryButtonProps>) {
  return (
    <button
        type={type}
        onClick={() => onClick()}
        className="text-xs px-2 py-1 bg-[var(--color-brand-blue-super-light)] text-[var(--color-brand-blue-super-dark)] rounded hover:bg-[var(--color-brand-blue-light)] hover:cursor-pointer"
      >
        {label}
      </button>
  );
}
