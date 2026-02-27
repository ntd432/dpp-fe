/**
 * TypeScript interfaces for the DPP End-of-Life ontology module.
 * @see models/dpp-eol.ttl
 */

import type { DataGroup, DataPoint, Event } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

/** Potential for recycling or reusing the product or its materials. */
export interface RecyclingReusePotential extends DataPoint {
  recyclingReusePotential?: string;
}

/** Available options for disposing of the product at end-of-life. */
export interface DisposalOptions extends DataPoint {
  disposalOptions?: string;
}

/** Estimated amount and type of waste generated at end-of-life. */
export interface ExpectedWaste extends DataPoint {
  expectedWaste?: string;
}

/** Extent to which the product or its components can be reused. */
export interface Reusability extends DataPoint {
  reusability?: string;
}

/** Ease with which the product can be repaired or maintained. */
export interface Repairability extends DataPoint {
  repairability?: string;
}

/** Potential for refurbishing or remanufacturing the product. */
export interface Refurbishability extends DataPoint {
  refurbishability?: string;
}

/** Available upgrade options to extend the product lifespan. */
export interface UpgradeOptions extends DataPoint {
  upgradeOptions?: string;
}

/** Historical record of end-of-life events. */
export interface EndOfLifeHistory extends DataPoint {
  endOfLifeHistory?: Event[];
}

/** Number of complete lifecycles the product has undergone. */
export interface NumberOfLifecycles extends DataPoint {
  numberOfLifecycles?: number;
}

/** Collection, sorting, and treatment information for end-of-life. */
export interface EndOfLifeInformation extends DataPoint {
  wastePrevention?: string;
  separateCollection?: string;
  collectionInformation?: string;
  /** URI to end-of-life report */
  endOfLifeReport?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** End-of-life and recovery data for the product. */
export interface EndOfLifeData extends DataGroup {
  recyclingReusePotential?: RecyclingReusePotential;
  disposalOptions?: DisposalOptions;
  expectedWaste?: ExpectedWaste;
  reusability?: Reusability;
  repairability?: Repairability;
  refurbishability?: Refurbishability;
  upgradeOptions?: UpgradeOptions;
  endOfLifeHistory?: EndOfLifeHistory;
  numberOfLifecycles?: NumberOfLifecycles;
  endOfLifeInformation?: EndOfLifeInformation;
}
