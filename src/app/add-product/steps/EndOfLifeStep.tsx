import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

export function EndOfLifeStep({ shared }: { shared: any }) {
  const {
    form,
    set,
    canUseLeaf,
    setCustomGroupFields,
    EventArrayEditor,
    CustomFieldsEditor,
  } = shared;

  return (
        <CollapsibleSection title="End of Life" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <DataPointComponent label="Recycling and Reuse Potential">
              <TextAreaField
                label=""
                value={form.recyclingReusePotential}
                onChange={(v) => set("recyclingReusePotential", v)}
              />
            </DataPointComponent>
            <DataPointComponent label="Disposal Options">
              <TextAreaField
                label=""
                value={form.disposalOptions}
                onChange={(v) => set("disposalOptions", v)}
              />
            </DataPointComponent>
            <DataPointComponent label="Unsold Products Information">
              <TextAreaField
                label=""
                value={form.unsoldProductsInformation}
                onChange={(v) => set("unsoldProductsInformation", v)}
              />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
              <DataPointComponent label="Expected Waste">
                <TextAreaField
                label=""
                value={form.expectedWaste}
                onChange={(v) => set("expectedWaste", v)}
              />
              </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <DataPointComponent label="Reusability and Repurposability">
              <TextAreaField
                  label=""
                  value={form.reusability}
                  onChange={(v) => set("reusability", v)}
                />
            </DataPointComponent>
            <DataPointComponent label="Repairability and Maintainability">
              <TextAreaField
                  label=""
                  value={form.repairability}
                  onChange={(v) => set("repairability", v)}
                />
            </DataPointComponent>
            <DataPointComponent label="Refurbishability and Remanufacturability">
              <TextAreaField
                  label=""
                  value={form.refurbishability}
                  onChange={(v) => set("refurbishability", v)}
                />
            </DataPointComponent>
            <DataPointComponent label="Upgrade Options">
              <TextAreaField
                  label=""
                  value={form.upgradeOptions}
                  onChange={(v) => set("upgradeOptions", v)}
                />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Downstream Data">
              <DataPointComponent label="End-of-Life History">
                <EventArrayEditor
                  label="End-of-Life History Events"
                  events={form.endOfLifeHistory}
                  onChange={(v: any) => set("endOfLifeHistory", v)}
                />
              </DataPointComponent>
              <DataPointComponent label="Number of Lifecycles">
                <FormField
                  label=""
                  value={form.numberOfLifecycles}
                  onChange={(v) => set("numberOfLifecycles", v)}
                  type="number"
                />
              </DataPointComponent>
              <DataPointComponent label="End-of-Life Information">
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
              </DataPointComponent>
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
