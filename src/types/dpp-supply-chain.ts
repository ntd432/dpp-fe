/**
 * TypeScript interfaces for the DPP Supply Chain ontology module.
 * @see models/dpp-supply-chain.ttl
 */

import type { DataGroup, DataPoint, Event, Organization } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

/** Traceability information for tracking the product through the supply chain. */
export interface ProductTraceability extends DataPoint {
  traceabilityEvents?: Event[];
}

/** Recycling partner involved in the product's end-of-life processing. */
export interface RecyclingPartner extends DataPoint {
  participant?: Organization;
}

/** Customer return channel for the product. */
export interface CustomerReturnChannel extends DataPoint {
  participant?: Organization;
}

/** Component supplier in the product's supply chain. */
export interface ComponentSupplier extends DataPoint {
  participant?: Organization;
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** Supply chain data including traceability and partners. */
export interface SupplyChain extends DataGroup {
  traceability?: ProductTraceability;
  recyclingPartner?: RecyclingPartner;
  returnChannel?: CustomerReturnChannel;
  componentSupplier?: ComponentSupplier;
}
