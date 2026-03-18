/**
 * TypeScript interfaces for the DPP Product Information ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-product-info.ttl
 */

import type {
  DPP,
  Country,
  Extension,
  ImageObject,
  Component,
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

export interface ComponentInformation {
  componentComposition?: Component[];
  /** URI to the bill of materials */
  componentBills?: string;
  recycledReusedContent?: Component[];
}

export interface ProductCommercialInformation {
  image?: ImageObject;
  /** ISO 8601 duration (e.g. "P5Y") */
  lifetimeExpectancy?: string;
  /** ISO 8601 duration (e.g. "P2Y") */
  warrantyPeriod?: string;
  takebackOption?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface ProductInformation {
  identification?: ProductIdentificationInformation;
  manufacturer?: Organization;
  component?: ComponentInformation;
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
