/**
 * TypeScript interfaces for the DPP Guidelines & Manuals ontology module.
 * @see models/dpp-guidelines.ttl
 */

import type { DataGroup, DataPoint, Guide } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

/** Instructions and guidelines for assembling the product. */
export interface AssemblyGuideline extends DataPoint {
  assemblyGuideline?: Guide;
}

/** Instructions for disassembling the product without causing damage. */
export interface NonDestructiveDisassemblyGuideline extends DataPoint {
  nonDestructiveDisassemblyGuideline?: Guide;
}

/** The official product manual or user guide. */
export interface ProductManual extends DataPoint {
  productManual?: Guide;
}

/** Guidelines for proper storage and transportation. */
export interface StorageAndTransportGuideline extends DataPoint {
  storageAndTransportGuideline?: Guide;
}

/** Commercial instructions (safety, maintenance, waste sorting). */
export interface CommercialInstruction extends DataPoint {
  safetyInstruction?: Guide;
  maintenanceInstruction?: Guide;
  wasteSortingInstruction?: Guide;
}

/** Accessibility features or accommodations provided by the product. */
export interface Accessibility extends DataPoint {
  accessibility?: string;
}

/** Characteristics describing how the product is intended to be utilized. */
export interface UtilizationCharacteristic extends DataPoint {
  utilizationCharacteristic?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** All guidelines, manuals, and instructions related to the product. */
export interface GuidelinesAndManuals extends DataGroup {
  assemblyGuideline?: AssemblyGuideline;
  nonDestructiveDisassemblyGuideline?: NonDestructiveDisassemblyGuideline;
  productManual?: ProductManual;
  storageAndTransportGuideline?: StorageAndTransportGuideline;
  commercialInstruction?: CommercialInstruction;
  accessibility?: Accessibility;
  utilizationCharacteristic?: UtilizationCharacteristic;
}
