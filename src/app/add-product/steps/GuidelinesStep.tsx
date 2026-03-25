import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

export function GuidelinesStep({ shared }: { shared: any }) {
  const {
    form,
    set,
    canUseLeaf,
    setCustomGroupFields,
    CustomFieldsEditor,
  } = shared;

  return (
        <CollapsibleSection title="Guidelines & Manuals" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <DataPointComponent label="Assembly Guideline">
              <FormField
                  label="Assembly Guideline URL"
                  value={form.assemblyGuidelineUrl}
                  onChange={(v) => set("assemblyGuidelineUrl", v)}
                  type="url"
                />
            </DataPointComponent>
            <DataPointComponent label="Non-Destructive Disassembly Guideline">
              <FormField
                  label="Non-Destructive Disassembly Guideline URL"
                  value={form.disassemblyGuidelineUrl}
                  onChange={(v) => set("disassemblyGuidelineUrl", v)}
                  type="url"
                />
            </DataPointComponent>
            <DataPointComponent label="Product Manual">
              <FormField
                label="Product Manual URL"
                value={form.productManualUrl}
                onChange={(v) => set("productManualUrl", v)}
                type="url"
              />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            <DataPointComponent label="Storage & Transport Guideline">
                <FormField
                label="Storage & Transport Guideline URL"
                value={form.storageGuidelineUrl}
                onChange={(v) => set("storageGuidelineUrl", v)}
                type="url"
              />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <DataPointComponent label="Commercial Instructions">
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
            </DataPointComponent>
            <DataPointComponent label="Accessibility">
              <TextAreaField
                label=""
                value={form.accessibility}
                onChange={(v: string) => set("accessibility", v)}
              />
            </DataPointComponent>
            <DataPointComponent label="Utilization Characteristic">
              <TextAreaField
                label=""
                value={form.utilizationCharacteristic}
                onChange={(v: string) => set("utilizationCharacteristic", v)}
              />
            </DataPointComponent>
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
