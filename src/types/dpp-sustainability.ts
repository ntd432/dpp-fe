/**
 * TypeScript interfaces for the DPP Sustainability ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-sustainability.ttl
 */

import type { Extension, Material, MeasurementEntry } from "./dpp-core";

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

export interface EnvironmentalImpact {
  impactCategory: string;
  method?: string;
  characterizationFactor?: string;
  characterizationModel?: string;
  impactIndicator: MeasurementEntry;
}

// ── Data Points ─────────────────────────────────────────────────────────────

export interface SustainabilityPerformance {
  environmentalFootprint?: EnvironmentalFootprint[];
  resourceConsumption?: ResourceConsumption[];
  plasticsRelease?: string;
}

export interface SocialIndicator {
  labourConditions?: string;
}

export interface SustainabilityAttributes {
  resourceConsumptionWhenUsing?: ResourceConsumption[];
  resourceConsumptionWhenRecovering?: ResourceConsumption[];
}

export interface LifeCycleAssessment {
  lifeCycleAssessmentReport: string;
  environmentalImpact?: EnvironmentalImpact[];
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface SustainabilityInformation {
  sustainabilityPerformance?: SustainabilityPerformance;
  decomposability?: string;
  sectorSustainabilityIndicators?: Extension;
  criticalRawMaterial?: Material[];
  lifeCycleAssessment?: LifeCycleAssessment;
  renewableNonRenewableContent?: Material[];
  circularEconomyIndicator?: Extension;
  socialIndicator?: SocialIndicator;
  sustainabilityAttributes?: SustainabilityAttributes;
  environmentDeclaration?: string;
}
