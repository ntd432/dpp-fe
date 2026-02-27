/**
 * TypeScript interfaces for the DPP Product Information ontology module.
 * @see models/dpp-product-info.ttl
 */

import type {
  Country,
  DataGroup,
  DataPoint,
  Extension,
  Organization,
  Product,
  Substance,
} from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

/**
 * Core identifying data for a product, including its name, GTIN, serial
 * number, country of origin, and production date.
 */
export interface ProductIdentificationInformation extends DataPoint {
  /** Global Trade Item Number */
  gtin?: string;
  /** Serial number or unique identifier */
  serial?: string;
  /** Product name */
  name?: string;
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
  manufacturer?: Organization;
}

/** Composition, bill of materials, and recycled/reused content. */
export interface MaterialInformation extends DataPoint {
  materialComposition?: string;
  /** URI to the bill of materials */
  materialBills?: string;
  recycledReusedContent?: string;
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

/** Interoperability and compatibility information. */
export interface CrossCompatibility extends DataPoint {
  crossCompatibility?: string;
}

/** Voluntary sector-specific information (extension point). */
export interface SectorNonRequiredInformation extends DataPoint {
  sectorNonRequiredInformation?: Extension;
}

/** Links to passports of related objects / components. */
export interface RelatedObjects extends DataPoint {
  relatedObjects?: Product[];
}

/** URI to test reports. */
export interface TestReports extends DataPoint {
  testReports?: string;
}

/** Description of the assembly process. */
export interface AssemblyProcess extends DataPoint {
  assemblyProcess?: string;
}

/** Description of the production method. */
export interface ProductionMethod extends DataPoint {
  productionMethod?: string;
}

/** Commercial information such as images and lifetime expectancy. */
export interface ProductCommercialInformation extends DataPoint {
  /** URI to an image of the product */
  image?: string;
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
  crossCompatibility?: CrossCompatibility;
  sectorNonRequiredInformation?: SectorNonRequiredInformation;
  relatedObjects?: RelatedObjects;
  testReports?: TestReports;
  assemblyProcess?: AssemblyProcess;
  productionMethod?: ProductionMethod;
  commercialInformation?: ProductCommercialInformation;
  qualityAssessment?: QualityAssessment;
  identifiedRisk?: IdentifiedRisk;
}
