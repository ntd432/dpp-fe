/**
 * TypeScript interfaces for the DPP Core ontology module.
 * @see models/dpp-core.ttl
 */

// ── Schema.org helper types ─────────────────────────────────────────────────

/** A schema:Organization */
export interface Organization {
  name?: string;
  url?: string;
  identifier?: string;
}

/** A schema:Person */
export interface Person {
  name?: string;
  url?: string;
  identifier?: string;
}

/** A schema:Place */
export interface Place {
  name?: string;
  address?: string;
}

/** A schema:Country */
export interface Country {
  name?: string;
}

/** A schema:Substance */
export interface Substance {
  name?: string;
  description?: string;
}

/** A schema:Legislation */
export interface Legislation {
  name?: string;
  identifier?: string;
}

/** A schema:Certification */
export interface CertificationInfo {
  name?: string;
  description?: string;
}

/** A schema:Guide */
export interface Guide {
  name?: string;
  url?: string;
}

/** Generic named item (used for labels, status assessments, DMMs, etc.) */
export interface NamedItem {
  name?: string;
  description?: string;
}

// ── Core classes ────────────────────────────────────────────────────────────

/**
 * A digital record containing comprehensive information about a product
 * throughout its lifecycle.
 */
export interface DPP {
  /** IRI of this DPP resource */
  id?: string;
  label?: string;
}

/** A notable occurrence or action in the lifecycle of a product. */
export interface Event {
  /** Human-readable name of the event */
  actionName?: string;
  /** Category of the event (e.g. Production, Assembly, Maintenance, Incident) */
  actionType?: string;
  /** ISO 8601 date-time stamp */
  time?: string;
  /** Where the event took place */
  location?: Place;
  /** The responsible organization or person */
  actor?: Organization;
}

/** A parent class for sector-specific extension information. */
export interface Extension {
  [key: string]: unknown;
}

/**
 * An individual piece of information within a data group.
 * All concrete data-point interfaces extend this.
 */
export interface DataPoint {
  /** Access or classification layer (Regulatory, Sectoral, Commercial, Downstream Data) */
  dataLayer?: string;
}

/**
 * A thematic grouping of related data points within a DPP.
 * All concrete data-group interfaces extend this.
 */
export interface DataGroup {
  dataPoints?: DataPoint[];
}

/**
 * A physical or digital product that is the subject of a Digital Product Passport.
 */
export interface Product {
  /** IRI of this product resource */
  id?: string;
  /** The product's Digital Product Passport */
  dpp?: DPP;
  /** Thematic data groups attached to this product */
  productInfo?: import("./dpp-product-info").ProductInformation;
  compliance?: import("./dpp-compliance").Compliance;
  supplyChain?: import("./dpp-supply-chain").SupplyChain;
  sustainability?: import("./dpp-sustainability").SustainabilityInformation;
  endOfLife?: import("./dpp-eol").EndOfLifeData;
  guidelines?: import("./dpp-guidelines").GuidelinesAndManuals;
  usage?: import("./dpp-usage").UsageInformation;
}
