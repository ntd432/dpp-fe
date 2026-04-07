import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { COUNTRIES } from "@/config/countries";
import { SECTORS } from "@/config/sectors";

export function ProductInformationStep({ shared }: Readonly<{ shared: any }>) {
  const {
    t,
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
    CustomFieldsEditor,
  } = shared;

  return (
    <CollapsibleSection title={t("Product Information")} defaultOpen>
      <div>
        <label htmlFor="sector-select" className="block text-sm font-medium text-gray-700 mb-1">
          {t("Product Sector")}
        </label>
        <select
          id="sector-select"
          name="sectorType"
          data-field-key="sectorType"
          value={form.sectorType}
          onChange={(e) => {
            const selected = SECTORS.find((s) => s.extensionType === e.target.value);
            set("sectorType", selected?.extensionType ?? "");
            set("sector", selected?.label ?? "");
          }}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]"
        >
          {SECTORS.map((s) => (
            <option key={s.extensionType} value={s.extensionType}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-400">{t("Determines the extension type for sector-specific fields.")}</p>
      </div>

      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label={t("Product Identification Information")}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={t("Product Name")}
              value={form.productName}
              onChange={(v) => set("productName", v)}
              fieldKey="productName"
              required
            />
            <FormField label={t("GTIN")} value={form.gtin} onChange={(v) => set("gtin", v)} fieldKey="gtin" required />
            <FormField label={t("TARIC Code")} value={form.taricCode} onChange={(v) => set("taricCode", v)} fieldKey="taricCode" />
            <div>
              <label htmlFor="country-origin" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Country of Origin")}
              </label>
              <select
                id="country-origin"
                name="countryOfOrigin"
                data-field-key="countryOfOrigin"
                value={form.countryOfOrigin}
                onChange={(e) => set("countryOfOrigin", e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">{t("Select country")}</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              label={t("Production Date")}
              value={form.productionDate}
              onChange={(v) => set("productionDate", v)}
              fieldKey="productionDate"
              type="date"
            />
            <FormField
              label={t("Documentation URL")}
              value={form.documentation}
              onChange={(v) => set("documentation", v)}
              fieldKey="documentation"
              type="url"
            />
          </div>
          <TextAreaField
            label={t("Description")}
            value={form.description}
            onChange={(v) => set("description", v)}
            fieldKey="description"
          />
        </DataPointComponent>

        <DataPointComponent label={t("Manufacturer")}>
          <div>
            <label htmlFor="manufacturer-select" className="block text-sm font-medium text-gray-700 mb-1">
              {t("Company")}
            </label>
            <select
              id="manufacturer-select"
              name="manufacturerId"
              data-field-key="manufacturerId"
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
              <option value="">{t("Select a manufacturer…")}</option>
              {manufacturers.map((m: any) => (
                <option key={m.id ?? m.identifier ?? m.name} value={m.id ?? ""}>
                  {m.name}
                </option>
              ))}
              <option value="__new__">{t("+ Add a new manufacturer")}</option>
            </select>
          </div>

          {form.manufacturerMode === "new" && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label={t("Company Name")}
                value={form.manufacturerName}
                onChange={(v) => set("manufacturerName", v)}
                fieldKey="manufacturerName"
              />
              <FormField
                label={t("Company URL")}
                value={form.manufacturerUrl}
                onChange={(v) => set("manufacturerUrl", v)}
                fieldKey="manufacturerUrl"
                type="url"
              />
            </div>
          )}
        </DataPointComponent>

        <DataPointComponent label={t("Component Information")}>
          <ComponentArrayEditor
            label={t("Component Composition")}
            items={form.componentComposition}
            onChange={(v: any) => set("componentComposition", v)}
            organizations={manufacturers}
            t={t}
            showPercentage
          />
          <FormField
            label={t("Component Bills URL")}
            value={form.componentBills}
            onChange={(v) => set("componentBills", v)}
            fieldKey="componentBills"
            type="url"
          />
          <ComponentArrayEditor
            label={t("Recycled / Reused Content")}
            items={form.recycledReusedContent}
            onChange={(v: any) => set("recycledReusedContent", v)}
            organizations={manufacturers}
            t={t}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Spare Parts Availability")}>
          <TextAreaField
            label={t("Spare Parts")}
            value={form.sparePartsAvailability}
            onChange={(v: any) => set("sparePartsAvailability", v)}
            fieldKey="sparePartsAvailability"
          />
        </DataPointComponent>

        <DataPointComponent label={t("Hazardous Substances")}>
          <SubstanceArrayEditor
            label={t("Hazardous Substances")}
            items={form.hazardousSubstances}
            onChange={(v: any) => set("hazardousSubstances", v)}
            t={t}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Substances of Concern")}>
          <SubstanceArrayEditor
            label={t("Substances of Concern")}
            items={form.substancesOfConcern}
            onChange={(v: any) => set("substancesOfConcern", v)}
            t={t}
          />
        </DataPointComponent>

        {renderExtensionSection("sectorRequiredInformation", form, setField, t)}
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        {renderExtensionSection("productSpecification", form, setField, t)}
        {renderExtensionSection("sectorNonRequiredInformation", form, setField, t)}

        <DataPointComponent label={t("Related Objects")}>
          <TextAreaField
            label={t("One related object URI/ID per line")}
            value={form.relatedObjectsRaw}
            onChange={(v) => set("relatedObjectsRaw", v)}
            fieldKey="relatedObjectsRaw"
            rows={4}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Test Report")}>
          <FormField
            label={t("Test Report URL")}
            value={form.testReport}
            onChange={(v) => set("testReport", v)}
            fieldKey="testReport"
            type="url"
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label={t("Product Commercial Information")}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={t("Image URL")}
              value={form.imageUrl}
              onChange={(v) => set("imageUrl", v)}
              fieldKey="imageUrl"
              type="url"
            />
            <FormField
              label={t("Lifetime Expectancy (ISO 8601)")}
              value={form.lifetimeExpectancy}
              onChange={(v) => set("lifetimeExpectancy", v)}
              fieldKey="lifetimeExpectancy"
              placeholder={t("e.g., P5Y")}
            />
            <FormField
              label={t("Warranty Period (ISO 8601)")}
              value={form.warrantyPeriod}
              onChange={(v) => set("warrantyPeriod", v)}
              fieldKey="warrantyPeriod"
              placeholder={t("e.g., P2Y")}
            />
            <FormField
              label={t("Takeback Option")}
              value={form.takebackOption}
              onChange={(v) => set("takebackOption", v)}
              fieldKey="takebackOption"
            />
          </div>
        </DataPointComponent>

        <DataPointComponent label={t("Quality Assessment")}>
          <TextAreaField
            label={t("Quality Assessment")}
            value={form.qualityAssessment}
            onChange={(v) => set("qualityAssessment", v)}
            fieldKey="qualityAssessment"
          />
        </DataPointComponent>

        <DataPointComponent label={t("Identified Risk")}>
          <TextAreaField
            label={t("Identified Risk")}
            value={form.identifiedRisk}
            onChange={(v) => set("identifiedRisk", v)}
            fieldKey="identifiedRisk"
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Custom Fields">
        <CustomFieldsEditor
          title={t("Product Information Custom Fields")}
          items={form.productInfoCustomFields}
          onChange={(items: any[]) => setCustomGroupFields("productInfoCustomFields", items)}
          canUseLeaf={canUseLeaf}
          t={t}
        />
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
