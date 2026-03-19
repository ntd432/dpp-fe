import React from "react";
import { FormField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";

export function ComplianceStep({ shared }: Readonly<{ shared: any }>) {
  const {
    form,
    set,
    canUseLeaf,
    setCustomGroupFields,
    RegulationArrayEditor,
    LabelArrayEditor,
    NameDescArrayEditor,
    CustomFieldsEditor,
  } = shared;

  return (
        <CollapsibleSection title="Compliance" color="purple" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            {/* Regulation */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Regulations
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
              <RegulationArrayEditor
                items={form.regulations}
                onChange={(v: typeof form.regulations) => set("regulations", v)}
              />
              </div>
            </details>

            {/* ComplianceLabel */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Product Labels
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
              <LabelArrayEditor
                items={form.productLabels}
                onChange={(v: typeof form.productLabels) => set("productLabels", v)}
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            {/* ProductStatusAssessment */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Product Status Assessment
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
                label="Assessment URL"
                value={form.productStatusAssessment}
                onChange={(v) => set("productStatusAssessment", v)}
                type="url"
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            {/* Certification */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Certifications
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
              <NameDescArrayEditor
                label="Certifications"
                items={form.certifications}
                onChange={(v: typeof form.certifications) => set("certifications", v)}
                namePlaceholder="Certification name"
              />
              </div>
            </details>

            {/* DataManagementMethod */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Data Management Method
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
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Custom Fields">
            <CustomFieldsEditor
              title="Compliance Custom Fields"
              items={form.complianceCustomFields}
              onChange={(items: typeof form.complianceCustomFields) =>
                setCustomGroupFields("complianceCustomFields", items)
              }
              canUseLeaf={canUseLeaf}
            />
          </DataLayerGroup>
          
        </CollapsibleSection>
  );
}
