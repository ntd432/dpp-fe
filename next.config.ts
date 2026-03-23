import type { NextConfig } from "next";

export const PRODUCT_INFO_PREFIX = process.env.PRODUCT_INFO_PREFIX || "https://ntd432.github.io/dpp/models/dpp-product-info.ttl#";
export const SUSTAINABILITY_PREFIX = process.env.SUSTAINABILITY_PREFIX || "https://ntd432.github.io/dpp/models/dpp-sustainability.ttl#";
export const EOL_PREFIX = process.env.EOL_PREFIX || "https://ntd432.github.io/dpp/models/dpp-eol.ttl#";
export const GUIDELINES_PREFIX = process.env.GUIDELINES_PREFIX || "https://ntd432.github.io/dpp/models/dpp-guidelines.ttl#";
export const COMPLIANCE_PREFIX = process.env.COMPLIANCE_PREFIX || "https://ntd432.github.io/dpp/models/dpp-compliance.ttl#";
export const SUPPLY_CHAIN_PREFIX = process.env.SUPPLY_CHAIN_PREFIX || "https://ntd432.github.io/dpp/models/dpp-supply-chain.ttl#";
export const USAGE_PREFIX = process.env.USAGE_PREFIX || "https://ntd432.github.io/dpp/models/dpp-usage.ttl#";
export const DATA_GROUP_PREDICATE = process.env.CORE_PREFIX ? `${process.env.CORE_PREFIX}dataGroup` : "https://ntd432.github.io/dpp/models/dpp-core.ttl#dataGroup";
export const EXTENSION_TYPES = new Set([
    "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#ElectronicExtension",
]);

export const ARRAY_TYPES = new Set([
    "endOfLifeHistory",
    "hazardousSubstances",
    "substancesOfConcern",
    "relatedObjects",
    "criticalRawMaterial",
    "renewableNonRenewableContent",
    "regulation", "productLabel", "certification"
]);

const nextConfig: NextConfig = {
  /* config options here */
  
};

export default nextConfig;
