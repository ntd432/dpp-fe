import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import { COUNTRIES } from "@/config/countries";
import { SECTORS } from "@/config/sectors";

export function ProductInformationStep({ shared }: { shared: any }) {
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
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Product Identification Information
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
              </div>
            </details>

            {/* Manufacturer */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Manufacturer
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
                      const selected = manufacturers.find((m: any) => m.id === val);
                      set("manufacturerMode", "existing");
                      set("manufacturerId", val);
                      set("manufacturerName", selected?.name ?? "");
                      set("manufacturerUrl", selected?.url ?? "");
                    }
                  }}
                  className={INPUT_CLASS}
                >
                  <option value="">Select a manufacturer…</option>
                  {manufacturers.map((m: any) => (
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
              </div>
            </details>

            {/* ComponentInformation */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Component Information
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
                label="Component Composition"
                items={form.componentComposition}
                onChange={(v: any) => set("componentComposition", v)}
                showPercentage
              />
              <FormField
                label="Component Bills URL"
                value={form.componentBills}
                onChange={(v) => set("componentBills", v)}
                type="url"
              />
              <ComponentArrayEditor
                label="Recycled / Reused Content"
                items={form.recycledReusedContent}
                onChange={(v: any) => set("recycledReusedContent", v)}
              />
              </div>
            </details>

            {/* SparePartsAvailability */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">

              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Spare Parts Availability
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
                    label="Spare Parts"
                    value={form.sparePartsAvailability}
                    onChange={(v: any) => set("sparePartsAvailability", v)}
                  />
              </div>
            </details>

            {/* HazardousSubstances */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Hazardous Substances
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
              <SubstanceArrayEditor
                label="Hazardous Substances"
                items={form.hazardousSubstances}
                onChange={(v: any) => set("hazardousSubstances", v)}
              />
              </div>
            </details>

            {/* SubstancesOfConcern */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Substances of Concern
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
              <SubstanceArrayEditor
                label="Substances of Concern"
                items={form.substancesOfConcern}
                onChange={(v: any) => set("substancesOfConcern", v)}
              />
              </div>
            </details>

            {/* SectorRequiredInformation */}
            {renderExtensionSection("sectorRequiredInformation", form, setField)}
          </DataLayerGroup>

          {/* Sectoral layer */}
          <DataLayerGroup layer="Sectoral">
            {/* ProductSpecification */}
            {renderExtensionSection("productSpecification", form, setField)}

            {renderExtensionSection("sectorNonRequiredInformation", form, setField)}

            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Related Objects
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
                label="One related object URI/ID per line"
                value={form.relatedObjectsRaw}
                onChange={(v) => set("relatedObjectsRaw", v)}
                rows={4}
              />
              </div>
            </details>

            {/* TestReport */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Test Report
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
                label="Test Report URL"
                value={form.testReport}
                onChange={(v) => set("testReport", v)}
                type="url"
              />
              </div>
            </details>
          </DataLayerGroup>

          {/* Commercial layer */}
          <DataLayerGroup layer="Commercial">
            {/* ProductCommercialInformation */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Product Commercial Information
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
              </div>
            </details>

            {/* QualityAssessment */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Quality Assessment
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
                label="Quality Assessment"
                value={form.qualityAssessment}
                onChange={(v) => set("qualityAssessment", v)}
              />
              </div>
            </details>

            {/* IdentifiedRisk */}
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Identified Risk
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
                label="Identified Risk"
                value={form.identifiedRisk}
                onChange={(v) => set("identifiedRisk", v)}
              />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Custom Fields">
            <CustomFieldsEditor
              title="Product Information Custom Fields"
              items={form.productInfoCustomFields}
              onChange={(items: any[]) => setCustomGroupFields("productInfoCustomFields", items)}
              canUseLeaf={canUseLeaf}
            />
          </DataLayerGroup>
        </CollapsibleSection>
  );
}
