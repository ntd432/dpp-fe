/**
 * TypeScript interfaces for the DPP Supply Chain ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-supply-chain.ttl
 */

import type { Event, Organization, Person } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

export interface ProductTraceability {
  traceabilityEvent?: Event[];
}

export interface RecyclingPartner {
  recyclingPartner?: Organization | Person;
}

export interface CustomerReturnChannel {
  customerReturnChannel?: Organization | Person;
}

export interface ComponentSupplier {
  componentSupplier?: Organization | Person;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface SupplyChain {
  productTraceability?: ProductTraceability;
  recyclingPartner?: Organization | Person;
  customerReturnChannel?: Organization | Person;
  componentSupplier?: Organization | Person;
}
