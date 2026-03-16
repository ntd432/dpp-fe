"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, TextAreaField } from "@/components/form/FormField";
import {
  CollapsibleSection,
  DataLayerGroup,
} from "@/components/form/CollapsibleSection";
import { COUNTRIES } from "@/config/countries";
import { SECTORS } from "@/config/sectors";
import {
  EXTENSION_FIELD_CONFIG,
  EXTENSION_SECTION_LABELS,
  type ExtensionSectionKey,
} from "@/config/product-extension-fields";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Remove empty strings, empty arrays, empty objects, and _key fields recursively. */
function pruneEmpty(obj: Record<string, unknown>): Record<string, unknown> {
  const isEmptyObject = (value: unknown): boolean =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0;

  const pruneValue = (value: unknown): unknown => {
    if (value === "" || value === undefined || value === null) {
      return undefined;
    }

    if (Array.isArray(value)) {
      const filtered = value
        .map((item) =>
          typeof item === "object" && item !== null
            ? pruneEmpty(item as Record<string, unknown>)
            : item,
        )
        .filter(
          (item) => item !== "" && item !== undefined && !isEmptyObject(item),
        );
      return filtered.length > 0 ? filtered : undefined;
    }

    if (typeof value === "object") {
      const pruned = pruneEmpty(value as Record<string, unknown>);
      return Object.keys(pruned).length > 0 ? pruned : undefined;
    }

    return value;
  };

  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "_key") continue;
    const prunedValue = pruneValue(v);
    if (prunedValue !== undefined) {
      result[k] = prunedValue;
    }
  }

  // Drop extension shells that carry no meaningful values beyond extensionType.
  if (Object.keys(result).length === 1 && result.extensionType !== undefined) {
    return {};
  }

  return result;
}

// ── Generic array helpers ────────────────────────────────────────────────────

let nextId = 1;
function uid(): string {
  return `item-${nextId++}`;
}

function updateAt<T extends { _key: string }>(
  items: T[],
  index: number,
  field: keyof T,
  value: T[keyof T],
  onChange: (items: T[]) => void,
) {
  const next = [...items];
  next[index] = { ...next[index], [field]: value };
  onChange(next);
}

function removeAt<T>(items: T[], index: number, onChange: (items: T[]) => void) {
  onChange(items.filter((_, j) => j !== index));
}

const INPUT_CLASS =
  "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

const MASS_UNITS = ["g", "kg", "mg", "lb", "oz"];
const FOOTPRINT_UNITS = ["kg CO2e", "g CO2e", "t CO2e"];
const CONSUMPTION_UNITS = ["kWh", "Wh", "MJ", "L", "m3", "index"];

interface ManufacturerOption {
  id?: string;
  name?: string;
  url?: string;
  identifier?: string;
}

interface MeasurementValue {
  value: string;
  unit: string;
  customUnit: string;
}

function MeasurementInput({
  label,
  measurement,
  unitOptions,
  onChange,
}: Readonly<{
  label: string;
  measurement: MeasurementValue;
  unitOptions: string[];
  onChange: (next: MeasurementValue) => void;
}>) {
  const isCustom = measurement.unit === "custom";
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          step="any"
          placeholder="Value"
          value={measurement.value}
          onChange={(e) => onChange({ ...measurement, value: e.target.value })}
          className={INPUT_CLASS}
        />
        <select
          value={measurement.unit}
          onChange={(e) => onChange({ ...measurement, unit: e.target.value })}
          className={INPUT_CLASS}
        >
          <option value="">Select unit</option>
          {unitOptions.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </div>
      {isCustom && (
        <input
          type="text"
          placeholder="Enter custom unit"
          value={measurement.customUnit}
          onChange={(e) =>
            onChange({ ...measurement, customUnit: e.target.value })
          }
          className={INPUT_CLASS}
        />
      )}
    </div>
  );
}

// ── Event array helpers ─────────────────────────────────────────────────────

interface EventEntry {
  _key: string;
  actionName: string;
  actionType: string;
  time: string;
  locationName: string;
  actorName: string;
}

const emptyEvent = (): EventEntry => ({
  _key: uid(),
  actionName: "",
  actionType: "",
  time: "",
  locationName: "",
  actorName: "",
});

function EventArrayEditor({
  label,
  events,
  onChange,
}: Readonly<{
  label: string;
  events: EventEntry[];
  onChange: (events: EventEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...events, emptyEvent()])}
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          + Add Entry
        </button>
      </div>
      {events.map((ev, i) => (
        <div key={ev._key} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Action name"
              value={ev.actionName}
              onChange={(e) => updateAt(events, i, "actionName", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="datetime-local"
              value={ev.time}
              onChange={(e) => updateAt(events, i, "time", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Action type"
              value={ev.actionType}
              onChange={(e) => updateAt(events, i, "actionType", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Location name"
              value={ev.locationName}
              onChange={(e) => updateAt(events, i, "locationName", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Actor name"
              value={ev.actorName}
              onChange={(e) => updateAt(events, i, "actorName", e.target.value, onChange)}
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={() => removeAt(events, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

interface EnvironmentalFootprintEntry {
  _key: string;
  environmentalFootprintType: string;
  environmentalFootprintMeasuringMethod: string;
  measurement: MeasurementValue;
}

interface ResourceConsumptionEntry {
  _key: string;
  resource: string;
  measurement: MeasurementValue;
}

interface EnvironmentalImpactEntry {
  _key: string;
  impactCategory: string;
  method: string;
  characterizationFactor: string;
  characterizationModel: string;
  impactIndicator: MeasurementValue;
}

const emptyMeasurement = (): MeasurementValue => ({ value: "", unit: "", customUnit: "" });
const IMPACT_UNITS = ["kg CO2e", "g CO2e", "t CO2e", "MJ", "kWh", "m3", "L", "index"];

function EnvironmentalFootprintArrayEditor({
  items,
  onChange,
}: Readonly<{
  items: EnvironmentalFootprintEntry[];
  onChange: (items: EnvironmentalFootprintEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">Environmental Footprint</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                _key: uid(),
                environmentalFootprintType: "",
                environmentalFootprintMeasuringMethod: "",
                measurement: emptyMeasurement(),
              },
            ])
          }
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          + Add Entry
        </button>
      </div>
      {items.map((item, i) => (
        <div key={item._key} className="space-y-3 p-3 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Type"
              value={item.environmentalFootprintType}
              onChange={(e) =>
                updateAt(items, i, "environmentalFootprintType", e.target.value, onChange)
              }
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Measuring method"
              value={item.environmentalFootprintMeasuringMethod}
              onChange={(e) =>
                updateAt(
                  items,
                  i,
                  "environmentalFootprintMeasuringMethod",
                  e.target.value,
                  onChange,
                )
              }
              className={INPUT_CLASS}
            />
          </div>
          <MeasurementInput
            label="Measurement"
            measurement={item.measurement}
            unitOptions={FOOTPRINT_UNITS}
            onChange={(next) => updateAt(items, i, "measurement", next, onChange)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeAt(items, i, onChange)}
              className="text-red-400 hover:text-red-600 px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceConsumptionArrayEditor({
  label,
  items,
  onChange,
}: Readonly<{
  label: string;
  items: ResourceConsumptionEntry[];
  onChange: (items: ResourceConsumptionEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              { _key: uid(), resource: "", measurement: emptyMeasurement() },
            ])
          }
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          + Add Entry
        </button>
      </div>
      {items.map((item, i) => (
        <div key={item._key} className="space-y-3 p-3 bg-white border border-gray-200 rounded-lg">
          <input
            type="text"
            placeholder="Resource"
            value={item.resource}
            onChange={(e) => updateAt(items, i, "resource", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <MeasurementInput
            label="Measurement"
            measurement={item.measurement}
            unitOptions={CONSUMPTION_UNITS}
            onChange={(next) => updateAt(items, i, "measurement", next, onChange)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeAt(items, i, onChange)}
              className="text-red-400 hover:text-red-600 px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EnvironmentalImpactArrayEditor({
  items,
  onChange,
}: Readonly<{
  items: EnvironmentalImpactEntry[];
  onChange: (items: EnvironmentalImpactEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">Environmental Impact</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                _key: uid(),
                impactCategory: "",
                method: "",
                characterizationFactor: "",
                characterizationModel: "",
                impactIndicator: emptyMeasurement(),
              },
            ])
          }
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          + Add Entry
        </button>
      </div>
      {items.map((item, i) => (
        <div key={item._key} className="space-y-3 p-3 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Impact category"
              value={item.impactCategory}
              onChange={(e) => updateAt(items, i, "impactCategory", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Method"
              value={item.method}
              onChange={(e) => updateAt(items, i, "method", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Characterization factor"
              value={item.characterizationFactor}
              onChange={(e) => updateAt(items, i, "characterizationFactor", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Characterization model"
              value={item.characterizationModel}
              onChange={(e) => updateAt(items, i, "characterizationModel", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
          </div>
          <MeasurementInput
            label="Impact Indicator"
            measurement={item.impactIndicator}
            unitOptions={IMPACT_UNITS}
            onChange={(next) => updateAt(items, i, "impactIndicator", next, onChange)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeAt(items, i, onChange)}
              className="text-red-400 hover:text-red-600 px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Material array helpers ──────────────────────────────────────────────────

interface MaterialEntry {
  _key: string;
  materialName: string;
  mode: "percentage" | "mass";
  materialPercentage: string;
  materialMassValue: string;
  materialMassUnit: string;
  materialMassCustomUnit: string;
}

function MaterialArrayEditor({
  label,
  items,
  onChange,
  showPercentage = true,
}: Readonly<{
  label: string;
  items: MaterialEntry[];
  onChange: (items: MaterialEntry[]) => void;
  showPercentage?: boolean;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                _key: uid(),
                materialName: "",
                mode: "percentage",
                materialPercentage: "",
                materialMassValue: "",
                materialMassUnit: "",
                materialMassCustomUnit: "",
              },
            ])
          }
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          + Add Material
        </button>
      </div>
      {items.map((m, i) => (
        <div key={m._key} className="grid grid-cols-6 gap-2 items-center">
          <input
            type="text"
            placeholder="Material name"
            value={m.materialName}
            onChange={(e) => updateAt(items, i, "materialName", e.target.value, onChange)}
            className={`col-span-2 ${INPUT_CLASS}`}
          />
          {showPercentage && (
            <>
              <select
                value={m.mode}
                onChange={(e) =>
                  updateAt(
                    items,
                    i,
                    "mode",
                    e.target.value as "percentage" | "mass",
                    onChange,
                  )
                }
                className={INPUT_CLASS}
              >
                <option value="percentage">Percentage</option>
                <option value="mass">Mass</option>
              </select>
              {m.mode === "percentage" ? (
                <input
                  type="number"
                  placeholder="%"
                  value={m.materialPercentage}
                  onChange={(e) =>
                    updateAt(items, i, "materialPercentage", e.target.value, onChange)
                  }
                  className={INPUT_CLASS}
                />
              ) : (
                <>
                  <input
                    type="number"
                    step="any"
                    placeholder="Mass"
                    value={m.materialMassValue}
                    onChange={(e) =>
                      updateAt(items, i, "materialMassValue", e.target.value, onChange)
                    }
                    className={INPUT_CLASS}
                  />
                  <select
                    value={m.materialMassUnit}
                    onChange={(e) =>
                      updateAt(items, i, "materialMassUnit", e.target.value, onChange)
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="">Unit</option>
                    {MASS_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </>
              )}
              {m.mode === "mass" && m.materialMassUnit === "custom" && (
                <input
                  type="text"
                  placeholder="Custom unit"
                  value={m.materialMassCustomUnit}
                  onChange={(e) =>
                    updateAt(
                      items,
                      i,
                      "materialMassCustomUnit",
                      e.target.value,
                      onChange,
                    )
                  }
                  className={INPUT_CLASS}
                />
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => removeAt(items, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Name-description pair array (substances, certifications) ────────────────

interface NameDescEntry {
  _key: string;
  name: string;
  description: string;
}

function NameDescArrayEditor({
  label,
  items,
  onChange,
  namePlaceholder = "Name",
  descPlaceholder = "Description",
  addLabel = "+ Add Entry",
}: Readonly<{
  label: string;
  items: NameDescEntry[];
  onChange: (items: NameDescEntry[]) => void;
  namePlaceholder?: string;
  descPlaceholder?: string;
  addLabel?: string;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, { _key: uid(), name: "", description: "" }])}
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          {addLabel}
        </button>
      </div>
      {items.map((s, i) => (
        <div key={s._key} className="flex gap-2 items-start">
          <input
            type="text"
            placeholder={namePlaceholder}
            value={s.name}
            onChange={(e) => updateAt(items, i, "name", e.target.value, onChange)}
            className={`flex-1 ${INPUT_CLASS}`}
          />
          <input
            type="text"
            placeholder={descPlaceholder}
            value={s.description}
            onChange={(e) => updateAt(items, i, "description", e.target.value, onChange)}
            className={`flex-1 ${INPUT_CLASS}`}
          />
          <button
            type="button"
            onClick={() => removeAt(items, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Label array helper ──────────────────────────────────────────────────────

interface LabelEntry {
  _key: string;
  labelName: string;
  labelValue: string;
  labelDescription: string;
  labelDocumentation: string;
}

function LabelArrayEditor({
  items,
  onChange,
}: Readonly<{
  items: LabelEntry[];
  onChange: (items: LabelEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">
          Product Labels
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              { _key: uid(), labelName: "", labelValue: "", labelDescription: "", labelDocumentation: "" },
            ])
          }
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          + Add Label
        </button>
      </div>
      {items.map((l, i) => (
        <div key={l._key} className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg relative">
          <input
            type="text"
            placeholder="Label name"
            value={l.labelName}
            onChange={(e) => updateAt(items, i, "labelName", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Label value"
            value={l.labelValue}
            onChange={(e) => updateAt(items, i, "labelValue", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Description"
            value={l.labelDescription}
            onChange={(e) => updateAt(items, i, "labelDescription", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="url"
            placeholder="Documentation URL"
            value={l.labelDocumentation}
            onChange={(e) => updateAt(items, i, "labelDocumentation", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <button
            type="button"
            onClick={() => removeAt(items, i, onChange)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main Form State ─────────────────────────────────────────────────────────

interface FormState {
  sector: string;
  sectorType: string;
  // Product Information - Identification
  gtin: string;
  taricCode: string;
  productName: string;
  description: string;
  documentation: string;
  countryOfOrigin: string;
  productionDate: string;
  // Product Information - Manufacturer
  manufacturerMode: "existing" | "new";
  manufacturerName: string;
  manufacturerUrl: string;
  manufacturerId: string;
  // Product Information - Material
  materialComposition: MaterialEntry[];
  materialBills: string;
  recycledReusedContent: MaterialEntry[];
  // Product Information - Other
  sparePartsAvailability: string;
  hazardousSubstances: NameDescEntry[];
  substancesOfConcern: NameDescEntry[];
  // Product Information - Sector Required (Extension)
  sectorRequiredAssemblyDesc: string;
  sectorRequiredAssemblyAutomationLevel: string;
  sectorRequiredAssemblyLocationName: string;
  sectorRequiredAssemblyLocationAddress: string;
  sectorRequiredProductionDesc: string;
  sectorRequiredManufacturingTechnology: string;
  sectorRequiredProcessCertification: string;
  sectorNonRequiredInformationText: string;
  sectorNonRequiredExpectedEndCondition: string;
  sectorNonRequiredRenewableEnergyProductionValue: string;
  sectorNonRequiredRenewableEnergyType: string;
  sectorNonRequiredRenewableEnergyOutput: MeasurementValue;
  sectorNonRequiredSeparabilityScore: string;
  sectorNonRequiredSeparabilityMethod: string;
  sectorNonRequiredModularityScore: string;
  sectorNonRequiredReplaceableComponent: string;
  sectorNonRequiredProductDesign: string;
  sectorNonRequiredDesignForDisassembly: string;
  sectorNonRequiredAppliedStandardName: string;
  sectorNonRequiredAppliedStandardIdentifier: string;
  sectorNonRequiredStandardReference: string;
  relatedObjectsRaw: string;
  // Product Information - Product Specification (Extension)
  specHeight: MeasurementValue;
  specWidth: MeasurementValue;
  specDepth: MeasurementValue;
  specWeight: MeasurementValue;
  specIngressProtection: string;
  specNetworkConnectivity: string;
  specBatteryCapacity: MeasurementValue;
  specChargingInterface: string;
  specCrossCompatibilityDetails: string;
  specCompatibleInterfaceStandard: string;
  specCompatibilityLevel: string;
  specVolumeMeasurement: MeasurementValue;
  specComponentDescription: string;
  specComponentCount: string;
  specInstalledSoftwareName: string;
  specInstalledSoftwareVersion: string;
  specSoftwareSupportEndDate: string;
  // Product Information - Test Report
  testReport: string;
  // Product Information - Commercial
  imageUrl: string;
  lifetimeExpectancy: string;
  warrantyPeriod: string;
  takebackOption: string;
  qualityAssessment: string;
  identifiedRisk: string;
  // Compliance
  regulationName: string;
  regulationIdentifier: string;
  productLabels: LabelEntry[];
  productStatusAssessment: string;
  certifications: NameDescEntry[];
  dmmName: string;
  dmmIdentifier: string;
  // Supply Chain
  traceabilityEvents: EventEntry[];
  recyclingPartnerName: string;
  customerReturnChannelName: string;
  componentSupplierName: string;
  // Sustainability
  environmentalFootprints: EnvironmentalFootprintEntry[];
  resourceConsumptions: ResourceConsumptionEntry[];
  plasticsRelease: string;
  decomposability: string;
  sectorSustainabilityIndicatorsText: string;
  criticalRawMaterials: MaterialEntry[];
  lifeCycleAssessmentReport: string;
  environmentalImpacts: EnvironmentalImpactEntry[];
  renewableNonRenewableContent: MaterialEntry[];
  circularEconomyIndicatorText: string;
  labourConditions: string;
  usingResourceConsumptions: ResourceConsumptionEntry[];
  recoveringResourceConsumptions: ResourceConsumptionEntry[];
  environmentDeclaration: string;
  // End of Life
  recyclingReusePotential: string;
  disposalOptions: string;
  unsoldProductsInformation: string;
  expectedWaste: string;
  reusability: string;
  repairability: string;
  refurbrishability: string;
  upgradeOptions: string;
  endOfLifeHistory: EventEntry[];
  numberOfLifecycles: string;
  wastePrevention: string;
  separateCollection: string;
  collectionInformation: string;
  endOfLifeReport: string;
  // Guidelines
  assemblyGuidelineUrl: string;
  disassemblyGuidelineUrl: string;
  productManualUrl: string;
  storageGuidelineUrl: string;
  safetyInstructionUrl: string;
  maintenanceInstructionUrl: string;
  wasteSortingInstructionUrl: string;
  accessibility: string;
  utilizationCharacteristic: string;
  // Usage
  maintenanceLog: EventEntry[];
  usageHistory: EventEntry[];
  incidentsAndErrors: EventEntry[];
}

const initialState: FormState = {
  sector: "Electronics",
  sectorType: "ElectronicExtension",
  gtin: "",
  taricCode: "",
  productName: "",
  description: "",
  documentation: "",
  countryOfOrigin: "",
  productionDate: "",
  manufacturerMode: "existing",
  manufacturerName: "",
  manufacturerUrl: "",
  manufacturerId: "",
  materialComposition: [],
  materialBills: "",
  recycledReusedContent: [],
  sparePartsAvailability: "",
  hazardousSubstances: [],
  substancesOfConcern: [],
  sectorRequiredAssemblyDesc: "",
  sectorRequiredAssemblyAutomationLevel: "",
  sectorRequiredAssemblyLocationName: "",
  sectorRequiredAssemblyLocationAddress: "",
  sectorRequiredProductionDesc: "",
  sectorRequiredManufacturingTechnology: "",
  sectorRequiredProcessCertification: "",
  sectorNonRequiredInformationText: "",
  sectorNonRequiredExpectedEndCondition: "",
  sectorNonRequiredRenewableEnergyProductionValue: "",
  sectorNonRequiredRenewableEnergyType: "",
  sectorNonRequiredRenewableEnergyOutput: { value: "", unit: "", customUnit: "" },
  sectorNonRequiredSeparabilityScore: "",
  sectorNonRequiredSeparabilityMethod: "",
  sectorNonRequiredModularityScore: "",
  sectorNonRequiredReplaceableComponent: "",
  sectorNonRequiredProductDesign: "",
  sectorNonRequiredDesignForDisassembly: "",
  sectorNonRequiredAppliedStandardName: "",
  sectorNonRequiredAppliedStandardIdentifier: "",
  sectorNonRequiredStandardReference: "",
  relatedObjectsRaw: "",
  specHeight: { value: "", unit: "", customUnit: "" },
  specWidth: { value: "", unit: "", customUnit: "" },
  specDepth: { value: "", unit: "", customUnit: "" },
  specWeight: { value: "", unit: "", customUnit: "" },
  specIngressProtection: "",
  specNetworkConnectivity: "",
  specBatteryCapacity: { value: "", unit: "", customUnit: "" },
  specChargingInterface: "",
  specCrossCompatibilityDetails: "",
  specCompatibleInterfaceStandard: "",
  specCompatibilityLevel: "",
  specVolumeMeasurement: { value: "", unit: "", customUnit: "" },
  specComponentDescription: "",
  specComponentCount: "",
  specInstalledSoftwareName: "",
  specInstalledSoftwareVersion: "",
  specSoftwareSupportEndDate: "",
  testReport: "",
  imageUrl: "",
  lifetimeExpectancy: "",
  warrantyPeriod: "",
  takebackOption: "",
  qualityAssessment: "",
  identifiedRisk: "",
  regulationName: "",
  regulationIdentifier: "",
  productLabels: [],
  productStatusAssessment: "",
  certifications: [],
  dmmName: "",
  dmmIdentifier: "",
  traceabilityEvents: [],
  recyclingPartnerName: "",
  customerReturnChannelName: "",
  componentSupplierName: "",
  environmentalFootprints: [],
  resourceConsumptions: [],
  plasticsRelease: "",
  decomposability: "",
  sectorSustainabilityIndicatorsText: "",
  criticalRawMaterials: [],
  lifeCycleAssessmentReport: "",
  environmentalImpacts: [],
  renewableNonRenewableContent: [],
  circularEconomyIndicatorText: "",
  labourConditions: "",
  usingResourceConsumptions: [],
  recoveringResourceConsumptions: [],
  environmentDeclaration: "",
  recyclingReusePotential: "",
  disposalOptions: "",
  unsoldProductsInformation: "",
  expectedWaste: "",
  reusability: "",
  repairability: "",
  refurbrishability: "",
  upgradeOptions: "",
  endOfLifeHistory: [],
  numberOfLifecycles: "",
  wastePrevention: "",
  separateCollection: "",
  collectionInformation: "",
  endOfLifeReport: "",
  assemblyGuidelineUrl: "",
  disassemblyGuidelineUrl: "",
  productManualUrl: "",
  storageGuidelineUrl: "",
  safetyInstructionUrl: "",
  maintenanceInstructionUrl: "",
  wasteSortingInstructionUrl: "",
  accessibility: "",
  utilizationCharacteristic: "",
  maintenanceLog: [],
  usageHistory: [],
  incidentsAndErrors: [],
};

type FormSetter = (key: keyof FormState, value: FormState[keyof FormState]) => void;

function renderExtensionSection(
  section: ExtensionSectionKey,
  form: FormState,
  setValue: FormSetter,
): React.ReactNode {
  const groups = EXTENSION_FIELD_CONFIG[form.sectorType]?.[section];

  if (!groups || Object.keys(groups).length === 0) {
    return null;
  }

  return (
    <details open className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100">
        {EXTENSION_SECTION_LABELS[section]}
      </summary>
      <div className="space-y-4 px-4 pb-4 pt-2">
      {Object.entries(groups).map(([groupName, groupFields]) => {
        return (
          <details key={groupName} className="border border-gray-200 rounded-lg bg-white">
            <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
              {groupName}
            </summary>
            <div className="px-4 pb-4 grid grid-cols-2 gap-4">
              {groupFields.map((field) => {
                const fieldKey = field.key as keyof FormState;
                const fieldValue = form[fieldKey];
                const wrapperClass =
                  field.kind === "measurement" || field.kind === "textarea"
                    ? "col-span-2"
                    : "";

                if (field.kind === "measurement") {
                  return (
                    <div key={String(field.key)} className={wrapperClass}>
                      <MeasurementInput
                        label={field.label}
                        measurement={fieldValue as MeasurementValue}
                        unitOptions={field.unitOptions ?? []}
                        onChange={(next) => setValue(fieldKey, next)}
                      />
                    </div>
                  );
                }

                if (field.kind === "textarea") {
                  return (
                    <div key={String(field.key)} className={wrapperClass}>
                      <TextAreaField
                        label={field.label}
                        value={fieldValue as string}
                        onChange={(next) => setValue(fieldKey, next)}
                        rows={field.rows}
                      />
                    </div>
                  );
                }

                if (field.kind === "select") {
                  return (
                    <div key={String(field.key)}>
                      <label
                        htmlFor={String(field.key)}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {field.label}
                      </label>
                      <select
                        id={String(field.key)}
                        value={fieldValue as string}
                        onChange={(e) => setValue(fieldKey, e.target.value)}
                        className={INPUT_CLASS}
                      >
                        <option value="">Select option</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <FormField
                    key={String(field.key)}
                    label={field.label}
                    value={fieldValue as string}
                    onChange={(next) => setValue(fieldKey, next)}
                    type={field.kind === "number" || field.kind === "date" ? field.kind : "text"}
                    placeholder={field.placeholder}
                  />
                );
              })}
            </div>
          </details>
        );
      })}
      </div>
    </details>
  );
}

// ── Build payload ───────────────────────────────────────────────────────────

function buildPayload(f: FormState): Record<string, unknown> {
  const formatTime = (t: string) => (t ? t.replace("T", "T") + ":00Z" : "");
  const toBoolean = (value: string): boolean | "" =>
    value === "true" ? true : value === "false" ? false : "";

  const resolveUnit = (m: MeasurementValue) =>
    m.unit === "custom" ? m.customUnit : m.unit;

  const toMaterial = (m: MaterialEntry): Record<string, unknown> => ({
    materialName: m.materialName,
    ...(m.mode === "percentage" && m.materialPercentage
      ? { materialPercentage: Number(m.materialPercentage) }
      : {}),
    ...(m.mode === "mass" && m.materialMassValue
      ? {
          materialMassValue: Number(m.materialMassValue),
          materialMassUnit:
            m.materialMassUnit === "custom"
              ? m.materialMassCustomUnit
              : m.materialMassUnit,
        }
      : {}),
  });

  const toMeasurementEntry = (m: MeasurementValue): Record<string, unknown> => ({
    measurementValue: m.value ? Number(m.value) : "",
    measurementUnit: resolveUnit(m),
  });

  const toValueUnitObject = (
    measurement: MeasurementValue,
    valueKey: string,
    unitKey: string,
  ): Record<string, unknown> => ({
    [valueKey]: measurement.value ? Number(measurement.value) : "",
    [unitKey]: resolveUnit(measurement),
  });

  const toEnvironmentalFootprint = (entry: EnvironmentalFootprintEntry): Record<string, unknown> => ({
    environmentalFootprintType: entry.environmentalFootprintType,
    environmentalFootprintMeasuringMethod: entry.environmentalFootprintMeasuringMethod,
    environmentalFootprintUnit: resolveUnit(entry.measurement),
    environmentalFootprintValue: entry.measurement.value ? Number(entry.measurement.value) : "",
  });

  const toResourceConsumption = (entry: ResourceConsumptionEntry): Record<string, unknown> => ({
    resource: entry.resource,
    resourceConsumptionUnit: resolveUnit(entry.measurement),
    resourceConsumptionValue: entry.measurement.value ? Number(entry.measurement.value) : "",
  });

  const toEnvironmentalImpact = (entry: EnvironmentalImpactEntry): Record<string, unknown> => ({
    impactCategory: entry.impactCategory,
    method: entry.method,
    characterizationFactor: entry.characterizationFactor,
    characterizationModel: entry.characterizationModel,
    impactIndicator: toMeasurementEntry(entry.impactIndicator),
  });

  const buildEvents = (events: EventEntry[]) =>
    events.map((e) => {
      const ev: Record<string, unknown> = {};
      if (e.actionName) ev.actionName = e.actionName;
      if (e.actionType) ev.actionType = e.actionType;
      if (e.time) ev.time = formatTime(e.time);
      if (e.locationName) ev.location = { name: e.locationName };
      if (e.actorName) ev.actor = { name: e.actorName };
      return ev;
    });

  const product: Record<string, unknown> = {
    productSector: f.sector,
    productInfo: {
      identification: {
        gtin: f.gtin,
        taricCode: f.taricCode,
        productName: f.productName,
        description: f.description,
        documentation: f.documentation,
        countryOfOrigin: { name: f.countryOfOrigin },
        productionDate: f.productionDate,
      },
      manufacturer:
        f.manufacturerMode === "existing"
          ? { id: f.manufacturerId }
          : {
              name: f.manufacturerName,
              url: f.manufacturerUrl,
            },
      material: {
        materialComposition: f.materialComposition.map(toMaterial),
        materialBills: f.materialBills,
        recycledReusedContent: f.recycledReusedContent.map(toMaterial),
      },
      sparePartsAvailability: f.sparePartsAvailability,
      hazardousSubstances: f.hazardousSubstances,
      substancesOfConcern: f.substancesOfConcern,
      sectorRequiredInformation: {
        extensionType: f.sectorType,
        assemblyProcess: {
          assemblyProcessDescription: f.sectorRequiredAssemblyDesc,
          assemblyAutomationLevel: f.sectorRequiredAssemblyAutomationLevel,
          assemblyLocation: {
            name: f.sectorRequiredAssemblyLocationName,
            address: f.sectorRequiredAssemblyLocationAddress,
          },
        },
        productionMethod: {
          productionMethodDescription: f.sectorRequiredProductionDesc,
          manufacturingTechnology: f.sectorRequiredManufacturingTechnology,
          processCertification: f.sectorRequiredProcessCertification,
        },
      },
      sectorNonRequiredInformation: {
        extensionType: f.sectorType,
        information: f.sectorNonRequiredInformationText,
        expectedEndConditionInfo: {
          expectedEndCondition: f.sectorNonRequiredExpectedEndCondition,
        },
        renewableEnergyProductionInfo: {
          renewableEnergyProductionValue: toBoolean(
            f.sectorNonRequiredRenewableEnergyProductionValue,
          ),
          renewableEnergyType: f.sectorNonRequiredRenewableEnergyType,
          ...toValueUnitObject(
            f.sectorNonRequiredRenewableEnergyOutput,
            "renewableEnergyOutput",
            "renewableEnergyOutputUnit",
          ),
        },
        materialSeparability: {
          separabilityScore: f.sectorNonRequiredSeparabilityScore
            ? Number(f.sectorNonRequiredSeparabilityScore)
            : "",
          separabilityMethod: f.sectorNonRequiredSeparabilityMethod,
        },
        componentModularity: {
          modularityScore: f.sectorNonRequiredModularityScore
            ? Number(f.sectorNonRequiredModularityScore)
            : "",
          replaceableComponent: f.sectorNonRequiredReplaceableComponent,
        },
        productDesignInfo: {
          productDesign: f.sectorNonRequiredProductDesign,
          designForDisassembly: toBoolean(f.sectorNonRequiredDesignForDisassembly),
        },
        appliedStandardsAndNorms: {
          appliedStandard: {
            name: f.sectorNonRequiredAppliedStandardName,
            identifier: f.sectorNonRequiredAppliedStandardIdentifier,
          },
          standardReference: f.sectorNonRequiredStandardReference,
        },
      },
      relatedObjects: f.relatedObjectsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      productSpecification: {
        extensionType: f.sectorType,
        height: toMeasurementEntry(f.specHeight),
        width: toMeasurementEntry(f.specWidth),
        depth: toMeasurementEntry(f.specDepth),
        weight: toMeasurementEntry(f.specWeight),
        ingressProtection: f.specIngressProtection,
        networkConnectivity: f.specNetworkConnectivity,
        batteryCapacity: toMeasurementEntry(f.specBatteryCapacity),
        chargingInterface: f.specChargingInterface,
        crossCompatibility: {
          crossCompatibilityDetails: f.specCrossCompatibilityDetails,
          compatibleInterfaceStandard: f.specCompatibleInterfaceStandard,
          compatibilityLevel: f.specCompatibilityLevel,
        },
        volume: toValueUnitObject(f.specVolumeMeasurement, "volumeValue", "volumeUnit"),
        components: {
          componentDescription: f.specComponentDescription,
          componentCount: f.specComponentCount ? Number(f.specComponentCount) : "",
        },
        installedSoftware: {
          installedSoftwareName: f.specInstalledSoftwareName,
          installedSoftwareVersion: f.specInstalledSoftwareVersion,
          softwareSupportEndDate: f.specSoftwareSupportEndDate,
        },
      },
      testReport: f.testReport,
      commercialInformation: {
        image: { url: f.imageUrl },
        lifetimeExpectancy: f.lifetimeExpectancy,
        warrantyPeriod: f.warrantyPeriod,
        takebackOption: f.takebackOption,
      },
      qualityAssessment: f.qualityAssessment,
      identifiedRisk: f.identifiedRisk,
    },
    compliance: {
      regulation: { name: f.regulationName, identifier: f.regulationIdentifier },
      productLabel: f.productLabels,
      productStatusAssessment: f.productStatusAssessment,
      certification: f.certifications,
      dataManagementMethod: { name: f.dmmName, identifier: f.dmmIdentifier },
    },
    supplyChain: {
      productTraceability: {
        traceabilityEvent: buildEvents(f.traceabilityEvents),
      },
      recyclingPartner: { name: f.recyclingPartnerName },
      customerReturnChannel: { name: f.customerReturnChannelName },
      componentSupplier: { name: f.componentSupplierName },
    },
    sustainability: {
      sustainabilityPerformance: {
        environmentalFootprint: f.environmentalFootprints.map(toEnvironmentalFootprint),
        resourceConsumption: f.resourceConsumptions.map(toResourceConsumption),
        plasticsRelease: f.plasticsRelease,
      },
      decomposability: f.decomposability,
      sectorSustainabilityIndicators: {
        extensionType: f.sectorType,
        indicator: f.sectorSustainabilityIndicatorsText,
      },
      criticalRawMaterial: f.criticalRawMaterials.map(toMaterial),
      lifeCycleAssessment: {
        lifeCycleAssessmentReport: f.lifeCycleAssessmentReport,
        environmentalImpact: f.environmentalImpacts.map(toEnvironmentalImpact),
      },
      renewableNonRenewableContent: f.renewableNonRenewableContent.map(toMaterial),
      circularEconomyIndicator: {
        extensionType: f.sectorType,
        indicator: f.circularEconomyIndicatorText,
      },
      socialIndicator: { labourConditions: f.labourConditions },
      sustainabilityAttributes: {
        resourceConsumptionWhenUsing: f.usingResourceConsumptions.map(toResourceConsumption),
        resourceConsumptionWhenRecovering: f.recoveringResourceConsumptions.map(
          toResourceConsumption,
        ),
      },
      environmentDeclaration: f.environmentDeclaration,
    },
    endOfLife: {
      recyclingReusePotential: f.recyclingReusePotential,
      disposalOptions: f.disposalOptions,
      unsoldProductsInformation: f.unsoldProductsInformation,
      expectedWaste: f.expectedWaste,
      reusability: f.reusability,
      repairability: f.repairability,
      refurbrishability: f.refurbrishability,
      upgradeOptions: f.upgradeOptions,
      endOfLifeHistory: buildEvents(f.endOfLifeHistory),
      numberOfLifecycles: f.numberOfLifecycles
        ? Number(f.numberOfLifecycles)
        : "",
      endOfLifeInformation: {
        wastePrevention: f.wastePrevention,
        separateCollection: f.separateCollection,
        collectionInformation: f.collectionInformation,
        endOfLifeReport: f.endOfLifeReport,
      },
    },
    guidelines: {
      assemblyGuideline: { url: f.assemblyGuidelineUrl },
      nonDestructiveDisassemblyGuideline: { url: f.disassemblyGuidelineUrl },
      productManual: { url: f.productManualUrl },
      storageAndTransportGuideline: {
        storageAndTransportGuideline: { url: f.storageGuidelineUrl },
      },
      commercialInstruction: {
        safetyInstruction: { url: f.safetyInstructionUrl },
        maintenanceInstruction: { url: f.maintenanceInstructionUrl },
        wasteSortingInstruction: { url: f.wasteSortingInstructionUrl },
      },
      accessibility: f.accessibility,
      utilizationCharacteristic: f.utilizationCharacteristic,
    },
    usage: {
      maintenanceLog: buildEvents(f.maintenanceLog),
      usageHistory: buildEvents(f.usageHistory),
      incidentsAndErrors: buildEvents(f.incidentsAndErrors),
    },
  };

  return pruneEmpty(product);
}

// ── Page Component ──────────────────────────────────────────────────────────

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [manufacturers, setManufacturers] = useState<ManufacturerOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const sectionSteps = [
    "Product Information",
    "Compliance",
    "Sustainability",
    "End of Life",
    "Guidelines & Manuals",
    // "Usage & Maintenance",
  ] as const;
  const [currentSectionStep, setCurrentSectionStep] = useState(0);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setField: FormSetter = (key, value) => set(key, value as never);

  useEffect(() => {
    let cancelled = false;
    const loadManufacturers = async () => {
      try {
        const res = await fetch("/api/manufacturers");
        if (!res.ok) return;
        const data = (await res.json()) as ManufacturerOption[];
        if (!cancelled) {
          const normalized = data
            .map((m) => ({
              ...m,
              id: m.id ?? m.identifier,
            }))
            .filter((m) => m.name && m.id);
          setManufacturers(normalized);
        }
      } catch {
        // Manufacturer lookup is optional for form usage.
      }
    };
    void loadManufacturers();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = buildPayload(form);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the product information organized by thematic data groups and
          data layers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap gap-2">
            {sectionSteps.map((step, index) => {
              const isActive = index === currentSectionStep;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentSectionStep(index)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    isActive
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}. {step}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Step {currentSectionStep + 1} of {sectionSteps.length}</span>
            <span>{sectionSteps[currentSectionStep]}</span>
          </div>
        </div>

        {/* ── PRODUCT INFORMATION ──────────────────────────────────────── */}
        {currentSectionStep === 0 && (
        <CollapsibleSection
          title="Product Information"
          color="blue"
          defaultOpen
        >
          <div>
                <label htmlFor="sector-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Sector
                </label>
                <select
                  id="sector-select"
                  value={form.sectorType}
                  onChange={(e) => {
                    const selected = SECTORS.find(
                      (s) => s.extensionType === e.target.value,
                    );
                    set("sectorType", selected?.extensionType ?? "");
                    set("sector", selected?.label ?? "");
                  }}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {SECTORS.map((s) => (
                    <option key={s.extensionType} value={s.extensionType}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Determines the extension type for sector-specific fields.
                </p>
              </div>
          {/* Regulatory layer */}
          <DataLayerGroup layer="Regulatory">
            {/* ProductIdentificationInformation */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              
              <legend className="text-sm font-semibold text-gray-800">
                Product Identification Information
              </legend>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Product Name"
                  value={form.productName}
                  onChange={(v) => set("productName", v)}
                  required
                />
                <FormField
                  label="GTIN"
                  value={form.gtin}
                  onChange={(v) => set("gtin", v)}
                  required
                />
                <FormField
                  label="TARIC Code"
                  value={form.taricCode}
                  onChange={(v) => set("taricCode", v)}
                />
                <div>
                  <label
                    htmlFor="country-origin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country of Origin
                  </label>
                  <select
                    id="country-origin"
                    value={form.countryOfOrigin}
                    onChange={(e) => set("countryOfOrigin", e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <FormField
                  label="Production Date"
                  value={form.productionDate}
                  onChange={(v) => set("productionDate", v)}
                  type="date"
                />
                <FormField
                  label="Documentation URL"
                  value={form.documentation}
                  onChange={(v) => set("documentation", v)}
                  type="url"
                />
              </div>
              <TextAreaField
                label="Description"
                value={form.description}
                onChange={(v) => set("description", v)}
              />
            </fieldset>

            {/* Manufacturer */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Manufacturer
              </legend>
              <div>
                <label
                  htmlFor="manufacturer-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company
                </label>
                <select
                  id="manufacturer-select"
                  value={form.manufacturerMode === "new" ? "__new__" : form.manufacturerId}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__new__") {
                      set("manufacturerMode", "new");
                      set("manufacturerId", "");
                      set("manufacturerName", "");
                      set("manufacturerUrl", "");
                    } else {
                      const selected = manufacturers.find((m) => m.id === val);
                      set("manufacturerMode", "existing");
                      set("manufacturerId", val);
                      set("manufacturerName", selected?.name ?? "");
                      set("manufacturerUrl", selected?.url ?? "");
                    }
                  }}
                  className={INPUT_CLASS}
                >
                  <option value="">Select a manufacturer…</option>
                  {manufacturers.map((m) => (
                    <option key={m.id ?? m.identifier ?? m.name} value={m.id ?? ""}>
                      {m.name}
                    </option>
                  ))}
                  <option value="__new__">+ Add a new manufacturer</option>
                </select>
              </div>

              {form.manufacturerMode === "new" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Company Name"
                    value={form.manufacturerName}
                    onChange={(v) => set("manufacturerName", v)}
                  />
                  <FormField
                    label="Company URL"
                    value={form.manufacturerUrl}
                    onChange={(v) => set("manufacturerUrl", v)}
                    type="url"
                  />
                </div>
              )}
            </fieldset>

            {/* MaterialInformation */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Material Information
              </legend>
              <MaterialArrayEditor
                label="Material Composition"
                items={form.materialComposition}
                onChange={(v) => set("materialComposition", v)}
                showPercentage
              />
              <FormField
                label="Material Bills URL"
                value={form.materialBills}
                onChange={(v) => set("materialBills", v)}
                type="url"
              />
              <MaterialArrayEditor
                label="Recycled / Reused Content"
                items={form.recycledReusedContent}
                onChange={(v) => set("recycledReusedContent", v)}
              />
            </fieldset>

            {/* SparePartsAvailability */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Spare Parts Availability
              </legend>
              <TextAreaField
                label="Spare Parts"
                value={form.sparePartsAvailability}
                onChange={(v) => set("sparePartsAvailability", v)}
              />
            </fieldset>

            {/* HazardousSubstances */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Hazardous Substances
              </legend>
              <NameDescArrayEditor
                label="Hazardous Substances"
                items={form.hazardousSubstances}
                onChange={(v) => set("hazardousSubstances", v)}
              />
            </fieldset>

            {/* SubstancesOfConcern */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Substances of Concern
              </legend>
              <NameDescArrayEditor
                label="Substances of Concern"
                items={form.substancesOfConcern}
                onChange={(v) => set("substancesOfConcern", v)}
              />
            </fieldset>

            {/* SectorRequiredInformation */}
            {renderExtensionSection("sectorRequiredInformation", form, setField)}
          </DataLayerGroup>

          {/* Sectoral layer */}
          <DataLayerGroup layer="Sectoral">
            {/* ProductSpecification */}
            {renderExtensionSection("productSpecification", form, setField)}

            {renderExtensionSection("sectorNonRequiredInformation", form, setField)}

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Related Objects
              </legend>
              <TextAreaField
                label="One related object URI/ID per line"
                value={form.relatedObjectsRaw}
                onChange={(v) => set("relatedObjectsRaw", v)}
                rows={4}
              />
            </fieldset>

            {/* TestReport */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Test Report
              </legend>
              <FormField
                label="Test Report URL"
                value={form.testReport}
                onChange={(v) => set("testReport", v)}
                type="url"
              />
            </fieldset>
          </DataLayerGroup>

          {/* Commercial layer */}
          <DataLayerGroup layer="Commercial">
            {/* ProductCommercialInformation */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Product Commercial Information
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Image URL"
                  value={form.imageUrl}
                  onChange={(v) => set("imageUrl", v)}
                  type="url"
                />
                <FormField
                  label="Lifetime Expectancy (ISO 8601)"
                  value={form.lifetimeExpectancy}
                  onChange={(v) => set("lifetimeExpectancy", v)}
                  placeholder="e.g., P5Y"
                />
                <FormField
                  label="Warranty Period (ISO 8601)"
                  value={form.warrantyPeriod}
                  onChange={(v) => set("warrantyPeriod", v)}
                  placeholder="e.g., P2Y"
                />
                <FormField
                  label="Takeback Option"
                  value={form.takebackOption}
                  onChange={(v) => set("takebackOption", v)}
                />
              </div>
            </fieldset>

            {/* QualityAssessment */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Quality Assessment
              </legend>
              <TextAreaField
                label="Quality Assessment"
                value={form.qualityAssessment}
                onChange={(v) => set("qualityAssessment", v)}
              />
            </fieldset>

            {/* IdentifiedRisk */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Identified Risk
              </legend>
              <TextAreaField
                label="Identified Risk"
                value={form.identifiedRisk}
                onChange={(v) => set("identifiedRisk", v)}
              />
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>
        )}

        {/* ── COMPLIANCE ───────────────────────────────────────────────── */}
        {currentSectionStep === 1 && (
        <CollapsibleSection title="Compliance" color="purple" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            {/* Regulation */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Regulation
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Regulation Name"
                  value={form.regulationName}
                  onChange={(v) => set("regulationName", v)}
                />
                <FormField
                  label="Regulation Identifier"
                  value={form.regulationIdentifier}
                  onChange={(v) => set("regulationIdentifier", v)}
                />
              </div>
            </fieldset>

            {/* ComplianceLabel */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Product Labels
              </legend>
              <LabelArrayEditor
                items={form.productLabels}
                onChange={(v) => set("productLabels", v)}
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            {/* ProductStatusAssessment */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Product Status Assessment
              </legend>
              <FormField
                label="Assessment URL"
                value={form.productStatusAssessment}
                onChange={(v) => set("productStatusAssessment", v)}
                type="url"
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            {/* Certification */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Certifications
              </legend>
              <NameDescArrayEditor
                label="Certifications"
                items={form.certifications}
                onChange={(v) => set("certifications", v)}
                namePlaceholder="Certification name"
                addLabel="+ Add Certification"
              />
            </fieldset>

            {/* DataManagementMethod */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Data Management Method
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Name"
                  value={form.dmmName}
                  onChange={(v) => set("dmmName", v)}
                />
                <FormField
                  label="Identifier"
                  value={form.dmmIdentifier}
                  onChange={(v) => set("dmmIdentifier", v)}
                />
              </div>
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>
        )}

        {/* ── SUSTAINABILITY ───────────────────────────────────────────── */}
        {currentSectionStep === 2 && (
        <CollapsibleSection title="Sustainability" color="emerald" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            {/* SustainabilityPerformance */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Sustainability Performance
              </legend>
              <EnvironmentalFootprintArrayEditor
                items={form.environmentalFootprints}
                onChange={(v) => set("environmentalFootprints", v)}
              />
              <ResourceConsumptionArrayEditor
                label="Resource Consumption"
                items={form.resourceConsumptions}
                onChange={(v) => set("resourceConsumptions", v)}
              />
              <TextAreaField
                label="Plastics Release"
                value={form.plasticsRelease}
                onChange={(v) => set("plasticsRelease", v)}
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            {/* Decomposability */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Decomposability
              </legend>
              <TextAreaField
                label="Decomposability"
                value={form.decomposability}
                onChange={(v) => set("decomposability", v)}
              />
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Sector Sustainability Indicators
              </legend>
              <TextAreaField
                label="Sector indicators"
                value={form.sectorSustainabilityIndicatorsText}
                onChange={(v) => set("sectorSustainabilityIndicatorsText", v)}
              />
            </fieldset>

            {/* CriticalRawMaterial */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Critical Raw Materials
              </legend>
              <MaterialArrayEditor
                label="Critical Raw Materials"
                items={form.criticalRawMaterials}
                onChange={(v) => set("criticalRawMaterials", v)}
              />
            </fieldset>

            {/* LifeCycleAssessment */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Life Cycle Assessment
              </legend>
              <FormField
                label="LCA Report URL"
                value={form.lifeCycleAssessmentReport}
                onChange={(v) => set("lifeCycleAssessmentReport", v)}
                type="url"
              />
              <EnvironmentalImpactArrayEditor
                items={form.environmentalImpacts}
                onChange={(v) => set("environmentalImpacts", v)}
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            {/* RenewableNonRenewableContent */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Renewable / Non-Renewable Content
              </legend>
              <MaterialArrayEditor
                label="Materials"
                items={form.renewableNonRenewableContent}
                onChange={(v) => set("renewableNonRenewableContent", v)}
              />
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Circular Economy Indicator
              </legend>
              <TextAreaField
                label="Circular economy indicator"
                value={form.circularEconomyIndicatorText}
                onChange={(v) => set("circularEconomyIndicatorText", v)}
              />
            </fieldset>

            {/* SocialIndicator */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Social Indicator
              </legend>
              <TextAreaField
                label="Labour Conditions"
                value={form.labourConditions}
                onChange={(v) => set("labourConditions", v)}
              />
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Sustainability Attributes
              </legend>
              <div className="space-y-4">
                <ResourceConsumptionArrayEditor
                  label="Resource Consumption When Using"
                  items={form.usingResourceConsumptions}
                  onChange={(v) => set("usingResourceConsumptions", v)}
                />
                <ResourceConsumptionArrayEditor
                  label="Resource Consumption When Recovering"
                  items={form.recoveringResourceConsumptions}
                  onChange={(v) => set("recoveringResourceConsumptions", v)}
                />
              </div>
            </fieldset>

            {/* EnvironmentDeclaration */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Environment Declaration
              </legend>
              <FormField
                label="Declaration URL"
                value={form.environmentDeclaration}
                onChange={(v) => set("environmentDeclaration", v)}
                type="url"
              />
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>
        )}

        {/* ── END OF LIFE ──────────────────────────────────────────────── */}
        {currentSectionStep === 3 && (
        <CollapsibleSection title="End of Life" color="rose" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Recycling & Disposal
              </legend>
              <TextAreaField
                label="Recycling / Reuse Potential"
                value={form.recyclingReusePotential}
                onChange={(v) => set("recyclingReusePotential", v)}
              />
              <TextAreaField
                label="Disposal Options"
                value={form.disposalOptions}
                onChange={(v) => set("disposalOptions", v)}
              />
              <TextAreaField
                label="Unsold Products Information"
                value={form.unsoldProductsInformation}
                onChange={(v) => set("unsoldProductsInformation", v)}
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Expected Waste
              </legend>
              <TextAreaField
                label="Expected Waste"
                value={form.expectedWaste}
                onChange={(v) => set("expectedWaste", v)}
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Circularity Options
              </legend>
              <div className="space-y-4">
                <TextAreaField
                  label="Reusability"
                  value={form.reusability}
                  onChange={(v) => set("reusability", v)}
                />
                <TextAreaField
                  label="Repairability"
                  value={form.repairability}
                  onChange={(v) => set("repairability", v)}
                />
                <TextAreaField
                  label="Refurbrishability"
                  value={form.refurbrishability}
                  onChange={(v) => set("refurbrishability", v)}
                />
                <TextAreaField
                  label="Upgrade Options"
                  value={form.upgradeOptions}
                  onChange={(v) => set("upgradeOptions", v)}
                />
              </div>
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Downstream Data">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                End-of-Life Lifecycle Data
              </legend>
              <EventArrayEditor
                label="End-of-Life History"
                events={form.endOfLifeHistory}
                onChange={(v) => set("endOfLifeHistory", v)}
              />
              <FormField
                label="Number of Lifecycles"
                value={form.numberOfLifecycles}
                onChange={(v) => set("numberOfLifecycles", v)}
                type="number"
              />
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                End-of-Life Information
              </legend>
              <div className="space-y-4">
                <TextAreaField
                  label="Waste Prevention"
                  value={form.wastePrevention}
                  onChange={(v) => set("wastePrevention", v)}
                />
                <TextAreaField
                  label="Separate Collection"
                  value={form.separateCollection}
                  onChange={(v) => set("separateCollection", v)}
                />
                <TextAreaField
                  label="Collection Information"
                  value={form.collectionInformation}
                  onChange={(v) => set("collectionInformation", v)}
                />
                <FormField
                  label="End-of-Life Report URL"
                  value={form.endOfLifeReport}
                  onChange={(v) => set("endOfLifeReport", v)}
                  type="url"
                />
              </div>
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>
        )}

        {/* ── GUIDELINES & MANUALS ─────────────────────────────────────── */}
        {currentSectionStep === 4 && (
        <CollapsibleSection title="Guidelines & Manuals" color="cyan" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Assembly & Disassembly Guides
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Assembly Guideline URL"
                  value={form.assemblyGuidelineUrl}
                  onChange={(v) => set("assemblyGuidelineUrl", v)}
                  type="url"
                />
                <FormField
                  label="Non-Destructive Disassembly URL"
                  value={form.disassemblyGuidelineUrl}
                  onChange={(v) => set("disassemblyGuidelineUrl", v)}
                  type="url"
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Product Manual
              </legend>
              <FormField
                label="Product Manual URL"
                value={form.productManualUrl}
                onChange={(v) => set("productManualUrl", v)}
                type="url"
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Storage & Transport
              </legend>
              <FormField
                label="Storage & Transport Guideline URL"
                value={form.storageGuidelineUrl}
                onChange={(v) => set("storageGuidelineUrl", v)}
                type="url"
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Commercial Instructions
              </legend>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Safety Instruction URL"
                  value={form.safetyInstructionUrl}
                  onChange={(v) => set("safetyInstructionUrl", v)}
                  type="url"
                />
                <FormField
                  label="Maintenance Instruction URL"
                  value={form.maintenanceInstructionUrl}
                  onChange={(v) => set("maintenanceInstructionUrl", v)}
                  type="url"
                />
                <FormField
                  label="Waste Sorting Instruction URL"
                  value={form.wasteSortingInstructionUrl}
                  onChange={(v) => set("wasteSortingInstructionUrl", v)}
                  type="url"
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Accessibility & Utilization
              </legend>
              <TextAreaField
                label="Accessibility"
                value={form.accessibility}
                onChange={(v) => set("accessibility", v)}
              />
              <TextAreaField
                label="Utilization Characteristic"
                value={form.utilizationCharacteristic}
                onChange={(v) => set("utilizationCharacteristic", v)}
              />
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>
        )}

        {/* ── USAGE & MAINTENANCE ──────────────────────────────────────── */}
        {currentSectionStep === 5 && (
        <CollapsibleSection title="Usage & Maintenance" color="indigo" defaultOpen>
          <DataLayerGroup layer="Downstream Data">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Maintenance Log
              </legend>
              <EventArrayEditor
                label="Maintenance Events"
                events={form.maintenanceLog}
                onChange={(v) => set("maintenanceLog", v)}
              />
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Usage History
              </legend>
              <EventArrayEditor
                label="Usage Events"
                events={form.usageHistory}
                onChange={(v) => set("usageHistory", v)}
              />
            </fieldset>

            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Incidents & Errors
              </legend>
              <EventArrayEditor
                label="Incident Events"
                events={form.incidentsAndErrors}
                onChange={(v) => set("incidentsAndErrors", v)}
              />
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>
        )}

        {/* ── SUBMIT ───────────────────────────────────────────────────── */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setCurrentSectionStep((prev) => Math.max(prev - 1, 0))
              }
              disabled={currentSectionStep === 0}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous Section
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentSectionStep((prev) =>
                  Math.min(prev + 1, sectionSteps.length - 1),
                )
              }
              disabled={currentSectionStep === sectionSteps.length - 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next Section
            </button>
          </div>

          <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Submitting…" : "Add Product"}
          </button>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Product added successfully! Redirecting…
            </div>
          )}
          </div>
        </div>
      </form>
    </main>
  );
}
