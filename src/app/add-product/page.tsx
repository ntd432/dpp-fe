"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, TextAreaField } from "@/components/form/FormField";
import {
  CollapsibleSection,
  DataLayerGroup,
} from "@/components/form/CollapsibleSection";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Remove empty strings, empty arrays, empty objects, and _key fields recursively. */
function pruneEmpty(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "_key") continue;
    if (v === "" || v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      const filtered = v
        .map((item) =>
          typeof item === "object" && item !== null
            ? pruneEmpty(item as Record<string, unknown>)
            : item,
        )
        .filter(
          (item) =>
            item !== "" &&
            item !== undefined &&
            !(typeof item === "object" && Object.keys(item).length === 0),
        );
      if (filtered.length > 0) result[k] = filtered;
    } else if (typeof v === "object") {
      const pruned = pruneEmpty(v as Record<string, unknown>);
      if (Object.keys(pruned).length > 0) result[k] = pruned;
    } else {
      result[k] = v;
    }
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
  value: string,
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

// ── Event array helpers ─────────────────────────────────────────────────────

interface EventEntry {
  _key: string;
  actionName: string;
  actionType: string;
  time: string;
  locationName: string;
}

const emptyEvent = (): EventEntry => ({
  _key: uid(),
  actionName: "",
  actionType: "",
  time: "",
  locationName: "",
});

function EventArrayEditor({
  label,
  events,
  onChange,
  showType,
  showLocation,
}: Readonly<{
  label: string;
  events: EventEntry[];
  onChange: (events: EventEntry[]) => void;
  showType?: boolean;
  showLocation?: boolean;
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
            {showType && (
              <input
                type="text"
                placeholder="Action type"
                value={ev.actionType}
                onChange={(e) => updateAt(events, i, "actionType", e.target.value, onChange)}
                className={INPUT_CLASS}
              />
            )}
            {showLocation && (
              <input
                type="text"
                placeholder="Location name"
                value={ev.locationName}
                onChange={(e) => updateAt(events, i, "locationName", e.target.value, onChange)}
                className={INPUT_CLASS}
              />
            )}
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

// ── Material array helpers ──────────────────────────────────────────────────

interface MaterialEntry {
  _key: string;
  materialName: string;
  materialPercentage: string;
}

function MaterialArrayEditor({
  label,
  items,
  onChange,
  showPercentage,
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
          onClick={() => onChange([...items, { _key: uid(), materialName: "", materialPercentage: "" }])}
          className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
        >
          + Add Material
        </button>
      </div>
      {items.map((m, i) => (
        <div key={m._key} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Material name"
            value={m.materialName}
            onChange={(e) => updateAt(items, i, "materialName", e.target.value, onChange)}
            className={`flex-1 ${INPUT_CLASS}`}
          />
          {showPercentage && (
            <input
              type="number"
              placeholder="%"
              value={m.materialPercentage}
              onChange={(e) => updateAt(items, i, "materialPercentage", e.target.value, onChange)}
              className={`w-20 ${INPUT_CLASS}`}
            />
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
  manufacturerName: string;
  manufacturerUrl: string;
  manufacturerIdentifier: string;
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
  sectorRequiredProductionDesc: string;
  // Product Information - Product Specification (Extension)
  specDimensions: string;
  specWeight: string;
  specIngressProtection: string;
  specNetwork: string;
  specBatteryCapacity: string;
  specCharging: string;
  // Product Information - Test Report
  testReport: string;
  // Product Information - Commercial
  imageUrl: string;
  imageCaption: string;
  lifetimeExpectancy: string;
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
  envFootprintType: string;
  envFootprintMethod: string;
  envFootprintUnit: string;
  envFootprintValue: string;
  resourceName: string;
  resourceUnit: string;
  resourceValue: string;
  decomposability: string;
  criticalRawMaterials: MaterialEntry[];
  lifeCycleAssessment: string;
  renewableNonRenewableContent: MaterialEntry[];
  labourConditions: string;
  environmentDeclaration: string;
  // End of Life
  recyclingReusePotential: string;
  disposalOptions: string;
  expectedWaste: string;
  reusability: string;
  repairability: string;
  refurbrishability: string;
  upgradeOptions: string;
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
  sectorType: "ElectronicExtension",
  gtin: "",
  taricCode: "",
  productName: "",
  description: "",
  documentation: "",
  countryOfOrigin: "",
  productionDate: "",
  manufacturerName: "",
  manufacturerUrl: "",
  manufacturerIdentifier: "",
  materialComposition: [],
  materialBills: "",
  recycledReusedContent: [],
  sparePartsAvailability: "",
  hazardousSubstances: [],
  substancesOfConcern: [],
  sectorRequiredAssemblyDesc: "",
  sectorRequiredProductionDesc: "",
  specDimensions: "",
  specWeight: "",
  specIngressProtection: "",
  specNetwork: "",
  specBatteryCapacity: "",
  specCharging: "",
  testReport: "",
  imageUrl: "",
  imageCaption: "",
  lifetimeExpectancy: "",
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
  envFootprintType: "",
  envFootprintMethod: "",
  envFootprintUnit: "",
  envFootprintValue: "",
  resourceName: "",
  resourceUnit: "",
  resourceValue: "",
  decomposability: "",
  criticalRawMaterials: [],
  lifeCycleAssessment: "",
  renewableNonRenewableContent: [],
  labourConditions: "",
  environmentDeclaration: "",
  recyclingReusePotential: "",
  disposalOptions: "",
  expectedWaste: "",
  reusability: "",
  repairability: "",
  refurbrishability: "",
  upgradeOptions: "",
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

// ── Build payload ───────────────────────────────────────────────────────────

function buildPayload(f: FormState): Record<string, unknown> {
  const formatTime = (t: string) => (t ? t.replace("T", "T") + ":00Z" : "");

  const buildEvents = (events: EventEntry[], withType: boolean, withLocation: boolean) =>
    events.map((e) => {
      const ev: Record<string, unknown> = {};
      if (e.actionName) ev.actionName = e.actionName;
      if (withType && e.actionType) ev.actionType = e.actionType;
      if (e.time) ev.time = formatTime(e.time);
      if (withLocation && e.locationName) ev.location = { name: e.locationName };
      return ev;
    });

  const product: Record<string, unknown> = {
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
      manufacturer: {
        name: f.manufacturerName,
        url: f.manufacturerUrl,
        identifier: f.manufacturerIdentifier,
      },
      material: {
        materialComposition: f.materialComposition.map((m) => ({
          materialName: m.materialName,
          ...(m.materialPercentage
            ? { materialPercentage: Number(m.materialPercentage) }
            : {}),
        })),
        materialBills: f.materialBills,
        recycledReusedContent: f.recycledReusedContent.map((m) => ({
          materialName: m.materialName,
        })),
      },
      sparePartsAvailability: f.sparePartsAvailability,
      hazardousSubstances: f.hazardousSubstances,
      substancesOfConcern: f.substancesOfConcern,
      sectorRequiredInformation: {
        extensionType: f.sectorType,
        assemblyProcess: { assemblyProcessDescription: f.sectorRequiredAssemblyDesc },
        productionMethod: { productionMethodDescription: f.sectorRequiredProductionDesc },
      },
      productSpecification: {
        extensionType: f.sectorType,
        dimensions: f.specDimensions,
        weight: f.specWeight,
        ingressProtection: f.specIngressProtection,
        network: f.specNetwork,
        batteryCapacity: f.specBatteryCapacity,
        charging: f.specCharging,
      },
      testReport: f.testReport,
      commercialInformation: {
        image: { url: f.imageUrl, caption: f.imageCaption },
        lifetimeExpectancy: f.lifetimeExpectancy,
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
        traceabilityEvent: buildEvents(f.traceabilityEvents, true, true),
      },
      recyclingPartner: { name: f.recyclingPartnerName },
      customerReturnChannel: { name: f.customerReturnChannelName },
      componentSupplier: { name: f.componentSupplierName },
    },
    sustainability: {
      sustainabilityPerformance: {
        environmentalFootprint: {
          environmentalFootprintType: f.envFootprintType,
          environmentalFootprintMeasuringMethod: f.envFootprintMethod,
          environmentalFootprintUnit: f.envFootprintUnit,
          environmentalFootprintValue: f.envFootprintValue
            ? Number(f.envFootprintValue)
            : "",
        },
        resourceConsumption: {
          resource: f.resourceName,
          resourceConsumptionUnit: f.resourceUnit,
          resourceConsumptionValue: f.resourceValue
            ? Number(f.resourceValue)
            : "",
        },
      },
      decomposability: f.decomposability,
      criticalRawMaterial: f.criticalRawMaterials.map((m) => ({
        materialName: m.materialName,
      })),
      lifeCycleAssessment: f.lifeCycleAssessment,
      renewableNonRenewableContent: f.renewableNonRenewableContent.map(
        (m) => ({ materialName: m.materialName }),
      ),
      socialIndicator: { labourConditions: f.labourConditions },
      environmentDeclaration: f.environmentDeclaration,
    },
    endOfLife: {
      recyclingReusePotential: f.recyclingReusePotential,
      disposalOptions: f.disposalOptions,
      expectedWaste: f.expectedWaste,
      reusability: f.reusability,
      repairability: f.repairability,
      refurbrishability: f.refurbrishability,
      upgradeOptions: f.upgradeOptions,
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
      maintenanceLog: buildEvents(f.maintenanceLog, false, false),
      usageHistory: buildEvents(f.usageHistory, false, false),
      incidentsAndErrors: buildEvents(f.incidentsAndErrors, false, false),
    },
  };

  return pruneEmpty(product);
}

// ── Page Component ──────────────────────────────────────────────────────────

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
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

      {/* Sector selector */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
        <label htmlFor="sector-select" className="block text-sm font-medium text-gray-700 mb-2">
          Product Sector
        </label>
        <select
          id="sector-select"
          value={form.sectorType}
          onChange={(e) => set("sectorType", e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="ElectronicExtension">Electronics</option>
        </select>
        <p className="mt-1 text-xs text-gray-400">
          Determines the extension type for sector-specific fields.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── PRODUCT INFORMATION ──────────────────────────────────────── */}
        <CollapsibleSection
          title="Product Information"
          color="blue"
          defaultOpen={true}
        >
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
                <FormField
                  label="Country of Origin"
                  value={form.countryOfOrigin}
                  onChange={(v) => set("countryOfOrigin", v)}
                />
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
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Name"
                  value={form.manufacturerName}
                  onChange={(v) => set("manufacturerName", v)}
                />
                <FormField
                  label="URL"
                  value={form.manufacturerUrl}
                  onChange={(v) => set("manufacturerUrl", v)}
                  type="url"
                />
                <FormField
                  label="Identifier"
                  value={form.manufacturerIdentifier}
                  onChange={(v) => set("manufacturerIdentifier", v)}
                />
              </div>
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
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Sector Required Information
              </legend>
              <TextAreaField
                label="Assembly Process Description"
                value={form.sectorRequiredAssemblyDesc}
                onChange={(v) => set("sectorRequiredAssemblyDesc", v)}
              />
              <TextAreaField
                label="Production Method Description"
                value={form.sectorRequiredProductionDesc}
                onChange={(v) => set("sectorRequiredProductionDesc", v)}
              />
            </fieldset>
          </DataLayerGroup>

          {/* Sectoral layer */}
          <DataLayerGroup layer="Sectoral">
            {/* ProductSpecification */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Product Specification
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Dimensions"
                  value={form.specDimensions}
                  onChange={(v) => set("specDimensions", v)}
                  placeholder="e.g., 149.6 x 71.5 x 8.2 mm"
                />
                <FormField
                  label="Weight"
                  value={form.specWeight}
                  onChange={(v) => set("specWeight", v)}
                  placeholder="e.g., 199 g"
                />
                <FormField
                  label="Ingress Protection"
                  value={form.specIngressProtection}
                  onChange={(v) => set("specIngressProtection", v)}
                  placeholder="e.g., IP68"
                />
                <FormField
                  label="Network"
                  value={form.specNetwork}
                  onChange={(v) => set("specNetwork", v)}
                  placeholder="e.g., 5G"
                />
                <FormField
                  label="Battery Capacity"
                  value={form.specBatteryCapacity}
                  onChange={(v) => set("specBatteryCapacity", v)}
                  placeholder="e.g., 3274 mAh"
                />
                <FormField
                  label="Charging"
                  value={form.specCharging}
                  onChange={(v) => set("specCharging", v)}
                  placeholder="e.g., USB-C"
                />
              </div>
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
                  label="Image Caption"
                  value={form.imageCaption}
                  onChange={(v) => set("imageCaption", v)}
                />
                <FormField
                  label="Lifetime Expectancy (ISO 8601)"
                  value={form.lifetimeExpectancy}
                  onChange={(v) => set("lifetimeExpectancy", v)}
                  placeholder="e.g., P5Y"
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

        {/* ── COMPLIANCE ───────────────────────────────────────────────── */}
        <CollapsibleSection title="Compliance" color="purple">
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

        {/* ── SUPPLY CHAIN ─────────────────────────────────────────────── */}
        <CollapsibleSection title="Supply Chain" color="amber">
          <DataLayerGroup layer="Regulatory">
            {/* ProductTraceability */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Product Traceability
              </legend>
              <EventArrayEditor
                label="Traceability Events"
                events={form.traceabilityEvents}
                onChange={(v) => set("traceabilityEvents", v)}
                showType
                showLocation
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            {/* RecyclingPartner, CustomerReturnChannel, ComponentSupplier */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Supply Chain Partners
              </legend>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Recycling Partner"
                  value={form.recyclingPartnerName}
                  onChange={(v) => set("recyclingPartnerName", v)}
                />
                <FormField
                  label="Customer Return Channel"
                  value={form.customerReturnChannelName}
                  onChange={(v) => set("customerReturnChannelName", v)}
                />
                <FormField
                  label="Component Supplier"
                  value={form.componentSupplierName}
                  onChange={(v) => set("componentSupplierName", v)}
                />
              </div>
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>

        {/* ── SUSTAINABILITY ───────────────────────────────────────────── */}
        <CollapsibleSection title="Sustainability" color="emerald">
          <DataLayerGroup layer="Regulatory">
            {/* SustainabilityPerformance */}
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Sustainability Performance
              </legend>
              <p className="text-xs text-gray-500 font-medium">
                Environmental Footprint
              </p>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Type"
                  value={form.envFootprintType}
                  onChange={(v) => set("envFootprintType", v)}
                  placeholder="e.g., Carbon footprint"
                />
                <FormField
                  label="Measuring Method"
                  value={form.envFootprintMethod}
                  onChange={(v) => set("envFootprintMethod", v)}
                />
                <FormField
                  label="Unit"
                  value={form.envFootprintUnit}
                  onChange={(v) => set("envFootprintUnit", v)}
                  placeholder="e.g., kg CO2e"
                />
                <FormField
                  label="Value"
                  value={form.envFootprintValue}
                  onChange={(v) => set("envFootprintValue", v)}
                  type="number"
                />
              </div>
              <p className="text-xs text-gray-500 font-medium mt-4">
                Resource Consumption
              </p>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Resource"
                  value={form.resourceName}
                  onChange={(v) => set("resourceName", v)}
                />
                <FormField
                  label="Unit"
                  value={form.resourceUnit}
                  onChange={(v) => set("resourceUnit", v)}
                />
                <FormField
                  label="Value"
                  value={form.resourceValue}
                  onChange={(v) => set("resourceValue", v)}
                  type="number"
                />
              </div>
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
                value={form.lifeCycleAssessment}
                onChange={(v) => set("lifeCycleAssessment", v)}
                type="url"
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

        {/* ── END OF LIFE ──────────────────────────────────────────────── */}
        <CollapsibleSection title="End of Life" color="rose">
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

        {/* ── GUIDELINES & MANUALS ─────────────────────────────────────── */}
        <CollapsibleSection title="Guidelines & Manuals" color="cyan">
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

        {/* ── USAGE & MAINTENANCE ──────────────────────────────────────── */}
        <CollapsibleSection title="Usage & Maintenance" color="indigo">
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

        {/* ── SUBMIT ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 pt-4">
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
      </form>
    </main>
  );
}
