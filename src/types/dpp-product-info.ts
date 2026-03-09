/**
 * TypeScript interfaces for the DPP Product Information ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-product-info.ttl
 */

import type {
  DPP,
  Country,
  DataGroup,
  DataPoint,
  Extension,
  ImageObject,
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
export interface ProductIdentificationInformation extends DataPoint {
  gtin?: string;
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

/** Information about the entity responsible for manufacturing the product. */
export interface Manufacturer extends DataPoint {
  manufacturerInfo?: Organization;
}

/** Composition, bill of materials, and recycled/reused content. */
export interface MaterialInformation extends DataPoint {
  materialComposition?: ProductReference;
  /** URI to the bill of materials */
  materialBills?: string;
  recycledReusedContent?: ProductReference;
}

/** Availability of spare parts for the product. */
export interface SparePartsAvailability extends DataPoint {
  sparePartsAvailability?: string;
}

/** Hazardous substances contained in the product. */
export interface HazardousSubstances extends DataPoint {
  hazardousSubstances?: Substance[];
}

/** Substances of very high concern (SVHCs) present in the product. */
export interface SubstancesOfConcern extends DataPoint {
  substancesOfConcern?: string;
}

/** Sector-specific required information (extension point). */
export interface SectorRequiredInformation extends DataPoint {
  sectorRequiredInformation?: Extension;
}

/** Technical specifications (dimensions, weight, performance, etc.). */
export interface ProductSpecification extends DataPoint {
  productSpecification?: string;
}

/** Voluntary sector-specific information (extension point). */
export interface SectorNonRequiredInformation extends DataPoint {
  sectorNonRequiredInformation?: Extension;
}

/** Links to passports of related objects / components. */
export interface RelatedObjects extends DataPoint {
  relatedObjects?: ProductReference[];
}

/** URI to test reports. */
export interface TestReports extends DataPoint {
  testReports?: string;
}

/** Commercial information such as images and lifetime expectancy. */
export interface ProductCommercialInformation extends DataPoint {
  image?: ImageObject;
  /** ISO 8601 duration (e.g. "P5Y") */
  lifetimeExpectancy?: string;
}

/** Quality assessment results. */
export interface QualityAssessment extends DataPoint {
  qualityAssessment?: string;
}

/** Identified risks while using the product. */
export interface IdentifiedRisk extends DataPoint {
  identifiedRisk?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** Product data including identification, properties, and attributes. */
export interface ProductInformation extends DataGroup {
  identification?: ProductIdentificationInformation;
  manufacturer?: Manufacturer;
  material?: MaterialInformation;
  spareParts?: SparePartsAvailability;
  hazardousSubstances?: HazardousSubstances;
  substancesOfConcern?: SubstancesOfConcern;
  sectorRequiredInformation?: SectorRequiredInformation;
  productSpecification?: ProductSpecification;
  sectorNonRequiredInformation?: SectorNonRequiredInformation;
  relatedObjects?: RelatedObjects;
  testReports?: TestReports;
  commercialInformation?: ProductCommercialInformation;
  qualityAssessment?: QualityAssessment;
  identifiedRisk?: IdentifiedRisk;
}
