import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";

export function GuidelinesStep({ shared }: { shared: any }) {
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
        <CollapsibleSection title="Guidelines & Manuals" color="cyan" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Assembly & Disassembly Guides
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
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Product Manual
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
              <FormField
                label="Product Manual URL"
                value={form.productManualUrl}
                onChange={(v) => set("productManualUrl", v)}
                type="url"
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Storage & Transport
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
              <FormField
                label="Storage & Transport Guideline URL"
                value={form.storageGuidelineUrl}
                onChange={(v) => set("storageGuidelineUrl", v)}
                type="url"
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Commercial Instructions
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
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Accessibility & Utilization
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
                label="Accessibility"
                value={form.accessibility}
                onChange={(v: string) => set("accessibility", v)}
              />
              <TextAreaField
                label="Utilization Characteristic"
                value={form.utilizationCharacteristic}
                onChange={(v: string) => set("utilizationCharacteristic", v)}
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Custom Fields">
            <CustomFieldsEditor
              title="Guidelines Custom Fields"
              items={form.guidelinesCustomFields}
              onChange={(items: any[]) => setCustomGroupFields("guidelinesCustomFields", items)}
              canUseLeaf={canUseLeaf}
            />
          </DataLayerGroup>
        </CollapsibleSection>
  );
}
