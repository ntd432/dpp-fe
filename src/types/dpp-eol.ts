/**
 * TypeScript interfaces for the DPP End-of-Life ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-eol.ttl
 */

import type { Event } from "./dpp-core";

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
