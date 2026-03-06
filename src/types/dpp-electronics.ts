/**
 * TypeScript interfaces for the DPP Electronics extension ontology module.
 * @see https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl
 */

import type { DefinedTerm, Extension, Place } from "./dpp-core";

// ── Concept classes ─────────────────────────────────────────────────────────

export interface CrossCompatibility {
  crossCompatibilityDetails?: string;
  compatibleInterfaceStandard?: string;
  compatibilityLevel?: "full" | "partial" | "conditional";
}

export interface AssemblyProcess {
  assemblyProcessDescription?: string;
  assemblyAutomationLevel?: "manual" | "semi-automated" | "automated";
  assemblyLocation?: Place;
}

export interface ProductionMethod {
  productionMethodDescription?: string;
  manufacturingTechnology?: string;
  processCertification?: string;
}

export interface Volume {
  volumeValue?: number;
  volumeUnit?: string;
}

export interface Components {
  componentDescription?: string;
  componentCount?: number;
}

export interface ExpectedEndCondition {
  expectedEndCondition?:
    | "reusable"
    | "refurbishable"
    | "remanufacturable"
    | "recyclable"
    | "disposal-only";
}

export interface RenewableEnergyProduction {
  renewableEnergyProductionValue?: boolean;
  renewableEnergyType?: string;
  renewableEnergyOutput?: number;
  renewableEnergyOutputUnit?: string;
}

export interface MaterialSeparability {
  separabilityScore?: number;
  separabilityMethod?: string;
}

export interface ComponentModularity {
  modularityScore?: number;
  replaceableComponent?: string;
}

export interface ProductDesign {
  productDesign?: string;
  designForDisassembly?: boolean;
}

export interface AppliedStandardsAndNorms {
  appliedStandard?: DefinedTerm;
  standardReference?: string;
}

export interface InstalledSoftware {
  installedSoftwareName?: string;
  installedSoftwareVersion?: string;
  softwareSupportEndDate?: string;
}

// ── Root extension class ────────────────────────────────────────────────────

export interface ElectronicExtension extends Extension {
  crossCompatibility?: CrossCompatibility;
  assemblyProcess?: AssemblyProcess;
  productionMethod?: ProductionMethod;
  volume?: Volume;
  components?: Components;
  expectedEndConditionInfo?: ExpectedEndCondition;
  renewableEnergyProductionInfo?: RenewableEnergyProduction;
  materialSeparability?: MaterialSeparability;
  componentModularity?: ComponentModularity;
  productDesignInfo?: ProductDesign;
  appliedStandardsAndNorms?: AppliedStandardsAndNorms;
  installedSoftware?: InstalledSoftware;
}
