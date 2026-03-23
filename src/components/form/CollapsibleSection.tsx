"use client";

import React, { useState } from "react";
import { DataLayerBadge } from "./DataLayerBadge";

interface CollapsibleSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  showCollapseButton?: boolean;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  title,
  color,
  children,
  showCollapseButton = false,
  defaultOpen = true,
}: Readonly<CollapsibleSectionProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const bgColor = 'bg-[var(--color-brand-blue)]/20';

  return (
    <div className={`border-l-4 border-[var(--color-brand-blue)] bg-white rounded-lg shadow-sm overflow-hidden`}>
      {showCollapseButton ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-6 py-4 flex items-center justify-between ${bgColor} [var(--bg-color)] hover:cursor-pointer`}
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
          </button> ) : (
        <div className={`px-6 py-4 ${bgColor} [var(--bg-color)]`}>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      {isOpen && <div className="px-6 py-4 space-y-6">{children}</div>}
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
