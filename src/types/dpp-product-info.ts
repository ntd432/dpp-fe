/**
 * TypeScript interfaces for the DPP Product Information ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-product-info.ttl
 */

import type {
  DPP,
  Country,
  Extension,
  ImageObject,
  Material,
  Organization,
  Product,
  Substance,
} from "./dpp-core";

type ProductReference = Product | DPP | string;

// ── Data Points ─────────────────────────────────────────────────────────────

/**
 * Core identifying data for a product, including its name, GTIN, serial
 * number, country of origin, and production date.
 */
export interface ProductIdentificationInformation {
  gtin?: string;
  taricCode?: string;
  /** Product name */
  productName?: string;
  /** Textual description */
  description?: string;
  /** URI to product documentation */
  documentation?: string;
  /** Country where the product was manufactured */
  countryOfOrigin?: Country;
  /** ISO 8601 date (YYYY-MM-DD) */
  productionDate?: string;
}

export interface Manufacturer {
  manufacturerInfo?: Organization;
}

export interface MaterialInformation {
  materialComposition?: Material[];
  /** URI to the bill of materials */
  materialBills?: string;
  recycledReusedContent?: Material[];
}

export interface SparePartsAvailability {
  sparePartsAvailability?: string;
}

export interface HazardousSubstances {
  hazardousSubstances?: Substance[];
}

export interface SubstancesOfConcern {
  substancesOfConcern?: Substance[];
}

export interface SectorRequiredInformation {
  sectorRequiredInformation?: Extension;
}

export interface ProductSpecification {
  productSpecification?: Extension;
}

export interface SectorNonRequiredInformation {
  sectorNonRequiredInformation?: Extension;
}

export interface RelatedObjects {
  relatedObjects?: ProductReference[];
}

export interface TestReport {
  testReport?: string;
}

export interface ProductCommercialInformation {
  image?: ImageObject;
  /** ISO 8601 duration (e.g. "P5Y") */
  lifetimeExpectancy?: string;
  /** ISO 8601 duration (e.g. "P2Y") */
  warrantyPeriod?: string;
  takebackOption?: string;
}

export interface QualityAssessment {
  qualityAssessment?: string;
}

export interface IdentifiedRisk {
  identifiedRisk?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface ProductInformation {
  identification?: ProductIdentificationInformation;
  manufacturer?: Organization;
  material?: MaterialInformation;
  sparePartsAvailability?: string;
  hazardousSubstances?: Substance[];
  substancesOfConcern?: Substance[];
  sectorRequiredInformation?: Extension;
  productSpecification?: Extension;
  sectorNonRequiredInformation?: Extension;
  relatedObjects?: ProductReference[];
  testReport?: string;
  commercialInformation?: ProductCommercialInformation;
  qualityAssessment?: string;
  identifiedRisk?: string;
}
