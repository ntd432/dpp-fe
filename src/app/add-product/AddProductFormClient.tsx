'use client'

import { useMemo, useRef, useState } from "react";
import { ManufacturerOption } from "../add-dpp/AddDppFormClient";
import { useRouter } from "next/navigation";
import { Utils } from "@/lib/Utils";
import * as XLSX from "xlsx";
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
import { ProductInformationStep } from "@/app/add-product/steps/ProductInformationStep";
import { ComplianceStep } from "@/app/add-product/steps/ComplianceStep";
import { SustainabilityStep } from "@/app/add-product/steps/SustainabilityStep";
import { EndOfLifeStep } from "@/app/add-product/steps/EndOfLifeStep";
import { GuidelinesStep } from "@/app/add-product/steps/GuidelinesStep";
import { AddEntryButton } from "@/components/form/AddEntryButton";
import { CONSUMPTION_UNITS, FOOTPRINT_UNITS, IMPACT_UNITS, MASS_UNITS } from "@/config/master-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { MeasurementInput } from "./CommonInputComponents";
import { BaseFormState, ComponentEntry, CustomFieldEntry, EnvironmentalFootprintEntry, EnvironmentalImpactEntry, EventEntry, ExtensionPayload, ExtensionPayloadBuildDependencies, FormState, LabelEntry, MeasurementValue, NameDescEntry, RegulationEntry, ResourceConsumptionEntry, SubstanceEntry } from "./InputInterfaces";
import { buildElectronicExtensionPayload, createElectronicExtensionFormState } from "./extensions/ElectronicExtension";

const INPUT_CLASS =
  "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]";

const INPUT_LARGE_CLASS = "md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]"

type LeafUsageStatus = "mapped" | "custom";
type FormSetter = (key: keyof FormState, value: FormState[keyof FormState]) => void;
type Translator = (key: string) => string;
type CustomFieldGroupKey =
  | "productInfoCustomFields"
  | "complianceCustomFields"
  | "sustainabilityCustomFields"
  | "endOfLifeCustomFields"
  | "guidelinesCustomFields";

interface ImportedLeaf {
  path: string;
  value: string;
}

interface FieldMapping {
  targetField: string;
  targetKey: keyof FormState;
  targetSubField?: string;
  sourcePath: string;
  value: string;
}

const emptyEvent = (): EventEntry => ({
  _key: uid(),
  actionName: "",
  actionType: "",
  time: "",
  locationName: "",
  actorName: "",
});

const emptyMeasurement = (): MeasurementValue => ({ value: "", unit: "", customUnit: "" });

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

function arrayFieldKey(fieldPrefix: string | undefined, fieldName: string): string {
  return fieldPrefix ? `${fieldPrefix}.${fieldName}` : fieldName;
}

function EventArrayEditor({
  label,
  events,
  onChange,
  fieldPrefix,
  t,
}: Readonly<{
  label: string;
  events: EventEntry[];
  onChange: (events: EventEntry[]) => void;
  fieldPrefix?: string;
  t: Translator;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([...events, emptyEvent()])} />
      </div>
      {events.map((ev, i) => (
        <div key={ev._key} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={t("Action name")}
              value={ev.actionName}
              onChange={(e) => updateAt(events, i, "actionName", e.target.value, onChange)}
              name={fieldPrefix ? `${fieldPrefix}.actionName` : "actionName"}
              data-field-key={fieldPrefix ? `${fieldPrefix}.actionName` : "actionName"}
              className={INPUT_CLASS}
            />
            <input
              type="datetime-local"
              value={ev.time}
              onChange={(e) => updateAt(events, i, "time", e.target.value, onChange)}
              name={fieldPrefix ? `${fieldPrefix}.time` : "time"}
              data-field-key={fieldPrefix ? `${fieldPrefix}.time` : "time"}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Action type")}
              value={ev.actionType}
              onChange={(e) => updateAt(events, i, "actionType", e.target.value, onChange)}
              name={fieldPrefix ? `${fieldPrefix}.actionType` : "actionType"}
              data-field-key={fieldPrefix ? `${fieldPrefix}.actionType` : "actionType"}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Location name")}
              value={ev.locationName}
              onChange={(e) => updateAt(events, i, "locationName", e.target.value, onChange)}
              name={fieldPrefix ? `${fieldPrefix}.locationName` : "locationName"}
              data-field-key={fieldPrefix ? `${fieldPrefix}.locationName` : "locationName"}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Actor name")}
              value={ev.actorName}
              onChange={(e) => updateAt(events, i, "actorName", e.target.value, onChange)}
              name={fieldPrefix ? `${fieldPrefix}.actorName` : "actorName"}
              data-field-key={fieldPrefix ? `${fieldPrefix}.actorName` : "actorName"}
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

function ComponentArrayEditor({
  label,
  items,
  onChange,
  organizations = [],
  showPercentage = true,
  fieldPrefix,
  t,
}: Readonly<{
  label: string;
  items: ComponentEntry[];
  onChange: (items: ComponentEntry[]) => void;
  organizations?: ManufacturerOption[];
  showPercentage?: boolean;
  fieldPrefix?: string;
  t: Translator;
}>) {
  const componentNameKey = arrayFieldKey(fieldPrefix, "componentName");
  const componentReferenceKey = arrayFieldKey(fieldPrefix, "componentReference");
  const componentUriKey = arrayFieldKey(fieldPrefix, "componentURI");
  const componentSupplierKey = arrayFieldKey(fieldPrefix, "componentSupplierRef");
  const modeKey = arrayFieldKey(fieldPrefix, "mode");
  const componentPercentageKey = arrayFieldKey(fieldPrefix, "componentPercentage");
  const componentCountValueKey = arrayFieldKey(fieldPrefix, "componentCountValue");
  const componentCountUnitKey = arrayFieldKey(fieldPrefix, "componentCountUnit");
  const componentCountCustomUnitKey = arrayFieldKey(fieldPrefix, "componentCountCustomUnit");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([
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
              placeholder={t("Component name")}
              value={m.componentName}
              onChange={(e) => updateAt(items, i, "componentName", e.target.value, onChange)}
              name={componentNameKey}
              data-field-key={componentNameKey}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Component reference")}
              value={m.componentReference}
              onChange={(e) => updateAt(items, i, "componentReference", e.target.value, onChange)}
              name={componentReferenceKey}
              data-field-key={componentReferenceKey}
              className={INPUT_CLASS}
            />
            <input
              type="url"
              placeholder={t("Component URI")}
              value={m.componentURI}
              onChange={(e) => updateAt(items, i, "componentURI", e.target.value, onChange)}
              name={componentUriKey}
              data-field-key={componentUriKey}
              className={INPUT_CLASS}
            />
            <div>
              <select
                id={`component-supplier-${m._key}`}
                name={componentSupplierKey}
                data-field-key={componentSupplierKey}
                value={m.componentSupplierRef}
                onChange={(e) => updateAt(items, i, "componentSupplierRef", e.target.value, onChange)}
                className={INPUT_CLASS}
              >
                <option value="">{t("Select a supplier...")}</option>
                {organizations.map((org) => {
                  const value = org.id ?? org.identifier ?? org.name ?? "";
                  return (
                    <option key={org.id ?? org.identifier ?? org.name} value={value}>
                      {org.name ?? org.identifier ?? t("Unknown organization")}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {showPercentage && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <select
                name={modeKey}
                data-field-key={modeKey}
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
                <option value="percentage">{t("Percentage")}</option>
                <option value="mass">{t("Mass")}</option>
              </select>
              {m.mode === "percentage" ? (
                <input
                  type="number"
                  placeholder={t("%")}
                  value={m.componentPercentage}
                  onChange={(e) =>
                    updateAt(items, i, "componentPercentage", e.target.value, onChange)
                  }
                    name={componentPercentageKey}
                    data-field-key={componentPercentageKey}
                  className={INPUT_CLASS}
                />
              ) : (
                <>
                  <input
                    type="number"
                    step="any"
                    placeholder={t("Count value")}
                    value={m.componentCountValue}
                    onChange={(e) =>
                      updateAt(items, i, "componentCountValue", e.target.value, onChange)
                    }
                    name={componentCountValueKey}
                    data-field-key={componentCountValueKey}
                    className={INPUT_CLASS}
                  />
                  <select
                    name={componentCountUnitKey}
                    data-field-key={componentCountUnitKey}
                    value={m.componentCountUnit}
                    onChange={(e) =>
                      updateAt(items, i, "componentCountUnit", e.target.value, onChange)
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="">{t("Unit")}</option>
                    {MASS_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                    <option value="custom">{t("Custom")}</option>
                  </select>
                </>
              )}
              {m.mode === "mass" && m.componentCountUnit === "custom" && (
                <input
                  type="text"
                  placeholder={t("Custom unit")}
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
                  name={componentCountCustomUnitKey}
                  data-field-key={componentCountCustomUnitKey}
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

function SubstanceArrayEditor({
  label,
  items,
  onChange,
  fieldPrefix,
  t,
}: Readonly<{
  label: string;
  items: SubstanceEntry[];
  onChange: (items: SubstanceEntry[]) => void;
  fieldPrefix?: string;
  t: Translator;
}>) {
  const substanceNameKey = arrayFieldKey(fieldPrefix, "substanceName");
  const iupacNameKey = arrayFieldKey(fieldPrefix, "iupacName");
  const ecNumberKey = arrayFieldKey(fieldPrefix, "ecNumber");
  const casNumberKey = arrayFieldKey(fieldPrefix, "casNumber");
  const concentrationLevelKey = arrayFieldKey(fieldPrefix, "concentrationLevel");
  const locationWithinProductKey = arrayFieldKey(fieldPrefix, "locationWithinProduct");
  const substanceDescriptionKey = arrayFieldKey(fieldPrefix, "substanceDescription");
  const safeUsageInstructionKey = arrayFieldKey(fieldPrefix, "safeUsageInstruction");
  const disassemblyInstructionKey = arrayFieldKey(fieldPrefix, "disassemblyInstruction");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([
          ...items,
          {
            _key: uid(),
            substanceName: "",
            substanceDescription: "",
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
            placeholder={t("Substance name")}
            value={item.substanceName}
            onChange={(e) => updateAt(items, i, "substanceName", e.target.value, onChange)}
            name={substanceNameKey}
            data-field-key={substanceNameKey}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("IUPAC name")}
            value={item.iupacName}
            onChange={(e) => updateAt(items, i, "iupacName", e.target.value, onChange)}
            name={iupacNameKey}
            data-field-key={iupacNameKey}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("EC number")}
            value={item.ecNumber}
            onChange={(e) => updateAt(items, i, "ecNumber", e.target.value, onChange)}
            name={ecNumberKey}
            data-field-key={ecNumberKey}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("CAS number")}
            value={item.casNumber}
            onChange={(e) => updateAt(items, i, "casNumber", e.target.value, onChange)}
            name={casNumberKey}
            data-field-key={casNumberKey}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("Concentration level")}
            value={item.concentrationLevel}
            onChange={(e) => updateAt(items, i, "concentrationLevel", e.target.value, onChange)}
            name={concentrationLevelKey}
            data-field-key={concentrationLevelKey}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("Location within product")}
            value={item.locationWithinProduct}
            onChange={(e) => updateAt(items, i, "locationWithinProduct", e.target.value, onChange)}
            name={locationWithinProductKey}
            data-field-key={locationWithinProductKey}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("Substance description")}
            value={item.substanceDescription}
            onChange={(e) => updateAt(items, i, "substanceDescription", e.target.value, onChange)}
            name={substanceDescriptionKey}
            data-field-key={substanceDescriptionKey}
            className={INPUT_LARGE_CLASS}
          />    
          <input
            type="text"
            placeholder={t("Safe usage instruction")}
            value={item.safeUsageInstruction}
            onChange={(e) => updateAt(items, i, "safeUsageInstruction", e.target.value, onChange)}
            name={safeUsageInstructionKey}
            data-field-key={safeUsageInstructionKey}
            className={INPUT_LARGE_CLASS}
          />
          <input
            type="text"
            placeholder={t("Disassembly instruction")}
            value={item.disassemblyInstruction}
            onChange={(e) => updateAt(items, i, "disassemblyInstruction", e.target.value, onChange)}
            name={disassemblyInstructionKey}
            data-field-key={disassemblyInstructionKey}
            className={INPUT_LARGE_CLASS}
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

function RegulationArrayEditor({
  items,
  onChange,
  fieldPrefix = "regulations",
  t,
}: Readonly<{
  items: RegulationEntry[];
  onChange: (items: RegulationEntry[]) => void;
  fieldPrefix?: string;
  t: Translator;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{t("Regulations")}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([...items, { _key: uid(), name: "", identifier: "" }])} />
      </div>
      {items.map((entry, i) => (
        <div key={entry._key} className="flex gap-2 items-start">
          <input
            type="text"
            placeholder={t("Regulation name")}
            value={entry.name}
            onChange={(e) => updateAt(items, i, "name", e.target.value, onChange)}
            name={`${fieldPrefix}.name`}
            data-field-key={`${fieldPrefix}.name`}
            className={`flex-1 ${INPUT_CLASS}`}
          />
          <input
            type="text"
            placeholder={t("Regulation identifier")}
            value={entry.identifier}
            onChange={(e) => updateAt(items, i, "identifier", e.target.value, onChange)}
            name={`${fieldPrefix}.identifier`}
            data-field-key={`${fieldPrefix}.identifier`}
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
  fieldPrefix,
  namePlaceholder = "Name",
  descPlaceholder = "Description",
  addLabel = "+ Add Entry",
  t,
}: Readonly<{
  label: string;
  items: NameDescEntry[];
  onChange: (items: NameDescEntry[]) => void;
  fieldPrefix?: string;
  namePlaceholder?: string;
  descPlaceholder?: string;
  addLabel?: string;
  t: Translator;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label={t(addLabel)} onClick={() => onChange([...items, { _key: uid(), name: "", description: "" }])} />
      </div>
      {items.map((s, i) => (
        <div key={s._key} className="flex gap-2 items-start">
          <input
            type="text"
            placeholder={namePlaceholder}
            value={s.name}
            onChange={(e) => updateAt(items, i, "name", e.target.value, onChange)}
            name={fieldPrefix ? `${fieldPrefix}.name` : "name"}
            data-field-key={fieldPrefix ? `${fieldPrefix}.name` : "name"}
            className={`flex-1 ${INPUT_CLASS}`}
          />
          <input
            type="text"
            placeholder={descPlaceholder}
            value={s.description}
            onChange={(e) => updateAt(items, i, "description", e.target.value, onChange)}
            name={fieldPrefix ? `${fieldPrefix}.description` : "description"}
            data-field-key={fieldPrefix ? `${fieldPrefix}.description` : "description"}
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

function LabelArrayEditor({
  items,
  onChange,
  fieldPrefix = "productLabels",
  t,
}: Readonly<{
  items: LabelEntry[];
  onChange: (items: LabelEntry[]) => void;
  fieldPrefix?: string;
  t: Translator;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">
          {t("Product Labels")}
        </span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([...items, { _key: uid(), labelName: "", labelValue: "", labelDescription: "", labelDocumentation: "" }])} />
      </div>
      {items.map((l, i) => (
        <div key={l._key} className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg relative">
          <input
            type="text"
            placeholder={t("Label name")}
            value={l.labelName}
            onChange={(e) => updateAt(items, i, "labelName", e.target.value, onChange)}
            name={`${fieldPrefix}.labelName`}
            data-field-key={`${fieldPrefix}.labelName`}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("Label value")}
            value={l.labelValue}
            onChange={(e) => updateAt(items, i, "labelValue", e.target.value, onChange)}
            name={`${fieldPrefix}.labelValue`}
            data-field-key={`${fieldPrefix}.labelValue`}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder={t("Description")}
            value={l.labelDescription}
            onChange={(e) => updateAt(items, i, "labelDescription", e.target.value, onChange)}
            name={`${fieldPrefix}.labelDescription`}
            data-field-key={`${fieldPrefix}.labelDescription`}
            className={INPUT_CLASS}
          />
          <input
            type="url"
            placeholder={t("Documentation URL")}
            value={l.labelDocumentation}
            onChange={(e) => updateAt(items, i, "labelDocumentation", e.target.value, onChange)}
            name={`${fieldPrefix}.labelDocumentation`}
            data-field-key={`${fieldPrefix}.labelDocumentation`}
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

function EnvironmentalFootprintArrayEditor({
  items,
  onChange,
  fieldPrefix = "environmentalFootprints",
  t,
}: Readonly<{
  items: EnvironmentalFootprintEntry[];
  onChange: (items: EnvironmentalFootprintEntry[]) => void;
  fieldPrefix?: string;
  t: Translator;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{t("Environmental Footprint")}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([
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
              placeholder={t("Type")}
              value={item.environmentalFootprintType}
              onChange={(e) =>
                updateAt(items, i, "environmentalFootprintType", e.target.value, onChange)
              }
              name={`${fieldPrefix}.environmentalFootprintType`}
              data-field-key={`${fieldPrefix}.environmentalFootprintType`}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Measuring method")}
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
              name={`${fieldPrefix}.environmentalFootprintMeasuringMethod`}
              data-field-key={`${fieldPrefix}.environmentalFootprintMeasuringMethod`}
              className={INPUT_CLASS}
            />
          </div>
          <MeasurementInput
            label={t("Measurement")}
            measurement={item.measurement}
            unitOptions={FOOTPRINT_UNITS}
            onChange={(next) => updateAt(items, i, "measurement", next, onChange)}
            fieldKey={`${fieldPrefix}.measurement`}
            t={t}
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
  fieldPrefix,
  t,
}: Readonly<{
  label: string;
  items: ResourceConsumptionEntry[];
  onChange: (items: ResourceConsumptionEntry[]) => void;
  fieldPrefix?: string;
  t: Translator;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([
              ...items,
              { _key: uid(), resource: "", measurement: emptyMeasurement() },
            ])} />
      </div>
      {items.map((item, i) => (
        <div key={item._key} className="space-y-3 p-3 bg-white border border-gray-200 rounded-lg">
          <input
            type="text"
            placeholder={t("Resource")}
            value={item.resource}
            onChange={(e) => updateAt(items, i, "resource", e.target.value, onChange)}
            name={fieldPrefix ? `${fieldPrefix}.resource` : "resource"}
            data-field-key={fieldPrefix ? `${fieldPrefix}.resource` : "resource"}
            className={INPUT_CLASS}
          />
          <MeasurementInput
            label={t("Measurement")}
            measurement={item.measurement}
            unitOptions={CONSUMPTION_UNITS}
            onChange={(next) => updateAt(items, i, "measurement", next, onChange)}
            fieldKey={fieldPrefix ? `${fieldPrefix}.measurement` : undefined}
            t={t}
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
  fieldPrefix = "environmentalImpacts",
  t,
}: Readonly<{
  items: EnvironmentalImpactEntry[];
  onChange: (items: EnvironmentalImpactEntry[]) => void;
  fieldPrefix?: string;
  t: Translator;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{t("Environmental Impact")}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([
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
              placeholder={t("Impact category")}
              value={item.impactCategory}
              onChange={(e) => updateAt(items, i, "impactCategory", e.target.value, onChange)}
              name={`${fieldPrefix}.impactCategory`}
              data-field-key={`${fieldPrefix}.impactCategory`}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Method")}
              value={item.method}
              onChange={(e) => updateAt(items, i, "method", e.target.value, onChange)}
              name={`${fieldPrefix}.method`}
              data-field-key={`${fieldPrefix}.method`}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Characterization factor")}
              value={item.characterizationFactor}
              onChange={(e) => updateAt(items, i, "characterizationFactor", e.target.value, onChange)}
              name={`${fieldPrefix}.characterizationFactor`}
              data-field-key={`${fieldPrefix}.characterizationFactor`}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Characterization model")}
              value={item.characterizationModel}
              onChange={(e) => updateAt(items, i, "characterizationModel", e.target.value, onChange)}
              name={`${fieldPrefix}.characterizationModel`}
              data-field-key={`${fieldPrefix}.characterizationModel`}
              className={INPUT_CLASS}
            />
          </div>
          <MeasurementInput
            label={t("Impact Indicator")}
            measurement={item.impactIndicator}
            unitOptions={IMPACT_UNITS}
            onChange={(next) => updateAt(items, i, "impactIndicator", next, onChange)}
            fieldKey={`${fieldPrefix}.impactIndicator`}
            t={t}
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

function CustomFieldsEditor({
  title,
  items,
  onChange,
  canUseLeaf,
  t,
}: Readonly<{
  title: string;
  items: CustomFieldEntry[];
  onChange: (items: CustomFieldEntry[]) => void;
  canUseLeaf: (leaf: ImportedLeaf) => boolean;
  t: Translator;
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
        {t("Define manual fields and drag imported JSON values here to auto-fill key and value.")}
      </p>
      <div className="space-y-2">
        {items.map((field, index) => (
          <div
            key={field._key}
            className="grid grid-cols-[1fr_1fr_auto] gap-2"
          >
            <input
              type="text"
              placeholder={t("Field name")}
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
              placeholder={t("Value")}
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
      <AddEntryButton label={t("+ Add Custom Field")} onClick={() => onChange([...items, { _key: uid(), key: "", value: "", sourcePath: undefined }])} />
      </div>
    </details>
  );
}

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

function customFieldNameFromLeafPath(path: string): string {
  const normalized = normalizeJsonPath(path);
  if (!normalized) return "customField";
  const parts = normalized.split(".").filter(Boolean);
  return parts.at(-1) || normalized;
}

function normalizeFieldIdentifier(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

let nextId = 1;
function uid(): string {
  return `item-${nextId++}`;
}

const BASE_FORM_STATE: BaseFormState = {
  sector: "",
  sectorType: "",
  extensionData: {},
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
  relatedObjectsRaw: "",
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

function createExtensionFormState(sectorType: string): Partial<FormState> {
  switch (sectorType) {
    case "ElectronicExtension":
      return createElectronicExtensionFormState();
    default:
      return {};
  }
}

function buildFormState(sector: string, sectorType: string): FormState {
  const extensionFields = createExtensionFormState(sectorType);
  return {
    ...BASE_FORM_STATE,
    sector,
    sectorType,
    extensionData: {
      [sectorType]: extensionFields as Record<string, unknown>,
    },
    ...extensionFields,
  };
}

const initialState: FormState = buildFormState("Electronics", "ElectronicExtension");

function JsonTree({
  value,
  path,
  onLeafDrag,
  onLeafClick,
  leafUsageByPath,
  t,
}: Readonly<{
  value: unknown;
  path: string;
  onLeafDrag: (leaf: ImportedLeaf, event: React.DragEvent<HTMLElement>) => void;
  onLeafClick: (leaf: ImportedLeaf) => void;
  leafUsageByPath: Record<string, LeafUsageStatus>;
  t: Translator;
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
          {open ? "▾" : "▸"} {path.split(".")[path.split(".").length - 1]} {t("[")}{value.length}{t("]")}
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
                t={t}
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
          {open ? "▾" : "▸"} {path.split(".")[path.split(".").length - 1]} {t("{")}{entries.length}{t("}")}
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
                  t={t}
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
        ? t("Already mapped to an existing form field")
        : leafUsage === "custom"
          ? t("Already added to custom fields")
          : t("Click to map to focused field, or drag to a field");

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

function renderExtensionSection(
  section: ExtensionSectionKey,
  form: FormState,
  setValue: FormSetter,
  t: Translator,
): React.ReactNode {
  const groups = EXTENSION_FIELD_CONFIG[form.sectorType]?.[section];

  if (!groups || Object.keys(groups).length === 0) {
    return null;
  }

  return (
    <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          {t(EXTENSION_SECTION_LABELS[section])}
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
                {t(groupName)}
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
                        fieldKey={String(field.key)}
                        label={t(field.label)}
                        measurement={fieldValue as MeasurementValue}
                        unitOptions={field.unitOptions ?? []}
                        onChange={(next) => setValue(fieldKey, next)}
                        t={t}
                      />
                    </div>
                  );
                }

                if (field.kind === "textarea") {
                  return (
                    <div key={String(field.key)} className={wrapperClass}>
                      <TextAreaField
                        label={t(field.label)}
                        value={fieldValue as string}
                        onChange={(next) => setValue(fieldKey, next)}
                        rows={field.rows}
                        fieldKey={String(field.key)}
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
                        {t(field.label)}
                      </label>
                      <select
                        id={String(field.key)}
                        name={String(field.key)}
                        data-field-key={String(field.key)}
                        value={fieldValue as string}
                        onChange={(e) => setValue(fieldKey, e.target.value)}
                        className={INPUT_CLASS}
                      >
                        <option value="">{t("Select option")}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {t(option.label)}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <FormField
                    key={String(field.key)}
                    label={t(field.label)}
                    value={fieldValue as string}
                    onChange={(next) => setValue(fieldKey, next)}
                    type={field.kind === "number" || field.kind === "date" ? field.kind : "text"}
                    placeholder={field.placeholder}
                    fieldKey={String(field.key)}
                    data-field-key={String(field.key)}
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

function extractNumericString(value: string): string | null {
  const normalized = value.trim().replaceAll(",", ".");
  const match = /-?\d+(?:\.\d+)?/.exec(normalized);
  return match ? match[0] : null;
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

  if (target instanceof HTMLInputElement && target.type === "number") {
    const numericValue = extractNumericString(value);
    if (numericValue === null) {
      return null;
    }

    const nativeSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), "value")?.set;
    nativeSetter?.call(target, numericValue);
    target.dispatchEvent(new Event("input", { bubbles: true }));
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

function normalizeJsonPath(path: string): string {
  return path.replaceAll(/\[\d+\]/g, "").replaceAll(/^root\.?/g, "");
}

function resolveMeasurementSubField(candidate: string): string | undefined {
  const subPath = candidate.split(".").slice(1).join(".");
  return subPath || undefined;
}

function resolveFormTargetCandidate(
  candidate: string,
  lookup: Map<string, keyof FormState>,
  aliases: Record<string, keyof FormState>,
): ResolvedFormTarget | null {
  const [baseCandidate] = candidate.split(".");
  const normalized = normalizeFieldIdentifier(candidate);
  const normalizedBase = normalizeFieldIdentifier(baseCandidate);
  const targetSubField = resolveMeasurementSubField(candidate);

  if (!normalized && !normalizedBase) {
    return null;
  }

  const alias = aliases[normalized];
  if (alias) {
    return { targetKey: alias, targetSubField };
  }

  const direct = lookup.get(normalized);
  if (direct) {
    return { targetKey: direct, targetSubField };
  }

  const aliasFromBase = aliases[normalizedBase];
  if (aliasFromBase) {
    return { targetKey: aliasFromBase, targetSubField };
  }

  const directFromBase = lookup.get(normalizedBase);
  if (directFromBase) {
    return { targetKey: directFromBase, targetSubField };
  }

  return null;
}

const DRAG_MIME = "application/x-dpp-json-leaf";
type ImportMode = "json" | "table";
type TabularRow = Record<string, string>;

interface ResolvedFormTarget {
  targetKey: keyof FormState;
  targetSubField?: string;
}

interface MappingLogContext {
  source: "drag-drop" | "click-map";
  sourcePath: string;
}

function coerceMappedValue(raw: string, sampleValue: unknown): unknown {
  if (Array.isArray(sampleValue)) {
    return coerceMappedArrayValue(raw);
  }

  if (sampleValue && typeof sampleValue === "object") {
    if (isMeasurementValue(sampleValue)) {
      return coerceMappedMeasurementValue(raw, sampleValue);
    }

    return coerceMappedObjectValue(raw, sampleValue as Record<string, unknown>);
  }

  if (typeof sampleValue === "number") {
    const num = Number(raw);
    return Number.isNaN(num) ? sampleValue : num;
  }

  if (typeof sampleValue === "boolean") {
    return raw.trim().toLowerCase() === "true";
  }

  return raw;
}

function isMeasurementValue(value: unknown): value is MeasurementValue {
  return Boolean(
    value &&
      typeof value === "object" &&
      "value" in value &&
      "unit" in value &&
      "customUnit" in value,
  );
}

function coerceMappedMeasurementValue(raw: string, sampleValue: MeasurementValue): MeasurementValue {
  const trimmed = raw.trim();
  if (!trimmed) {
    return sampleValue;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed && typeof parsed === "object") {
      const next = parsed as Partial<MeasurementValue>;
      return {
        value: next.value ?? sampleValue.value,
        unit: next.unit ?? sampleValue.unit,
        customUnit: next.customUnit ?? sampleValue.customUnit,
      };
    }
  } catch {
    // Fall through and treat the cell as the measurement value.
  }

  return {
    ...sampleValue,
    value: raw,
  };
}

function coerceMappedArrayValue(raw: string): unknown {
  if (!raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return raw
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function coerceMappedObjectValue(raw: string, sampleValue: Record<string, unknown>): unknown {
  if (!raw.trim()) return sampleValue;

  try {
    return JSON.parse(raw);
  } catch {
    return sampleValue;
  }
}

function setNestedObjectValue(
  target: Record<string, unknown>,
  path: string,
  value: string,
): Record<string, unknown> {
  const [head, ...rest] = path.split(".");
  if (!head) {
    return target;
  }

  if (rest.length === 0) {
    return { ...target, [head]: value };
  }

  const existingNested = target[head];
  const nestedObject =
    existingNested && typeof existingNested === "object" && !Array.isArray(existingNested)
      ? (existingNested as Record<string, unknown>)
      : {};

  return {
    ...target,
    [head]: setNestedObjectValue(nestedObject, rest.join("."), value),
  };
}

function applyMappedArrayValue(
  currentValue: unknown[],
  rawValue: string,
  targetSubField: string,
): unknown[] {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return currentValue;
  }

  const firstItem = currentValue[0];
  const baseItem =
    firstItem && typeof firstItem === "object" && !Array.isArray(firstItem)
      ? (firstItem as Record<string, unknown>)
      : {};

  const updatedFirstItem = setNestedObjectValue(baseItem, targetSubField, rawValue);

  return currentValue.length === 0
    ? [updatedFirstItem]
    : [updatedFirstItem, ...currentValue.slice(1)];
}

function applyMappedValueToField(
  currentValue: unknown,
  rawValue: string,
  targetSubField?: string,
): unknown {
  if (Array.isArray(currentValue) && targetSubField) {
    return applyMappedArrayValue(currentValue, rawValue, targetSubField);
  }

  if (isMeasurementValue(currentValue)) {
    const trimmed = rawValue.trim();

    if (!trimmed) {
      return currentValue;
    }

    if (targetSubField === "unit") {
      return { ...currentValue, unit: rawValue };
    }

    if (targetSubField === "customUnit") {
      return { ...currentValue, unit: "custom", customUnit: rawValue };
    }

    return { ...currentValue, value: rawValue };
  }

  return coerceMappedValue(rawValue, currentValue);
}

function stringifyWorksheetValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") {
    return JSON.stringify(value) ?? "";
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  ) {
    return String(value);
  }
  return "";
}

function parseWorksheetRows(buffer: ArrayBuffer): TabularRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return [];
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  return rawRows
    .map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          String(key),
          stringifyWorksheetValue(value),
        ]),
      ),
    )
    .filter((row) => Object.values(row).some((value) => value.trim() !== ""));
}

function buildDefaultExtensionPayload(extensionType: string): ExtensionPayload {
  return {
    sectorRequiredInformation: { extensionType },
    sectorNonRequiredInformation: { extensionType },
    productSpecification: { extensionType },
  };
}

const EXTENSION_PAYLOAD_BUILDERS: Record<
  string,
  (form: FormState, deps: ExtensionPayloadBuildDependencies) => ExtensionPayload
> = {
  ElectronicExtension: buildElectronicExtensionPayload,
};

function buildExtensionPayload(
  form: FormState,
  deps: ExtensionPayloadBuildDependencies,
): ExtensionPayload {
  const builder = EXTENSION_PAYLOAD_BUILDERS[form.sectorType];
  return builder ? builder(form, deps) : buildDefaultExtensionPayload(form.sectorType);
}

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
    name: s.substanceName,
    description: s.substanceDescription,
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

  const extensionPayload = buildExtensionPayload(f, {
    toBoolean,
    toMeasurementEntry,
    toValueUnitObject,
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
      component: {
        componentComposition: f.componentComposition.map(toComponent),
        componentBills: f.componentBills,
        recycledReusedContent: f.recycledReusedContent.map(toComponent),
      },
      sparePartsAvailability: f.sparePartsAvailability,
      hazardousSubstances: f.hazardousSubstances.map(toSubstance),
      substancesOfConcern: f.substancesOfConcern.map(toSubstance),
      sectorRequiredInformation: extensionPayload.sectorRequiredInformation,
      sectorNonRequiredInformation: extensionPayload.sectorNonRequiredInformation,
      relatedObjects: f.relatedObjectsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      productSpecification: extensionPayload.productSpecification,
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
      storageAndTransportGuideline: { url: f.storageGuidelineUrl },
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

  return Utils.pruneEmpty(product);
}

export default function AddProductFormClient({
    initialManufacturers,
}: Readonly<{ 
    initialManufacturers: ManufacturerOption[] 
}>) {
  const router = useRouter();
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [manufacturers] = useState<ManufacturerOption[]>(initialManufacturers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>("table");
  const [importedJson, setImportedJson] = useState<unknown>(null);
  const [tabularRows, setTabularRows] = useState<TabularRow[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const formStateRef = useRef<FormState>(initialState);
  formStateRef.current = form;
  const sectionSteps = [
    "Product Information",
    "Sustainability",
    "End of Life",
    "Guidelines & Manuals",
    "Compliance",
  ] as const;
  const [currentSectionStep, setCurrentSectionStep] = useState(0);

  const sectionLabel = (step: string) => {
    if (step === "Product Information") return t("dashboard.productInfo.title");
    if (step === "Sustainability") return t("dashboard.sustainability.title");
    if (step === "End of Life") return t("dashboard.eol.title");
    if (step === "Guidelines & Manuals") return t("dashboard.guidelines.title");
    if (step === "Compliance") return t("dashboard.compliance.title");
    return step;
  };

  const fieldsByStep: Record<string, Array<keyof FormState>> = {
    "Product Information": [
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
      "relatedObjectsRaw",
      "testReport",
      "imageUrl",
      "lifetimeExpectancy",
      "warrantyPeriod",
      "takebackOption",
      "qualityAssessment",
      "identifiedRisk",
      "productInfoCustomFields",
    ],
    "Compliance": [
      "regulations",
      "productLabels",
      "productStatusAssessment",
      "certifications",
      "dmmName",
      "dmmIdentifier",
      "complianceCustomFields",
    ],
    "Sustainability": [
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
    "End of Life": [
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
    "Guidelines & Manuals": [
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
  };

  const extensionSectionsForProductInfo: ExtensionSectionKey[] = [
    "sectorRequiredInformation",
    "productSpecification",
    "sectorNonRequiredInformation",
  ];

  const extensionFieldKeysForSector = (sectorType: string): Array<keyof FormState> => {
    const extensionConfig = EXTENSION_FIELD_CONFIG[sectorType];
    if (!extensionConfig) {
      return [];
    }

    const keys = extensionSectionsForProductInfo.flatMap((section) =>
      Object.values(extensionConfig[section] ?? {}).flatMap((group) =>
        group.map((field) => field.key as keyof FormState),
      ),
    );

    return [...new Set(keys)];
  };

  const currentStepFields = (): Array<keyof FormState> => {
    const step = sectionSteps[currentSectionStep];
    const baseFields = fieldsByStep[step] ?? [];

    if (step !== "Product Information") {
      return baseFields;
    }

    return [...baseFields, ...extensionFieldKeysForSector(form.sectorType)];
  };

  const formKeyLookup = useMemo(() => {
    const lookup = new Map<string, keyof FormState>();
    const keys = Object.keys(initialState) as Array<keyof FormState>;
    for (const key of keys) {
      lookup.set(normalizeFieldIdentifier(String(key)), key);
    }
    return lookup;
  }, []);

  const formKeyAliases: Record<string, keyof FormState> = {
    company: "manufacturerId",
    companyname: "manufacturerName",
    companyurl: "manufacturerUrl",
    componentbillsurl: "componentBills",
    spareparts: "sparePartsAvailability",
    testreporturl: "testReport",
    onerelatedobjecturiidperline: "relatedObjectsRaw",
  };

  const resolveFormTargetFromElement = (target: EventTarget | null): ResolvedFormTarget | null => {
    if (!(target instanceof HTMLElement)) return null;

    const inputElement = target.closest("input, textarea, select");
    if (!(inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement || inputElement instanceof HTMLSelectElement)) {
      return null;
    }

    const candidates = [
      inputElement.dataset.fieldKey || "",
      inputElement.getAttribute("name") || "",
      inputElement.id || "",
      inferFieldNameFromElement(inputElement),
    ];

    for (const candidate of candidates) {
      const resolved = resolveFormTargetCandidate(candidate, formKeyLookup, formKeyAliases);
      if (resolved) {
        return resolved;
      }
    }

    return null;
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setCustomGroupFields = (group: CustomFieldGroupKey, items: CustomFieldEntry[]) => {
    set(group, items);
  };

  const setField: FormSetter = (key, value) => set(key, value as never);

  const setSectorContext = (sector: string, sectorType: string) => {
    const extensionFields = createExtensionFormState(sectorType);
    setForm((prev) => ({
      ...prev,
      sector,
      sectorType,
      extensionData: {
        ...prev.extensionData,
        [sectorType]: extensionFields as Record<string, unknown>,
      },
      ...extensionFields,
    }));
  };

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
    t,
    form,
    set,
    setField,
    setSectorContext,
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
    EnvironmentalImpactArrayEditor,
    ResourceConsumptionArrayEditor,
    EventArrayEditor,
    CustomFieldsEditor,
  };

  const importedLeafCount = useMemo(
    () => (importedJson == null ? 0 : collectJsonLeaves(importedJson).length),
    [importedJson],
  );

  const logCsvMapping = (mapping: FieldMapping, context: MappingLogContext) => {
    globalThis.requestAnimationFrame(() => {
      const clonedFormState = globalThis.structuredClone(formStateRef.current);

      console.groupCollapsed(
        `[CSV Mapping] ${context.source} :: ${String(mapping.targetKey)}${
          mapping.targetSubField ? `.${mapping.targetSubField}` : ""
        }`,
      );
      console.log("Source path:", context.sourcePath);
      console.log("Target field:", mapping.targetField);
      console.log("Mapped value:", mapping.value);
      console.log("FormState snapshot:", clonedFormState);
      console.groupEnd();
    });
  };

  const addOrReplaceMapping = (next: FieldMapping, context: MappingLogContext) => {
    setMappings((prev) => {
      const withoutTarget = prev.filter(
        (mapping) => mapping.targetKey !== next.targetKey || mapping.sourcePath !== next.sourcePath,
      );
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

  const handleImportModeChange = (mode: ImportMode) => {
    setImportMode(mode);
    setImportedJson(null);
    setTabularRows([]);
    setMappings([]);
    setImportError(null);
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
      setTabularRows([]);
    } catch {
      setImportError("Invalid JSON file. Please upload a valid JSON document.");
      setImportedJson(null);
      setTabularRows([]);
      setMappings([]);
    }
  };

  const handleTableFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const rows = parseWorksheetRows(buffer);
      if (rows.length === 0) {
        setImportError("No data rows found in the uploaded file.");
        setTabularRows([]);
        setImportedJson(null);
        setMappings([]);
        return;
      }

      setTabularRows(rows);
      setImportedJson(rows[0]);
      setImportError(null);
      setMappings([]);
    } catch {
      setImportError("Invalid CSV/XLSX file. Please upload a valid table file.");
      setTabularRows([]);
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

    const target = resolveFormTargetFromElement(activeElement);
    if (!target) {
      setImportError("Cannot map this target field. Please drop onto a supported form input field.");
      return;
    }

    setImportError(null);
    addOrReplaceMapping({
      targetField,
      targetKey: target.targetKey,
      targetSubField: target.targetSubField,
      sourcePath: leaf.path,
      value: writtenValue,
    }, {
      source: "click-map",
      sourcePath: leaf.path,
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

    const target = resolveFormTargetFromElement(event.target);
    if (!target) {
      setImportError("Cannot map this target field. Please drop onto a supported form input field.");
      return;
    }

    setImportError(null);
    addOrReplaceMapping({
      targetField,
      targetKey: target.targetKey,
      targetSubField: target.targetSubField,
      sourcePath: parsed.path,
      value: writtenValue,
    }, {
      source: "drag-drop",
      sourcePath: parsed.path,
    });
  };

  const handleFormDragOver = (event: React.DragEvent<HTMLFormElement>) => {
    if (event.dataTransfer.types.includes(DRAG_MIME)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const clearCurrentStep = () => {
    const fields = currentStepFields();
    const extensionDefaults = createExtensionFormState(form.sectorType) as Record<string, unknown>;
    setForm((prev) => {
      const next = { ...prev } as FormState;
      for (const field of fields) {
        if (Object.hasOwn(extensionDefaults, field)) {
          (next as unknown as Record<string, unknown>)[field] = extensionDefaults[field];
          continue;
        }

        (next as unknown as Record<string, unknown>)[field] = initialState[field] as unknown;
      }
      return next;
    });

    const fieldNames = new Set(fields.map((field) => field.toString()));
    setMappings((prev) => prev.filter((mapping) => !fieldNames.has(mapping.targetKey)));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    console.log(form);
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let payload: Record<string, unknown> | Record<string, unknown>[];

      if (importMode === "table" && tabularRows.length > 0) {
        const validMappings = mappings.filter((mapping) =>
          Object.hasOwn(initialState, mapping.targetKey),
        );

        if (validMappings.length === 0) {
          throw new Error("Map at least one CSV/XLSX column to a form field before submitting.");
        }

        const rowForms = tabularRows.map((row) => {
          const rowForm = { ...form } as FormState;

          for (const mapping of validMappings) {
            const targetKey = mapping.targetKey;
            const sourceKey = normalizeJsonPath(mapping.sourcePath);
            const rawValue = row[mapping.sourcePath] ?? row[sourceKey] ?? "";
            const currentValue =
              (rowForm as unknown as Record<string, unknown>)[targetKey] ??
              initialState[targetKey];

            (rowForm as unknown as Record<string, unknown>)[targetKey] = applyMappedValueToField(
              currentValue,
              rawValue,
              mapping.targetSubField,
            );
          }

          return rowForm;
        });

        payload = rowForms.map((rowForm) => buildPayload(rowForm, manufacturers));
      } else {
        payload = buildPayload(form, manufacturers);
      }

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
          <h2 className="text-sm font-semibold text-gray-900 mb-3">{t("Data Import & Mapping")}</h2>
          <div className="mb-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-gray-600">
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={importMode === "table"}
              aria-label={t("Toggle import mode between CSV/XLSX and JSON")}
              onClick={() => handleImportModeChange(importMode === "json" ? "table" : "json")}
              className="relative w-full h-8 rounded-full border border-gray-300 bg-gray-100 hover:cursor-pointer"
            >
              <span
                className={`absolute top-0.75 h-6 w-[calc(50%-4px)] rounded-full bg-[var(--color-brand-pink)] transition-transform ${
                  importMode === "json" ? "translate-x-[calc(1px)]" : "translate-x-[calc(-100%)]"
                }`}
              />
              <span className="relative z-10 grid h-full grid-cols-2 text-xs font-semibold">
                <span className={`self-center ${importMode === "table" ? "text-white" : "text-gray-700"}`}>CSV/XLSX</span>
                <span className={`self-center ${importMode === "json" ? "text-white" : "text-gray-700"}`}>JSON</span>
              </span>
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="file"
              accept={importMode === "json" ? "application/json,.json" : ".csv,.xlsx,.xls"}
              onChange={importMode === "json" ? handleJsonFileUpload : handleTableFileUpload}
              className="block w-full text-xs text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:border file:border-gray-200 file:rounded-md file:bg-gray-50 file:text-gray-700"
            />
            <p className="text-xs text-gray-500">
              {importMode === "json"
                ? t("Drag values from the tree onto form fields.")
                : t("Drag values from the first-row preview onto form fields.")}
            </p>
            <div className="text-xs text-gray-600">
              <div>{t("Imported leaves")}: <span className="font-medium">{importedLeafCount}</span></div>
              <div>{t("Mapped fields")}: <span className="font-medium">{mappings.length}</span></div>
              {importMode === "table" && (
                <div>{t("Rows detected")}: <span className="font-medium">{tabularRows.length}</span></div>
              )}
            </div>
            {importError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                {importError}
              </div>
            )}
          </div>

          <div className="mt-4 max-h-[340px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
            {importedJson == null ? (
              <p className="text-xs text-gray-500">
                {importMode === "json" ? t("No JSON loaded.") : t("No CSV/XLSX loaded.")}
              </p>
            ) : (
              <JsonTree
                value={importedJson}
                path="root"
                onLeafDrag={handleLeafDragStart}
                onLeafClick={handleLeafClick}
                leafUsageByPath={leafUsageByPath}
                t={t}
              />
            )}
          </div>
          {importMode === "table" && tabularRows.length > 0 && (
            <p className="mt-2 text-[11px] text-gray-500">
              {t("First row is shown above as the mapping example. All mappings apply automatically to every row.")}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <span className="inline-flex items-center gap-1 rounded border border-[var(--color-brand-pink)] bg-[var(--color-brand-pink-super-light)] px-2 py-0.5">
              {t("Mapped field")}
            </span>
            <span className="inline-flex items-center gap-1 rounded border border-[var(--color-brand-blue)] bg-[var(--color-brand-blue-super-light)] px-2 py-0.5">
              {t("Custom field")}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">{t("Current Mappings")}</h3>
            <div className="max-h-[220px] overflow-auto space-y-2">
              {mappings.length === 0 && (
                <p className="text-xs text-gray-500">{t("No mappings yet.")}</p>
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
                      {t("Remove")}
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
          {`← ${t("addProduct.back")}`}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t("addProduct.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("addProduct.subtitle")}
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
                  {index + 1}. {sectionLabel(step)}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{`${t("addProduct.step")} ${currentSectionStep + 1} ${t("addProduct.of")} ${sectionSteps.length}`}</span>
            <div className="flex items-center gap-3">
              {/* <span>{sectionSteps[currentSectionStep]}</span> */}
              <button
                type="button"
                onClick={clearCurrentStep}
                className="px-2 py-1 border border-gray-300 rounded text-[11px] text-gray-600 disabled:opacity-50 hover:cursor-pointer"
              >
                {t("addProduct.clearCurrent")}
              </button>
            </div>
          </div>
        </div>

        {/* ── PRODUCT INFORMATION ──────────────────────────────────────── */}
        {currentSectionStep === 0 && (
        <ProductInformationStep shared={stepShared} />
        )}

        {/* ── SUSTAINABILITY ───────────────────────────────────────────── */}
        {currentSectionStep === 1 && (
        <SustainabilityStep shared={stepShared} />
        )}
        {/* ── END OF LIFE ──────────────────────────────────────────────── */}
        {currentSectionStep === 2 && (
        <EndOfLifeStep shared={stepShared} />
        )}
{/* ── GUIDELINES & MANUALS ─────────────────────────────────────── */}
        {currentSectionStep === 3 && (
        <GuidelinesStep shared={stepShared} />
        )}

{/* ── COMPLIANCE ───────────────────────────────────────────────── */}
        {currentSectionStep === 4 && (
        <ComplianceStep shared={stepShared} />
        )}

{/* ── USAGE & MAINTENANCE ──────────────────────────────────────── */}
        {currentSectionStep === 5 && (
        <CollapsibleSection title={t("Usage & Maintenance")} defaultOpen>
          <DataLayerGroup layer="Downstream Data">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  {t("Maintenance Log")}
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
                label={t("Maintenance Events")}
                events={form.maintenanceLog}
                onChange={(v) => set("maintenanceLog", v)}
                t={t}
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  {t("Usage History")}
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
                label={t("Usage Events")}
                events={form.usageHistory}
                onChange={(v) => set("usageHistory", v)}
                t={t}
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  {t("Incidents & Errors")}
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
                label={t("Incident Events")}
                events={form.incidentsAndErrors}
                onChange={(v) => set("incidentsAndErrors", v)}
                t={t}
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
              {t("addProduct.previous")}
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
              {t("addProduct.next")}
            </button>
          </div>

          <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[var(--color-brand-pink)] text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors hover:cursor-pointer"
          >
            {submitting ? t("addProduct.submitting") : t("addProduct.submit")}
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
              {t("Added successfully! Redirecting…")}
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