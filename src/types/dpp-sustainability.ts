/**
 * TypeScript interfaces for the DPP Sustainability ontology module.
 * @see models/dpp-sustainability.ttl
 */

import type { DataGroup, DataPoint, Extension } from "./dpp-core";

// ── Sub-types ───────────────────────────────────────────────────────────────

/** Environmental footprint data (blank node with rdfs:label in the RDF). */
export interface EnvironmentalFootprint {
  label?: string;
}

/** Resource consumption data (blank node with rdfs:label in the RDF). */
export interface ResourceConsumption {
  label?: string;
}

// ── Data Points ─────────────────────────────────────────────────────────────

/** Environment/circularity performance (footprint, resource consumption). */
export interface SustainabilityPerformance extends DataPoint {
  environmentalFootprint?: EnvironmentalFootprint;
  resourceConsumption?: ResourceConsumption;
}

/** Ability of the product or materials to break down naturally. */
export interface Decomposability extends DataPoint {
  decomposability?: string;
}

/** Sector-based sustainability and circularity indicators (extension point). */
export interface SectorSustainabilityIndicators extends DataPoint {
  sectorSustainabilityIndicators?: Extension;
}

/** Critical raw materials contained in the product. */
export interface CriticalRawMaterial extends DataPoint {
  criticalRawMaterial?: string;
  /** URI to the life-cycle assessment report */
  lifeCycleAssessment?: string;
}

/** Life-cycle assessment (standalone data point). */
export interface LifeCycleAssessment extends DataPoint {
  /** URI to the LCA report */
  lifeCycleAssessment?: string;
}

/** Proportion of renewable vs. non-renewable materials. */
export interface RenewableNonRenewableContent extends DataPoint {
  renewableNonRenewableContent?: string;
}

/** Other circular economy indicators (extension point). */
export interface CommercialSustainableIndicators extends DataPoint {
  commercialSustainableIndicators?: Extension;
}

/** Metrics related to the social impact (labour conditions, fair trade, etc.). */
export interface SocialIndicator extends DataPoint {
  labourConditions?: string;
}

/** Environmental attributes (resource consumption during use and recovery). */
export interface SustainabilityAttributes extends DataPoint {
  resourceConsumptionWhenUsing?: ResourceConsumption;
  resourceConsumptionWhenRecovering?: ResourceConsumption;
}

/** Formal environmental declaration (e.g. EPD). */
export interface EnvironmentDeclaration extends DataPoint {
  /** URI to the environment declaration document */
  environmentDeclaration?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** Sustainability and circularity information for the product. */
export interface SustainabilityInformation extends DataGroup {
  sustainabilityPerformance?: SustainabilityPerformance;
  decomposability?: Decomposability;
  sectorSustainabilityIndicators?: SectorSustainabilityIndicators;
  criticalRawMaterial?: CriticalRawMaterial;
  lifeCycleAssessment?: LifeCycleAssessment;
  renewableNonRenewableContent?: RenewableNonRenewableContent;
  commercialSustainableIndicators?: CommercialSustainableIndicators;
  socialIndicator?: SocialIndicator;
  sustainabilityAttributes?: SustainabilityAttributes;
  environmentDeclaration?: EnvironmentDeclaration;
}
