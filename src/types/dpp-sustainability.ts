/**
 * TypeScript interfaces for the DPP Sustainability ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-sustainability.ttl
 */

import type { Extension, Material } from "./dpp-core";

// ── Sub-types ───────────────────────────────────────────────────────────────

/** Environmental footprint data (blank node with rdfs:label in the RDF). */
export interface EnvironmentalFootprint {
  environmentalFootprintType?: string;
  environmentalFootprintMeasuringMethod?: string;
  environmentalFootprintUnit?: string;
  environmentalFootprintValue?: number;
}

/** Resource consumption data (blank node with rdfs:label in the RDF). */
export interface ResourceConsumption {
  resource?: string;
  resourceConsumptionUnit?: string;
  resourceConsumptionValue?: number;
}

// ── Data Points ─────────────────────────────────────────────────────────────

export interface SustainabilityPerformance {
  environmentalFootprint?: EnvironmentalFootprint;
  resourceConsumption?: ResourceConsumption;
  plasticsRelease?: string;
}

export interface Decomposability {
  decomposability?: string;
}

export interface SectorSustainabilityIndicators {
  sectorSustainabilityIndicators?: Extension;
}

export interface CriticalRawMaterial {
  criticalRawMaterial?: Material | Material[];
}

export interface LifeCycleAssessment {
  /** URI to the LCA report */
  lifeCycleAssessment?: string;
}

export interface RenewableNonRenewableContent {
  renewableNonRenewableContent?: Material | Material[];
}

export interface CircularEconomyIndicator {
  circularEconomyIndicator?: Extension;
}

export interface SocialIndicator {
  labourConditions?: string;
}

export interface SustainabilityAttributes {
  resourceConsumptionWhenUsing?: ResourceConsumption;
  resourceConsumptionWhenRecovering?: ResourceConsumption;
}

export interface EnvironmentDeclaration {
  /** URI to the environment declaration document */
  environmentDeclaration?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface SustainabilityInformation {
  sustainabilityPerformance?: SustainabilityPerformance;
  decomposability?: string;
  sectorSustainabilityIndicators?: Extension;
  criticalRawMaterial?: Material[];
  lifeCycleAssessment?: string;
  renewableNonRenewableContent?: Material[];
  circularEconomyIndicator?: Extension;
  socialIndicator?: SocialIndicator;
  sustainabilityAttributes?: SustainabilityAttributes;
  environmentDeclaration?: string;
}
