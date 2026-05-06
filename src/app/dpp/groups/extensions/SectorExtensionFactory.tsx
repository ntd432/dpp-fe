"use client";

import React from "react";
import { ElectronicsExtensionSection } from "./ElectronicsExtensionComponents";
import { ExtensionSectionKey } from "@/config/product-extension-fields";
import { ElectronicExtension } from "@/types";

type SectorExtensionProps = {
  sector?: string;
  field: ExtensionSectionKey;
  data?: unknown;
};

/**
 * Routes to the correct sector-specific extension component based on productSector value
 * Add more sectors here as they become available
 */
export function SectorExtensionComponent({
  sector,
  field,
  data,
}: Readonly<SectorExtensionProps>) {
  // Normalize sector to lowercase for comparison
  const normalizedSector = sector?.toLowerCase() || "unknown";

  switch (normalizedSector) {
    case "electronics":
    case "electronic":
      return (
        <ElectronicsExtensionSection
          field={field}
          data={data as ElectronicExtension}
        />
      );

    // Add more sectors here in the future:
    // case "chemicals":
    // case "chemical":
    //   return <ChemicalExtensionSection field={field} data={data as ChemicalExtension} />;
    // case "textiles":
    //   return <TextileExtensionSection field={field} data={data as TextileExtension} />;

    default:
      // Fallback: show nothing or a generic message if sector is not recognized
      return (
        <div className="text-sm text-gray-500">
          Extension data for sector "{sector}" is not available
        </div>
      );
  }
}
