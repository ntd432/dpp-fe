import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";

export function EndOfLifeStep({ shared }: { shared: any }) {
  const {
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
  } = shared;

  return (
        <CollapsibleSection title="End of Life" color="rose" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Recycling & Disposal
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
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Expected Waste
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
              <TextAreaField
                label="Expected Waste"
                value={form.expectedWaste}
                onChange={(v) => set("expectedWaste", v)}
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Circularity Options
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
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Downstream Data">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  End-of-Life Lifecycle Data
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
                label="End-of-Life History"
                events={form.endOfLifeHistory}
                onChange={(v: any) => set("endOfLifeHistory", v)}
              />
              <FormField
                label="Number of Lifecycles"
                value={form.numberOfLifecycles}
                onChange={(v) => set("numberOfLifecycles", v)}
                type="number"
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  End-of-Life Information
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
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Custom Fields">
            <CustomFieldsEditor
              title="End of Life Custom Fields"
              items={form.endOfLifeCustomFields}
              onChange={(items: any[]) => setCustomGroupFields("endOfLifeCustomFields", items)}
              canUseLeaf={canUseLeaf}
            />
          </DataLayerGroup>
        </CollapsibleSection>
  );
}
