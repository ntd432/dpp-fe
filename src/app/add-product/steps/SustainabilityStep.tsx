import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";

export function SustainabilityStep({ shared }: { shared: any }) {
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
        <CollapsibleSection title="Sustainability" color="emerald" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            {/* SustainabilityPerformance */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Sustainability Performance
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
              <EnvironmentalFootprintArrayEditor
                items={form.environmentalFootprints}
                onChange={(v: any[]) => set("environmentalFootprints", v)}
              />
              <ResourceConsumptionArrayEditor
                label="Resource Consumption"
                items={form.resourceConsumptions}
                onChange={(v: any[]) => set("resourceConsumptions", v)}
              />
              <TextAreaField
                label="Plastics Release"
                value={form.plasticsRelease}
                onChange={(v: string) => set("plasticsRelease", v)}
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            {/* Decomposability */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Decomposability
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
                label="Decomposability"
                value={form.decomposability}
                onChange={(v) => set("decomposability", v)}
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Sector Sustainability Indicators
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
                label="Sector indicators"
                value={form.sectorSustainabilityIndicatorsText}
                onChange={(v) => set("sectorSustainabilityIndicatorsText", v)}
              />
              </div>
            </details>

            {/* CriticalRawMaterial */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Critical Raw Materials
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
              <ComponentArrayEditor
                label="Critical Raw Components"
                items={form.criticalRawMaterials}
                onChange={(v: any[]) => set("criticalRawMaterials", v)}
              />
              </div>
            </details>

            {/* LifeCycleAssessment */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Life Cycle Assessment
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
                label="LCA Report URL"
                value={form.lifeCycleAssessmentReport}
                onChange={(v) => set("lifeCycleAssessmentReport", v)}
                type="url"
              />
              <EnvironmentalImpactArrayEditor
                items={form.environmentalImpacts}
                onChange={(v: any[]) => set("environmentalImpacts", v)}
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            {/* RenewableNonRenewableContent */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Renewable / Non-Renewable Content
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
              <ComponentArrayEditor
                label="Components"
                items={form.renewableNonRenewableContent}
                onChange={(v: any[]) => set("renewableNonRenewableContent", v)}
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Circular Economy Indicator
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
                label="Circular economy indicator"
                value={form.circularEconomyIndicatorText}
                onChange={(v: string) => set("circularEconomyIndicatorText", v)}
              />
              </div>
            </details>

            {/* SocialIndicator */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Social Indicator
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
                label="Labour Conditions"
                value={form.labourConditions}
                onChange={(v: string) => set("labourConditions", v)}
              />
              </div>
            </details>

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Sustainability Attributes
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
                <ResourceConsumptionArrayEditor
                  label="Resource Consumption When Using"
                  items={form.usingResourceConsumptions}
                  onChange={(v: any[]) => set("usingResourceConsumptions", v)}
                />
                <ResourceConsumptionArrayEditor
                  label="Resource Consumption When Recovering"
                  items={form.recoveringResourceConsumptions}
                  onChange={(v: any[]) => set("recoveringResourceConsumptions", v)}
                />
              </div>
              </div>
            </details>

            {/* EnvironmentDeclaration */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Environment Declaration
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
                label="Declaration URL"
                value={form.environmentDeclaration}
                onChange={(v: string) => set("environmentDeclaration", v)}
                type="url"
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Custom Fields">
            <CustomFieldsEditor
              title="Sustainability Custom Fields"
              items={form.sustainabilityCustomFields}
              onChange={(items: any[]) => setCustomGroupFields("sustainabilityCustomFields", items)}
              canUseLeaf={canUseLeaf}
            />
          </DataLayerGroup>
        </CollapsibleSection>
  );
}
