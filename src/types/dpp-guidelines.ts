/**
 * TypeScript interfaces for the DPP Guidelines & Manuals ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-guidelines.ttl
 */

import type { Guide } from "./dpp-core";

export interface CommercialInstruction {
  safetyInstruction?: Guide;
  maintenanceInstruction?: Guide;
  wasteSortingInstruction?: Guide;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface GuidelinesAndManuals {
  assemblyGuideline?: Guide;
  nonDestructiveDisassemblyGuideline?: Guide;
  productManual?: Guide;
  storageAndTransportGuideline?: Guide;
  commercialInstruction?: CommercialInstruction;
  accessibility?: string;
  utilizationCharacteristic?: string;
}
