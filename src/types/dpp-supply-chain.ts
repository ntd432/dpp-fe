/**
 * TypeScript interfaces for the DPP Supply Chain ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-supply-chain.ttl
 */

import type { DataGroup, DataPoint, Event, Organization, Person } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

/** Traceability information for tracking the product through the supply chain. */
export interface ProductTraceability extends DataPoint {
  traceabilityEvent?: Event[];
}

/** Recycling partner involved in the product's end-of-life processing. */
export interface RecyclingPartner extends DataPoint {
  participant?: Organization | Person;
}

/** Customer return channel for the product. */
export interface CustomerReturnChannel extends DataPoint {
  participant?: Organization | Person;
}

/** Component supplier in the product's supply chain. */
export interface ComponentSupplier extends DataPoint {
  participant?: Organization | Person;
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** Supply chain data including traceability and partners. */
export interface SupplyChain extends DataGroup {
  productTraceability?: ProductTraceability;
  recyclingPartner?: RecyclingPartner;
  customerReturnChannel?: CustomerReturnChannel;
  componentSupplier?: ComponentSupplier;
}
