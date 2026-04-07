import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

export function GuidelinesStep({ shared }: Readonly<{ shared: any }>) {
  const {
    t,
    form,
    set,
    canUseLeaf,
    setCustomGroupFields,
    CustomFieldsEditor,
  } = shared;

  return (
        <CollapsibleSection title={t("Guidelines & Manuals")} defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <DataPointComponent label={t("Assembly Guideline")}>
              <FormField
                  label={t("Assembly Guideline URL")}
                  value={form.assemblyGuidelineUrl}
                  onChange={(v) => set("assemblyGuidelineUrl", v)}
                  fieldKey="assemblyGuidelineUrl"
                  type="url"
                />
            </DataPointComponent>
            <DataPointComponent label={t("Non-Destructive Disassembly Guideline")}>
              <FormField
                  label={t("Non-Destructive Disassembly Guideline URL")}
                  value={form.disassemblyGuidelineUrl}
                  onChange={(v) => set("disassemblyGuidelineUrl", v)}
                  fieldKey="disassemblyGuidelineUrl"
                  type="url"
                />
            </DataPointComponent>
            <DataPointComponent label={t("Product Manual")}>
              <FormField
                label={t("Product Manual URL")}
                value={form.productManualUrl}
                onChange={(v) => set("productManualUrl", v)}
                fieldKey="productManualUrl"
                type="url"
              />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Sectoral">
            <DataPointComponent label={t("Storage & Transport Guideline")}>
                <FormField
                label={t("Storage & Transport Guideline URL")}
                value={form.storageGuidelineUrl}
                onChange={(v) => set("storageGuidelineUrl", v)}
                fieldKey="storageGuidelineUrl"
                type="url"
              />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <DataPointComponent label={t("Commercial Instructions")}>
              <FormField
                  label={t("Safety Instruction URL")}
                  value={form.safetyInstructionUrl}
                  onChange={(v) => set("safetyInstructionUrl", v)}
                  fieldKey="safetyInstructionUrl"
                  type="url"
                />
                <FormField
                  label={t("Maintenance Instruction URL")}
                  value={form.maintenanceInstructionUrl}
                  onChange={(v) => set("maintenanceInstructionUrl", v)}
                  fieldKey="maintenanceInstructionUrl"
                  type="url"
                />
                <FormField
                  label={t("Waste Sorting Instruction URL")}
                  value={form.wasteSortingInstructionUrl}
                  onChange={(v) => set("wasteSortingInstructionUrl", v)}
                  fieldKey="wasteSortingInstructionUrl"
                  type="url"
                />
            </DataPointComponent>
            <DataPointComponent label={t("Accessibility")}>
              <TextAreaField
                label={t("Accessibility")}
                value={form.accessibility}
                onChange={(v: string) => set("accessibility", v)}
                fieldKey="accessibility"
              />
            </DataPointComponent>
            <DataPointComponent label={t("Utilization Characteristic")}>
              <TextAreaField
                label={t("Utilization Characteristic")}
                value={form.utilizationCharacteristic}
                onChange={(v: string) => set("utilizationCharacteristic", v)}
                fieldKey="utilizationCharacteristic"
              />
            </DataPointComponent>
          </DataLayerGroup>

          <DataLayerGroup layer="Custom Fields">
            <CustomFieldsEditor
              title={t("Guidelines Custom Fields")}
              items={form.guidelinesCustomFields}
              onChange={(items: any[]) => setCustomGroupFields("guidelinesCustomFields", items)}
              canUseLeaf={canUseLeaf}
              t={t}
            />
          </DataLayerGroup>
        </CollapsibleSection>
  );
}
