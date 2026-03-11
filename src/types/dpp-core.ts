/**
 * TypeScript interfaces for the DPP Core ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-core.ttl
 */

// ── Schema.org helper types ─────────────────────────────────────────────────

export interface Organization {
  name?: string;
  url?: string;
  identifier?: string;
}

export interface Person {
  name?: string;
  url?: string;
  identifier?: string;
}

export interface Place {
  name?: string;
  address?: string;
}

export interface Country {
  name?: string;
}

export interface Substance {
  name?: string;
  description?: string;
}

export interface Legislation {
  name?: string;
  identifier?: string;
}

export interface Certification {
  name?: string;
  description?: string;
}

export interface Guide {
  name?: string;
  url?: string;
}

export interface ImageObject {
  url?: string;
  caption?: string;
}

export interface DefinedTerm {
  name?: string;
  identifier?: string;
}

export interface Material {
  materialName?: string;
  materialPercentage?: number;
  materialMassValue?: number;
  materialMassUnit?: string;
  materialReference?: string;
  materialURI?: string;
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
  dppRegistrationNumber?: string;
  productBatchNumber?: string;
  productSerialNumber?: string;
  granularity?: "model" | "batch" | "item";
  dataCarrierFormat?: "QR code" | "NFC" | "RFID" | "DataMatrix";
  dataCarrier?: string;
  productGroup?: string;
  issuer?: Organization;
  createdAt?: string;
  updatedAt?: string;
  validUntil?: string;
  product?: Product;
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
  actor?: Organization | Person;
}

/** A parent class for sector-specific extension information. */
export interface Extension {
  extensionType: string;
  [key: string]: unknown;
}

export interface MeasurementEntry {
  measurementValue: number;
  measurementUnit: string;
}

/**
 * A physical or digital product that is the subject of a Digital Product Passport.
 */
export interface Product {
  /** IRI of this product resource */
  id?: string;
  label?: string;
  dpp?: DPP | DPP[];
  /** Thematic data groups attached to this product */
  productInfo?: import("./dpp-product-info").ProductInformation;
  compliance?: import("./dpp-compliance").Compliance;
  supplyChain?: import("./dpp-supply-chain").SupplyChain;
  sustainability?: import("./dpp-sustainability").SustainabilityInformation;
  endOfLife?: import("./dpp-eol").EndOfLifeData;
  guidelines?: import("./dpp-guidelines").GuidelinesAndManuals;
  usage?: import("./dpp-usage").UsageInformation;
}
