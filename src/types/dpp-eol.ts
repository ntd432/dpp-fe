/**
 * TypeScript interfaces for the DPP End-of-Life ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-eol.ttl
 */

import type { Event } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

export interface RecyclingReusePotential {
  recyclingReusePotential?: string;
}

export interface DisposalOptions {
  disposalOptions?: string;
}

export interface UnsoldProductsInformation {
  unsoldProductsInformation?: string;
}

export interface ExpectedWaste {
  expectedWaste?: string;
}

export interface Reusability {
  reusability?: string;
}

export interface Repairability {
  repairability?: string;
}

export interface Refurbrishability {
  refurbrishability?: string;
}

export interface UpgradeOptions {
  upgradeOptions?: string;
}

export interface EndOfLifeHistory {
  endOfLifeHistory?: Event[];
}

export interface NumberOfLifecycles {
  numberOfLifecycles?: number;
}

export interface EndOfLifeInformation {
  wastePrevention?: string;
  separateCollection?: string;
  collectionInformation?: string;
  /** URI to end-of-life report */
  endOfLifeReport?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface EndOfLifeData {
  recyclingReusePotential?: string;
  disposalOptions?: string;
  unsoldProductsInformation?: string;
  expectedWaste?: string;
  reusability?: string;
  repairability?: string;
  refurbrishability?: string;
  upgradeOptions?: string;
  endOfLifeHistory?: Event[];
  numberOfLifecycles?: number;
  endOfLifeInformation?: EndOfLifeInformation;
}
