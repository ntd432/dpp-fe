import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

export function EndOfLifeStep({ shared }: Readonly<{ shared: any }>) {
  const {
    t,
    form,
    set,
    canUseLeaf,
    setCustomGroupFields,
    EventArrayEditor,
    CustomFieldsEditor,
  } = shared;

  return (
        <CollapsibleSection title={t("End of Life")} defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <DataPointComponent label={t("Recycling and Reuse Potential")}>
              <TextAreaField
                label={t("Recycling and Reuse Potential")}
                value={form.recyclingReusePotential}
                onChange={(v) => set("recyclingReusePotential", v)}
                fieldKey="recyclingReusePotential"
              />
            </DataPointComponent>
            <DataPointComponent label={t("Disposal Options")}>
              <TextAreaField
                label={t("Disposal Options")}
                value={form.disposalOptions}
                onChange={(v) => set("disposalOptions", v)}
                fieldKey="disposalOptions"
              />
            </DataPointComponent>
            <DataPointComponent label={t("Unsold Products Information")}>
              <TextAreaField
                label={t("Unsold Products Information")}
                value={form.unsoldProductsInformation}
                onChange={(v) => set("unsoldProductsInformation", v)}
                fieldKey="unsoldProductsInformation"
              />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
              <DataPointComponent label={t("Expected Waste")}>
                <TextAreaField
                label={t("Expected Waste")}
                value={form.expectedWaste}
                onChange={(v) => set("expectedWaste", v)}
                fieldKey="expectedWaste"
              />
              </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <DataPointComponent label={t("Reusability and Repurposability")}>
              <TextAreaField
                  label={t("Reusability and Repurposability")}
                  value={form.reusability}
                  onChange={(v) => set("reusability", v)}
                  fieldKey="reusability"
                />
            </DataPointComponent>
            <DataPointComponent label={t("Repairability and Maintainability")}>
              <TextAreaField
                  label={t("Repairability and Maintainability")}
                  value={form.repairability}
                  onChange={(v) => set("repairability", v)}
                  fieldKey="repairability"
                />
            </DataPointComponent>
            <DataPointComponent label={t("Refurbishability and Remanufacturability")}>
              <TextAreaField
                  label={t("Refurbishability and Remanufacturability")}
                  value={form.refurbishability}
                  onChange={(v) => set("refurbishability", v)}
                  fieldKey="refurbishability"
                />
            </DataPointComponent>
            <DataPointComponent label={t("Upgrade Options")}>
              <TextAreaField
                  label={t("Upgrade Options")}
                  value={form.upgradeOptions}
                  onChange={(v) => set("upgradeOptions", v)}
                  fieldKey="upgradeOptions"
                />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Downstream Data">
              <DataPointComponent label={t("End-of-Life History")}>
                <EventArrayEditor
                  label={t("End-of-Life History Events")}
                  events={form.endOfLifeHistory}
                  onChange={(v: any) => set("endOfLifeHistory", v)}
                  fieldPrefix="endOfLifeHistory"
                  t={t}
                />
              </DataPointComponent>
              <DataPointComponent label={t("Number of Lifecycles")}>
                <FormField
                  label={t("Number of Lifecycles")}
                  value={form.numberOfLifecycles}
                  onChange={(v) => set("numberOfLifecycles", v)}
                  fieldKey="numberOfLifecycles"
                  type="number"
                />
              </DataPointComponent>
              <DataPointComponent label={t("End-of-Life Information")}>
                <TextAreaField
                  label={t("Waste Prevention")}
                  value={form.wastePrevention}
                  onChange={(v) => set("wastePrevention", v)}
                  fieldKey="wastePrevention"
                />
                <TextAreaField
                  label={t("Separate Collection")}
                  value={form.separateCollection}
                  onChange={(v) => set("separateCollection", v)}
                  fieldKey="separateCollection"
                />
                <TextAreaField
                  label={t("Collection Information")}
                  value={form.collectionInformation}
                  onChange={(v) => set("collectionInformation", v)}
                  fieldKey="collectionInformation"
                />
                <FormField
                  label={t("End-of-Life Report URL")}
                  value={form.endOfLifeReport}
                  onChange={(v) => set("endOfLifeReport", v)}
                  fieldKey="endOfLifeReport"
                  type="url"
                />
              </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Custom Fields">
            <CustomFieldsEditor
              title={t("End of Life Custom Fields")}
              items={form.endOfLifeCustomFields}
              onChange={(items: any[]) => setCustomGroupFields("endOfLifeCustomFields", items)}
              canUseLeaf={canUseLeaf}
              t={t}
            />
          </DataLayerGroup>
        </CollapsibleSection>
  );
}
