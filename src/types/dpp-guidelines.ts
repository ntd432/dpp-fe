/**
 * TypeScript interfaces for the DPP Guidelines & Manuals ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-guidelines.ttl
 */

import type { Guide } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

export interface AssemblyGuideline {
  assemblyGuideline?: Guide;
}

export interface NonDestructiveDisassemblyGuideline {
  nonDestructiveDisassemblyGuideline?: Guide;
}

export interface ProductManual {
  productManual?: Guide;
}

export interface StorageAndTransportGuideline {
  storageAndTransportGuideline?: Guide;
}

export interface CommercialInstruction {
  safetyInstruction?: Guide;
  maintenanceInstruction?: Guide;
  wasteSortingInstruction?: Guide;
}

export interface Accessibility {
  accessibility?: string;
}

export interface UtilizationCharacteristic {
  utilizationCharacteristic?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface GuidelinesAndManuals {
  assemblyGuideline?: Guide;
  nonDestructiveDisassemblyGuideline?: Guide;
  productManual?: Guide;
  storageAndTransportGuideline?: StorageAndTransportGuideline;
  commercialInstruction?: CommercialInstruction;
  accessibility?: string;
  utilizationCharacteristic?: string;
}
