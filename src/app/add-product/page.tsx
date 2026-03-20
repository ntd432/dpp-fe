"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, TextAreaField } from "@/components/form/FormField";
import {
  CollapsibleSection,
  DataLayerGroup,
} from "@/components/form/CollapsibleSection";
import {
  EXTENSION_FIELD_CONFIG,
  EXTENSION_SECTION_LABELS,
  type ExtensionSectionKey,
} from "@/config/product-extension-fields";
import { AddEntryButton } from "@/components/form/AddEntryButton";
import { ProductInformationStep } from "@/app/add-product/steps/ProductInformationStep";
import { ComplianceStep } from "@/app/add-product/steps/ComplianceStep";
import { SustainabilityStep } from "@/app/add-product/steps/SustainabilityStep";
import { EndOfLifeStep } from "@/app/add-product/steps/EndOfLifeStep";
import { GuidelinesStep } from "@/app/add-product/steps/GuidelinesStep";

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
  "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]";

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

interface ImportedLeaf {
  path: string;
  value: string;
}

interface FieldMapping {
  targetField: string;
  sourcePath: string;
  value: string;
}

type LeafUsageStatus = "mapped" | "custom";

interface CustomFieldEntry {
  _key: string;
  key: string;
  value: string;
  sourcePath?: string;
}

type CustomFieldGroupKey =
  | "productInfoCustomFields"
  | "complianceCustomFields"
  | "sustainabilityCustomFields"
  | "endOfLifeCustomFields"
  | "guidelinesCustomFields";

const DRAG_MIME = "application/x-dpp-json-leaf";

function stringifyJsonLeaf(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function collectJsonLeaves(value: unknown, basePath = "root"): ImportedLeaf[] {
  if (value === null || value === undefined) {
    return [{ path: basePath, value: stringifyJsonLeaf(value) }];
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [{ path: basePath, value: "[]" }];
    }
    return value.flatMap((item, index) => collectJsonLeaves(item, `${basePath}[${index}]`));
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return [{ path: basePath, value: "{}" }];
    }
    return entries.flatMap(([key, nested]) =>
      collectJsonLeaves(nested, basePath === "root" ? key : `${basePath}.${key}`),
    );
  }

  return [{ path: basePath, value: stringifyJsonLeaf(value) }];
}

function normalizeJsonPath(path: string): string {
  return path.replaceAll(/\[\d+\]/g, "").replaceAll(/^root\.?/g, "");
}

function customFieldNameFromLeafPath(path: string): string {
  const normalized = normalizeJsonPath(path);
  if (!normalized) return "customField";
  const parts = normalized.split(".").filter(Boolean);
  return parts.at(-1) || normalized;
}

function setControlledElementValue(target: EventTarget | null, value: string): string | null {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return null;
  }

  if (target instanceof HTMLSelectElement) {
    const hasOption = Array.from(target.options).some((option) => option.value === value);
    if (!hasOption) {
      return null;
    }
    target.value = value;
    target.dispatchEvent(new Event("change", { bubbles: true }));
    return target.value;
  }

  const nativeSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), "value")?.set;
  nativeSetter?.call(target, value);
  target.dispatchEvent(new Event("input", { bubbles: true }));
  target.dispatchEvent(new Event("change", { bubbles: true }));
  return target.value;
}

function inferFieldNameFromElement(target: EventTarget | null): string {
  if (!(target instanceof HTMLElement)) return "Unknown field";

  const inputElement = target.closest("input, textarea, select");

  if (!inputElement) return "Unknown field";

  if (inputElement.id) {
    const explicitLabel = document.querySelector(`label[for="${inputElement.id}"]`);
    if (explicitLabel?.textContent?.trim()) {
      return explicitLabel.textContent.trim();
    }
  }

  const wrappingLabel = inputElement.closest("label");
  if (wrappingLabel?.textContent?.trim()) {
    return wrappingLabel.textContent.trim();
  }

  const parent = inputElement.closest("div");
  const localLabel = parent?.querySelector("label, legend, span");
  if (localLabel?.textContent?.trim()) {
    return localLabel.textContent.trim();
  }

  const placeholder =
    inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement
      ? inputElement.placeholder
      : "";

  return placeholder || inputElement.getAttribute("name") || inputElement.id || "Unknown field";
}

function JsonTree({
  value,
  path,
  onLeafDrag,
  onLeafClick,
  leafUsageByPath,
}: Readonly<{
  value: unknown;
  path: string;
  onLeafDrag: (leaf: ImportedLeaf, event: React.DragEvent<HTMLElement>) => void;
  onLeafClick: (leaf: ImportedLeaf) => void;
  leafUsageByPath: Record<string, LeafUsageStatus>;
}>): React.ReactNode {
  const [open, setOpen] = useState(path === "root");

  if (Array.isArray(value)) {
    return (
      <div className="ml-4">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-xs text-gray-600 hover:text-gray-900 hover:cursor-pointer"
        >
          {open ? "▾" : "▸"} {path.split(".")[path.split(".").length - 1]} [{value.length}]
        </button>
        {open && (
          <div className="mt-1 space-y-1">
            {value.map((item, index) => (
              <JsonTree
                key={`${path}[${index}]`}
                value={item}
                path={`${path}[${index}]`}
                onLeafDrag={onLeafDrag}
                onLeafClick={onLeafClick}
                  leafUsageByPath={leafUsageByPath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <div className="ml-4">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-xs text-gray-600 hover:text-gray-900 hover:cursor-pointer"
        >
          {open ? "▾" : "▸"} {path.split(".")[path.split(".").length - 1]} {"{"}{entries.length}{"}"}
        </button>
        {open && (
          <div className="mt-1 space-y-1">
            {entries.map(([key, nestedValue]) => {
              const nextPath = path === "root" ? key : `${path}.${key}`;
              return (
                <JsonTree
                  key={nextPath}
                  value={nestedValue}
                  path={nextPath}
                  onLeafDrag={onLeafDrag}
                  onLeafClick={onLeafClick}
                  leafUsageByPath={leafUsageByPath}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const leaf: ImportedLeaf = {
    path: path,
    value: stringifyJsonLeaf(value),
  };
  const leafUsage = leafUsageByPath[leaf.path];
  const isLocked = leafUsage !== undefined;
  const leafClasses =
    leafUsage === "mapped"
      ? "border-[var(--color-brand-pink)] bg-[var(--color-brand-pink)]/6 text-[var(--color-brand-pink)]"
      : leafUsage === "custom"
        ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/6 text-[var(--color-brand-blue)]"
        : "border-gray-200 bg-white";
  const leafHint =
    leafUsage === "mapped"
      ? "Already mapped to an existing form field"
      : leafUsage === "custom"
        ? "Already added to custom fields"
        : "Click to map to focused field, or drag to a field";

  return (
    <button
      type="button"
      className={`ml-4 w-full text-left rounded border px-2 py-1 text-xs ${leafClasses} ${
        isLocked ? "cursor-not-allowed opacity-80" : "cursor-grab active:cursor-grabbing"
      } hover:cursor-pointer`}
      draggable={!isLocked}
      onDragStart={(event) => {
        if (isLocked) {
          event.preventDefault();
          return;
        }
        onLeafDrag(leaf, event);
      }}
      onClick={() => {
        if (isLocked) return;
        onLeafClick(leaf);
      }}
      title={leafHint}
    >
      <div className="font-medium text-gray-700 truncate">{path.split(".")[path.split(".").length - 1]}</div>
      <div className="text-gray-500 truncate">{leaf.value}</div>
    </button>
  );
}

function CustomFieldsEditor({
  title,
  items,
  onChange,
  canUseLeaf,
}: Readonly<{
  title: string;
  items: CustomFieldEntry[];
  onChange: (items: CustomFieldEntry[]) => void;
  canUseLeaf: (leaf: ImportedLeaf) => boolean;
}>): React.ReactNode {
  const canHandleDrop = (event: React.DragEvent<HTMLElement>) =>
    event.dataTransfer.types.includes(DRAG_MIME);

  const parseDroppedLeaf = (event: React.DragEvent<HTMLElement>): ImportedLeaf | null => {
    const raw = event.dataTransfer.getData(DRAG_MIME);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as ImportedLeaf;
    } catch {
      return null;
    }
  };

  const appendLeafAsNewField = (leaf: ImportedLeaf) => {
    onChange([
      ...items,
      {
        _key: uid(),
        key: customFieldNameFromLeafPath(leaf.path),
        value: leaf.value,
        sourcePath: leaf.path,
      },
    ]);
  };

  return (
    <details
      open
      className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
      onDragOver={(event) => {
        if (!canHandleDrop(event)) return;
        event.preventDefault();
      }}
      onDrop={(event) => {
        if (!canHandleDrop(event)) return;
        event.preventDefault();
        event.stopPropagation();
        const leaf = parseDroppedLeaf(event);
        if (!leaf) return;
        if (!canUseLeaf(leaf)) return;
        appendLeafAsNewField(leaf);
      }}
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          {title}
          <svg
            className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="space-y-3 px-4 pb-4 pt-2">
      <p className="text-xs text-gray-500">
        Define manual fields and drag imported JSON values here to auto-fill key and value.
      </p>
      <div className="space-y-2">
        {items.map((field, index) => (
          <div
            key={field._key}
            className="grid grid-cols-[1fr_1fr_auto] gap-2"
          >
            <input
              type="text"
              placeholder="Field name"
              value={field.key}
              onChange={(event) => updateAt(items, index, "key", event.target.value, onChange)}
              onDragOver={(event) => {
                if (!canHandleDrop(event)) return;
                event.preventDefault();
              }}
              onDrop={(event) => {
                if (!canHandleDrop(event)) return;
                event.preventDefault();
                event.stopPropagation();
                const leaf = parseDroppedLeaf(event);
                if (!leaf) return;
                if (!canUseLeaf(leaf)) return;
                appendLeafAsNewField(leaf);
              }}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Value"
              value={field.value}
              onChange={(event) => updateAt(items, index, "value", event.target.value, onChange)}
              onDragOver={(event) => {
                if (!canHandleDrop(event)) return;
                event.preventDefault();
              }}
              onDrop={(event) => {
                if (!canHandleDrop(event)) return;
                event.preventDefault();
                event.stopPropagation();
                const leaf = parseDroppedLeaf(event);
                if (!leaf) return;
                if (!canUseLeaf(leaf)) return;
                appendLeafAsNewField(leaf);
              }}
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={() => removeAt(items, index, onChange)}
              className="text-red-400 hover:text-red-600 px-2 py-1 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {/* <button
        type="button"
        onClick={() => onChange([...items, { _key: uid(), key: "", value: "", sourcePath: undefined }])}
        className="text-xs px-2 py-1 bg-[var(--color-brand-blue-super-light)] text-[var(--color-brand-blue-super-dark)] rounded hover:bg-[var(--color-brand-blue-light)] hover:cursor-pointer"
      >
        + Add Custom Field
      </button> */}
      <AddEntryButton label="+ Add Custom Field" onClick={() => onChange([...items, { _key: uid(), key: "", value: "", sourcePath: undefined }])} />
      </div>
    </details>
  );
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
          placeholder={`${label} value`}
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
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([...events, emptyEvent()])} />
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
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]"
            />
          </div>
          <button
            type="button"
            onClick={() => removeAt(events, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2 hover:cursor-pointer"
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
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([
              ...items,
              {
                _key: uid(),
                environmentalFootprintType: "",
                environmentalFootprintMeasuringMethod: "",
                measurement: emptyMeasurement(),
              },
            ])} />
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
              className="text-red-400 hover:text-red-600 px-2 py-1 hover:cursor-pointer"
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
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([
              ...items,
              { _key: uid(), resource: "", measurement: emptyMeasurement() },
            ])} />
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
              className="text-red-400 hover:text-red-600 px-2 py-1 hover:cursor-pointer"
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
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([
              ...items,
              {
                _key: uid(),
                impactCategory: "",
                method: "",
                characterizationFactor: "",
                characterizationModel: "",
                impactIndicator: emptyMeasurement(),
              },
            ])} />
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
              className="text-red-400 hover:text-red-600 px-2 py-1 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Component array helpers ─────────────────────────────────────────────────

interface ComponentEntry {
  _key: string;
  componentName: string;
  mode: "percentage" | "mass";
  componentPercentage: string;
  componentCountValue: string;
  componentCountUnit: string;
  componentCountCustomUnit: string;
  componentReference: string;
  componentURI: string;
  componentSupplierRef: string;
}

function ComponentArrayEditor({
  label,
  items,
  onChange,
  organizations = [],
  showPercentage = true,
}: Readonly<{
  label: string;
  items: ComponentEntry[];
  onChange: (items: ComponentEntry[]) => void;
  organizations?: ManufacturerOption[];
  showPercentage?: boolean;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([
          ...items,
          {
            _key: uid(),
            componentName: "",
            mode: "percentage",
            componentPercentage: "",
            componentCountValue: "",
            componentCountUnit: "",
            componentCountCustomUnit: "",
            componentReference: "",
            componentURI: "",
            componentSupplierRef: "",
          },
        ])} />  
      </div>
      {items.map((m, i) => (
        <div key={m._key} className="space-y-2 p-3 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <input
              type="text"
              placeholder="Component name"
              value={m.componentName}
              onChange={(e) => updateAt(items, i, "componentName", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Component reference"
              value={m.componentReference}
              onChange={(e) => updateAt(items, i, "componentReference", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="url"
              placeholder="Component URI"
              value={m.componentURI}
              onChange={(e) => updateAt(items, i, "componentURI", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <div>
              <select
                id={`component-supplier-${m._key}`}
                value={m.componentSupplierRef}
                onChange={(e) => updateAt(items, i, "componentSupplierRef", e.target.value, onChange)}
                className={INPUT_CLASS}
              >
                <option value="">Select a supplier...</option>
                {organizations.map((org) => {
                  const value = org.id ?? org.identifier ?? org.name ?? "";
                  return (
                    <option key={org.id ?? org.identifier ?? org.name} value={value}>
                      {org.name ?? org.identifier ?? "Unknown organization"}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {showPercentage && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
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
                  value={m.componentPercentage}
                  onChange={(e) =>
                    updateAt(items, i, "componentPercentage", e.target.value, onChange)
                  }
                  className={INPUT_CLASS}
                />
              ) : (
                <>
                  <input
                    type="number"
                    step="any"
                    placeholder="Count value"
                    value={m.componentCountValue}
                    onChange={(e) =>
                      updateAt(items, i, "componentCountValue", e.target.value, onChange)
                    }
                    className={INPUT_CLASS}
                  />
                  <select
                    value={m.componentCountUnit}
                    onChange={(e) =>
                      updateAt(items, i, "componentCountUnit", e.target.value, onChange)
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
              {m.mode === "mass" && m.componentCountUnit === "custom" && (
                <input
                  type="text"
                  placeholder="Custom unit"
                  value={m.componentCountCustomUnit}
                  onChange={(e) =>
                    updateAt(
                      items,
                      i,
                      "componentCountCustomUnit",
                      e.target.value,
                      onChange,
                    )
                  }
                  className={INPUT_CLASS}
                />
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeAt(items, i, onChange)}
              className="text-red-400 hover:text-red-600 px-2 py-2 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SubstanceEntry {
  _key: string;
  iupacName: string;
  ecNumber: string;
  casNumber: string;
  concentrationLevel: string;
  locationWithinProduct: string;
  safeUsageInstruction: string;
  disassemblyInstruction: string;
}

function SubstanceArrayEditor({
  label,
  items,
  onChange,
}: Readonly<{
  label: string;
  items: SubstanceEntry[];
  onChange: (items: SubstanceEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([
          ...items,
          {
            _key: uid(),
            iupacName: "",
            ecNumber: "",
            casNumber: "",
            concentrationLevel: "",
            locationWithinProduct: "",
            safeUsageInstruction: "",
            disassemblyInstruction: "",
          },
        ])} />  
      </div>
      {items.map((item, i) => (
        <div key={item._key} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-white border border-gray-200 rounded-lg">
          <input
            type="text"
            placeholder="IUPAC name"
            value={item.iupacName}
            onChange={(e) => updateAt(items, i, "iupacName", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="EC number"
            value={item.ecNumber}
            onChange={(e) => updateAt(items, i, "ecNumber", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="CAS number"
            value={item.casNumber}
            onChange={(e) => updateAt(items, i, "casNumber", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Concentration level"
            value={item.concentrationLevel}
            onChange={(e) => updateAt(items, i, "concentrationLevel", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Location within product"
            value={item.locationWithinProduct}
            onChange={(e) => updateAt(items, i, "locationWithinProduct", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Safe usage instruction"
            value={item.safeUsageInstruction}
            onChange={(e) => updateAt(items, i, "safeUsageInstruction", e.target.value, onChange)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Disassembly instruction"
            value={item.disassemblyInstruction}
            onChange={(e) => updateAt(items, i, "disassemblyInstruction", e.target.value, onChange)}
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]"
          />
          <div className="md:col-span-2 flex justify-end">
            <button
              type="button"
              onClick={() => removeAt(items, i, onChange)}
              className="text-red-400 hover:text-red-600 px-2 py-1 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>
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

interface RegulationEntry {
  _key: string;
  name: string;
  identifier: string;
}

function RegulationArrayEditor({
  items,
  onChange,
}: Readonly<{
  items: RegulationEntry[];
  onChange: (items: RegulationEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">Regulations</span>
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([...items, { _key: uid(), name: "", identifier: "" }])} />
      </div>
      {items.map((entry, i) => (
        <div key={entry._key} className="flex gap-2 items-start">
          <input
            type="text"
            placeholder="Regulation name"
            value={entry.name}
            onChange={(e) => updateAt(items, i, "name", e.target.value, onChange)}
            className={`flex-1 ${INPUT_CLASS}`}
          />
          <input
            type="text"
            placeholder="Regulation identifier"
            value={entry.identifier}
            onChange={(e) => updateAt(items, i, "identifier", e.target.value, onChange)}
            className={`flex-1 ${INPUT_CLASS}`}
          />
          <button
            type="button"
            onClick={() => removeAt(items, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2 hover:cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
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
        <AddEntryButton label={addLabel} onClick={() => onChange([...items, { _key: uid(), name: "", description: "" }])} />
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
            className="text-red-400 hover:text-red-600 px-2 py-2 hover:cursor-pointer"
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
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([...items, { _key: uid(), labelName: "", labelValue: "", labelDescription: "", labelDocumentation: "" }])} />
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
            className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:cursor-pointer"
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
  componentComposition: ComponentEntry[];
  componentBills: string;
  recycledReusedContent: ComponentEntry[];
  // Product Information - Other
  sparePartsAvailability: string;
  hazardousSubstances: SubstanceEntry[];
  substancesOfConcern: SubstanceEntry[];
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
  regulations: RegulationEntry[];
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
  criticalRawMaterials: ComponentEntry[];
  lifeCycleAssessmentReport: string;
  environmentalImpacts: EnvironmentalImpactEntry[];
  renewableNonRenewableContent: ComponentEntry[];
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
  refurbishability: string;
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
  productInfoCustomFields: CustomFieldEntry[];
  complianceCustomFields: CustomFieldEntry[];
  sustainabilityCustomFields: CustomFieldEntry[];
  endOfLifeCustomFields: CustomFieldEntry[];
  guidelinesCustomFields: CustomFieldEntry[];
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
  componentComposition: [],
  componentBills: "",
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
  regulations: [],
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
  refurbishability: "",
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
  productInfoCustomFields: [],
  complianceCustomFields: [],
  sustainabilityCustomFields: [],
  endOfLifeCustomFields: [],
  guidelinesCustomFields: [],
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
    <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          {EXTENSION_SECTION_LABELS[section]}
          <svg
            className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="space-y-4 px-4 pb-4 pt-2">
      {Object.entries(groups).map(([groupName, groupFields]) => {
        return (
          <details key={groupName} className="group/group border border-gray-200 rounded-lg bg-white">
            <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between">
                {groupName}
                <svg
                  className="w-4 h-4 text-gray-400 transition-transform group-open/group:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
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

function buildPayload(
  f: FormState,
  organizations: ManufacturerOption[] = [],
): Record<string, unknown> {
  const formatTime = (t: string) => (t ? t.replace("T", "T") + ":00Z" : "");
  const toBoolean = (value: string): boolean | "" =>
    value === "true" ? true : value === "false" ? false : "";

  const resolveUnit = (m: MeasurementValue) =>
    m.unit === "custom" ? m.customUnit : m.unit;

  const resolveSupplier = (supplierRef: string): Record<string, unknown> => {
    if (!supplierRef) return {};

    const selected = organizations.find(
      (org) =>
        org.id === supplierRef ||
        org.identifier === supplierRef ||
        org.name === supplierRef,
    );

    if (!selected) {
      return { id: supplierRef };
    }

    return {
      ...(selected.id ? { id: selected.id } : {}),
      ...(selected.name ? { name: selected.name } : {}),
      ...(selected.url ? { url: selected.url } : {}),
      ...(selected.identifier ? { identifier: selected.identifier } : {}),
    };
  };

  const toComponent = (m: ComponentEntry): Record<string, unknown> => ({
    componentName: m.componentName,
    componentReference: m.componentReference,
    componentURI: m.componentURI,
    componentSupplier: resolveSupplier(m.componentSupplierRef),
    ...(m.mode === "percentage" && m.componentPercentage
      ? { componentPercentage: Number(m.componentPercentage) }
      : {}),
    ...(m.mode === "mass" && m.componentCountValue
      ? {
          componentCountValue: Number(m.componentCountValue),
          componentCountUnit:
            m.componentCountUnit === "custom"
              ? m.componentCountCustomUnit
              : m.componentCountUnit,
        }
      : {}),
  });

  const toSubstance = (s: SubstanceEntry): Record<string, unknown> => ({
    iupacName: s.iupacName,
    ecNumber: s.ecNumber,
    casNumber: s.casNumber,
    concentrationLevel: s.concentrationLevel,
    locationWithinProduct: s.locationWithinProduct,
    safeUsageInstruction: s.safeUsageInstruction,
    disassemblyInstruction: s.disassemblyInstruction,
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

  const toCustomFieldObject = (fields: CustomFieldEntry[]): Record<string, unknown> =>
    fields.reduce<Record<string, unknown>>((acc, field) => {
      if (!field.key.trim()) {
        return acc;
      }
      acc[field.key.trim()] = field.value;
      return acc;
    }, {});

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
      component: {
        componentComposition: f.componentComposition.map(toComponent),
        componentBills: f.componentBills,
        recycledReusedContent: f.recycledReusedContent.map(toComponent),
      },
      sparePartsAvailability: f.sparePartsAvailability,
      hazardousSubstances: f.hazardousSubstances.map(toSubstance),
      substancesOfConcern: f.substancesOfConcern.map(toSubstance),
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
      additionalProperties: toCustomFieldObject(f.productInfoCustomFields),
    },
    compliance: {
      regulation: f.regulations.map((regulation) => ({
        name: regulation.name,
        identifier: regulation.identifier,
      })),
      productLabel: f.productLabels,
      productStatusAssessment: f.productStatusAssessment,
      certification: f.certifications,
      dataManagementMethod: { name: f.dmmName, identifier: f.dmmIdentifier },
      additionalProperties: toCustomFieldObject(f.complianceCustomFields),
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
      criticalRawMaterial: f.criticalRawMaterials.map(toComponent),
      lifeCycleAssessment: {
        lifeCycleAssessmentReport: f.lifeCycleAssessmentReport,
        environmentalImpact: f.environmentalImpacts.map(toEnvironmentalImpact),
      },
      renewableNonRenewableContent: f.renewableNonRenewableContent.map(toComponent),
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
      additionalProperties: toCustomFieldObject(f.sustainabilityCustomFields),
    },
    endOfLife: {
      recyclingReusePotential: f.recyclingReusePotential,
      disposalOptions: f.disposalOptions,
      unsoldProductsInformation: f.unsoldProductsInformation,
      expectedWaste: f.expectedWaste,
      reusability: f.reusability,
      repairability: f.repairability,
      refurbishability: f.refurbishability,
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
      additionalProperties: toCustomFieldObject(f.endOfLifeCustomFields),
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
      additionalProperties: toCustomFieldObject(f.guidelinesCustomFields),
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [manufacturers, setManufacturers] = useState<ManufacturerOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importedJson, setImportedJson] = useState<unknown>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const sectionSteps = [
    "Product Information",
    "Compliance",
    "Sustainability",
    "End of Life",
    "Guidelines & Manuals",
    // "Usage & Maintenance",
  ] as const;
  const [currentSectionStep, setCurrentSectionStep] = useState(0);

  const fieldsByStep: Array<Array<keyof FormState>> = [
    [
      "sector",
      "sectorType",
      "gtin",
      "taricCode",
      "productName",
      "description",
      "documentation",
      "countryOfOrigin",
      "productionDate",
      "manufacturerMode",
      "manufacturerName",
      "manufacturerUrl",
      "manufacturerId",
      "componentComposition",
      "componentBills",
      "recycledReusedContent",
      "sparePartsAvailability",
      "hazardousSubstances",
      "substancesOfConcern",
      "sectorRequiredAssemblyDesc",
      "sectorRequiredAssemblyAutomationLevel",
      "sectorRequiredAssemblyLocationName",
      "sectorRequiredAssemblyLocationAddress",
      "sectorRequiredProductionDesc",
      "sectorRequiredManufacturingTechnology",
      "sectorRequiredProcessCertification",
      "sectorNonRequiredInformationText",
      "sectorNonRequiredExpectedEndCondition",
      "sectorNonRequiredRenewableEnergyProductionValue",
      "sectorNonRequiredRenewableEnergyType",
      "sectorNonRequiredRenewableEnergyOutput",
      "sectorNonRequiredSeparabilityScore",
      "sectorNonRequiredSeparabilityMethod",
      "sectorNonRequiredModularityScore",
      "sectorNonRequiredReplaceableComponent",
      "sectorNonRequiredProductDesign",
      "sectorNonRequiredDesignForDisassembly",
      "sectorNonRequiredAppliedStandardName",
      "sectorNonRequiredAppliedStandardIdentifier",
      "sectorNonRequiredStandardReference",
      "relatedObjectsRaw",
      "specHeight",
      "specWidth",
      "specDepth",
      "specWeight",
      "specIngressProtection",
      "specNetworkConnectivity",
      "specBatteryCapacity",
      "specChargingInterface",
      "specCrossCompatibilityDetails",
      "specCompatibleInterfaceStandard",
      "specCompatibilityLevel",
      "specComponentDescription",
      "specComponentCount",
      "specInstalledSoftwareName",
      "specInstalledSoftwareVersion",
      "specSoftwareSupportEndDate",
      "testReport",
      "imageUrl",
      "lifetimeExpectancy",
      "warrantyPeriod",
      "takebackOption",
      "qualityAssessment",
      "identifiedRisk",
      "productInfoCustomFields",
    ],
    [
      "regulations",
      "productLabels",
      "productStatusAssessment",
      "certifications",
      "dmmName",
      "dmmIdentifier",
      "complianceCustomFields",
    ],
    [
      "environmentalFootprints",
      "resourceConsumptions",
      "plasticsRelease",
      "decomposability",
      "sectorSustainabilityIndicatorsText",
      "criticalRawMaterials",
      "lifeCycleAssessmentReport",
      "environmentalImpacts",
      "renewableNonRenewableContent",
      "circularEconomyIndicatorText",
      "labourConditions",
      "usingResourceConsumptions",
      "recoveringResourceConsumptions",
      "environmentDeclaration",
      "sustainabilityCustomFields",
    ],
    [
      "recyclingReusePotential",
      "disposalOptions",
      "unsoldProductsInformation",
      "expectedWaste",
      "reusability",
      "repairability",
      "refurbishability",
      "upgradeOptions",
      "endOfLifeHistory",
      "numberOfLifecycles",
      "wastePrevention",
      "separateCollection",
      "collectionInformation",
      "endOfLifeReport",
      "endOfLifeCustomFields",
    ],
    [
      "assemblyGuidelineUrl",
      "disassemblyGuidelineUrl",
      "productManualUrl",
      "storageGuidelineUrl",
      "safetyInstructionUrl",
      "maintenanceInstructionUrl",
      "wasteSortingInstructionUrl",
      "accessibility",
      "utilizationCharacteristic",
      "guidelinesCustomFields",
    ],
  ];

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setCustomGroupFields = (group: CustomFieldGroupKey, items: CustomFieldEntry[]) => {
    set(group, items);
  };

  const setField: FormSetter = (key, value) => set(key, value as never);

  const customFieldSourcePaths = useMemo(() => {
    const groups: CustomFieldEntry[][] = [
      form.productInfoCustomFields,
      form.complianceCustomFields,
      form.sustainabilityCustomFields,
      form.endOfLifeCustomFields,
      form.guidelinesCustomFields,
    ];

    return groups.flatMap((group) =>
      group
        .map((entry) => entry.sourcePath)
        .filter((path): path is string => Boolean(path)),
    );
  }, [
    form.productInfoCustomFields,
    form.complianceCustomFields,
    form.sustainabilityCustomFields,
    form.endOfLifeCustomFields,
    form.guidelinesCustomFields,
  ]);

  const leafUsageByPath = useMemo(() => {
    const usage: Record<string, LeafUsageStatus> = {};

    for (const mapping of mappings) {
      usage[mapping.sourcePath] = "mapped";
    }

    for (const sourcePath of customFieldSourcePaths) {
      if (!usage[sourcePath]) {
        usage[sourcePath] = "custom";
      }
    }

    return usage;
  }, [mappings, customFieldSourcePaths]);

  const canUseLeaf = (leaf: ImportedLeaf) => !leafUsageByPath[leaf.path];

  const stepShared = {
    form,
    set,
    setField,
    manufacturers,
    canUseLeaf,
    setCustomGroupFields,
    renderExtensionSection,
    INPUT_CLASS,
    ComponentArrayEditor,
    SubstanceArrayEditor,
    RegulationArrayEditor,
    LabelArrayEditor,
    NameDescArrayEditor,
    EnvironmentalFootprintArrayEditor,
    ResourceConsumptionArrayEditor,
    EnvironmentalImpactArrayEditor,
    EventArrayEditor,
    CustomFieldsEditor,
  };

  const importedLeafCount = useMemo(
    () => (importedJson == null ? 0 : collectJsonLeaves(importedJson).length),
    [importedJson],
  );

  const addOrReplaceMapping = (next: FieldMapping) => {
    setMappings((prev) => {
      const withoutTarget = prev.filter((mapping) => mapping.targetField !== next.targetField || mapping.sourcePath !== next.sourcePath);
      return [...withoutTarget, next];
    });
  };

  const clearMappedValueFromForm = (mapping: FieldMapping) => {
    const formElement = formRef.current;
    if (!formElement) return;

    const controls = Array.from(
      formElement.querySelectorAll("input, textarea, select"),
    ).filter(
      (
        control,
      ): control is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
        control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement,
    );

    const candidates = controls.filter(
      (control) => inferFieldNameFromElement(control) === mapping.targetField,
    );

    if (candidates.length === 0) return;

    const exactValueMatch = candidates.find((control) => control.value === mapping.value);
    const targetControl = exactValueMatch ?? candidates[0];
    setControlledElementValue(targetControl, "");
  };

  const removeMapping = (sourcePath: string) => {
    const mappingToRemove = mappings.find((mapping) => mapping.sourcePath === sourcePath);
    if (mappingToRemove) {
      clearMappedValueFromForm(mappingToRemove);
    }
    setMappings((prev) => prev.filter((mapping) => mapping.sourcePath !== sourcePath));
  };

  const handleJsonFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      setImportedJson(parsed);
      setImportError(null);
      setMappings([]);
    } catch {
      setImportError("Invalid JSON file. Please upload a valid JSON document.");
      setImportedJson(null);
      setMappings([]);
    }
  };

  const handleLeafDragStart = (leaf: ImportedLeaf, event: React.DragEvent<HTMLElement>) => {
    const payload = JSON.stringify(leaf);
    event.dataTransfer.setData(DRAG_MIME, payload);
    event.dataTransfer.setData("text/plain", leaf.value);
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleLeafClick = (leaf: ImportedLeaf) => {
    if (!canUseLeaf(leaf)) {
      setImportError("This value is already used and cannot be mapped again.");
      return;
    }

    const activeElement = document.activeElement;
    const targetField = inferFieldNameFromElement(activeElement);
    const writtenValue = setControlledElementValue(activeElement, leaf.value);

    if (writtenValue === null) {
      setImportError("Select a text input, textarea, or compatible dropdown on the right before mapping.");
      return;
    }

    setImportError(null);
    addOrReplaceMapping({
      targetField,
      sourcePath: leaf.path,
      value: writtenValue,
    });
  };

  const handleFormDrop = (event: React.DragEvent<HTMLFormElement>) => {
    const raw = event.dataTransfer.getData(DRAG_MIME);
    if (!raw) return;

    event.preventDefault();
    let parsed: ImportedLeaf;
    try {
      parsed = JSON.parse(raw) as ImportedLeaf;
    } catch {
      setImportError("Unable to parse dropped JSON value.");
      return;
    }

    if (!canUseLeaf(parsed)) {
      setImportError("This value is already used and cannot be mapped again.");
      return;
    }

    const targetField = inferFieldNameFromElement(event.target);
    const writtenValue = setControlledElementValue(event.target, parsed.value);

    if (writtenValue === null) {
      setImportError("Drop onto a text input, textarea, or compatible dropdown field.");
      return;
    }

    setImportError(null);
    addOrReplaceMapping({
      targetField,
      sourcePath: parsed.path,
      value: writtenValue,
    });
  };

  const handleFormDragOver = (event: React.DragEvent<HTMLFormElement>) => {
    if (event.dataTransfer.types.includes(DRAG_MIME)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const clearCurrentStep = () => {
    const fields = fieldsByStep[currentSectionStep] ?? [];
    setForm((prev) => {
      const next = { ...prev } as FormState;
      for (const field of fields) {
        (next as unknown as Record<string, unknown>)[field] = initialState[field] as unknown;
      }
      return next;
    });

    const fieldNames = new Set(fields.map((field) => field.toString()));
    setMappings((prev) => prev.filter((mapping) => !fieldNames.has(mapping.targetField)));
  };

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
      const payload = buildPayload(form, manufacturers);
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
    <main className="w-full px-4 py-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <aside className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 h-fit lg:sticky lg:top-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Manufacturer JSON Import</h2>
          <div className="space-y-3">
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleJsonFileUpload}
              className="block w-full text-xs text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:border file:border-gray-200 file:rounded-md file:bg-gray-50 file:text-gray-700"
            />
            <p className="text-xs text-gray-500">
              Drag values from the tree onto form fields.
            </p>
            <div className="text-xs text-gray-600">
              <div>Imported leaves: <span className="font-medium">{importedLeafCount}</span></div>
              <div>Mapped fields: <span className="font-medium">{mappings.length}</span></div>
            </div>
            {importError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                {importError}
              </div>
            )}
          </div>

          <div className="mt-4 max-h-[340px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
            {importedJson == null ? (
              <p className="text-xs text-gray-500">No JSON loaded.</p>
            ) : (
              <JsonTree
                value={importedJson}
                path="root"
                onLeafDrag={handleLeafDragStart}
                onLeafClick={handleLeafClick}
                leafUsageByPath={leafUsageByPath}
              />
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <span className="inline-flex items-center gap-1 rounded border border-[var(--color-brand-pink)] bg-[var(--color-brand-pink-super-light)] px-2 py-0.5">
              Mapped field
            </span>
            <span className="inline-flex items-center gap-1 rounded border border-[var(--color-brand-blue)] bg-[var(--color-brand-blue-super-light)] px-2 py-0.5">
              Custom field
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Current Mappings</h3>
            <div className="max-h-[220px] overflow-auto space-y-2">
              {mappings.length === 0 && (
                <p className="text-xs text-gray-500">No mappings yet.</p>
              )}
              {mappings.map((mapping) => (
                <div key={`${mapping.targetField}:${mapping.sourcePath}`} className="rounded-md border border-[var(--color-brand-pink)] bg-[var(--color-brand-pink)]/6 px-2 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-[var(--color-brand-pink)] truncate">{mapping.targetField}</div>
                      <div className="text-[11px] text-[var(--color-brand-pink)]/80 truncate">{mapping.sourcePath}</div>
                      <div className="text-[11px] text-[var(--color-brand-pink)]/60 truncate">{mapping.value}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMapping(mapping.sourcePath)}
                      className="text-red-500 hover:text-red-700 text-[11px] hover:cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section>
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1 hover:cursor-pointer"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the product information organized by thematic data groups and
          data layers.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onDrop={handleFormDrop}
        onDragOver={handleFormDragOver}
        className="space-y-6"
      >
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap gap-2">
            {sectionSteps.map((step, index) => {
              const isActive = index === currentSectionStep;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentSectionStep(index)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors hover:cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-brand-pink)] border-[var(--color-brand-pink)] text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:cursor-pointer"
                  }`}
                >
                  {index + 1}. {step}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Step {currentSectionStep + 1} of {sectionSteps.length}</span>
            <div className="flex items-center gap-3">
              {/* <span>{sectionSteps[currentSectionStep]}</span> */}
              <button
                type="button"
                onClick={clearCurrentStep}
                className="px-2 py-1 border border-gray-300 rounded text-[11px] text-gray-600 disabled:opacity-50 hover:cursor-pointer"
              >
                Clear Current Step
              </button>
            </div>
          </div>
        </div>

        {/* ── PRODUCT INFORMATION ──────────────────────────────────────── */}
        {currentSectionStep === 0 && (
        <ProductInformationStep shared={stepShared} />
        )}

{/* ── COMPLIANCE ───────────────────────────────────────────────── */}
        {currentSectionStep === 1 && (
        <ComplianceStep shared={stepShared} />
        )}

{/* ── SUSTAINABILITY ───────────────────────────────────────────── */}
        {currentSectionStep === 2 && (
        <SustainabilityStep shared={stepShared} />
        )}

{/* ── END OF LIFE ──────────────────────────────────────────────── */}
        {currentSectionStep === 3 && (
        <EndOfLifeStep shared={stepShared} />
        )}

{/* ── GUIDELINES & MANUALS ─────────────────────────────────────── */}
        {currentSectionStep === 4 && (
        <GuidelinesStep shared={stepShared} />
        )}

{/* ── USAGE & MAINTENANCE ──────────────────────────────────────── */}
        {currentSectionStep === 5 && (
        <CollapsibleSection title="Usage & Maintenance" color="indigo" defaultOpen>
          <DataLayerGroup layer="Downstream Data">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Maintenance Log
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="space-y-4 px-4 pb-4 pt-2">
              <EventArrayEditor
                label="Maintenance Events"
                events={form.maintenanceLog}
                onChange={(v) => set("maintenanceLog", v)}
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Usage History
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="space-y-4 px-4 pb-4 pt-2">
              <EventArrayEditor
                label="Usage Events"
                events={form.usageHistory}
                onChange={(v) => set("usageHistory", v)}
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Incidents & Errors
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="space-y-4 px-4 pb-4 pt-2">
              <EventArrayEditor
                label="Incident Events"
                events={form.incidentsAndErrors}
                onChange={(v) => set("incidentsAndErrors", v)}
              />
              </div>
            </details>
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
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:cursor-pointer"
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
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:cursor-pointer"
            >
              Next Section
            </button>
          </div>

          <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[var(--color-brand-pink)] text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors hover:cursor-pointer"
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
        </section>
      </div>
    </main>
  );
}
