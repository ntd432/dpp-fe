import React from "react";
import { FormField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

export function ComplianceStep({ shared }: Readonly<{ shared: any }>) {
  const {
    t,
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
    <CollapsibleSection title={t("Compliance")} defaultOpen>
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label={t("Regulations")}>
          <RegulationArrayEditor
            items={form.regulations}
            onChange={(v: typeof form.regulations) => set("regulations", v)}
            fieldPrefix="regulations"
            t={t}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Product Labels")}>
          <LabelArrayEditor
            items={form.productLabels}
            onChange={(v: typeof form.productLabels) => set("productLabels", v)}
            fieldPrefix="productLabels"
            t={t}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label={t("Product Status Assessment")}>
          <FormField
            label={t("Assessment URL")}
            value={form.productStatusAssessment}
            onChange={(v) => set("productStatusAssessment", v)}
            fieldKey="productStatusAssessment"
            type="url"
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label={t("Certifications")}>
          <NameDescArrayEditor
            label={t("Certifications")}
            items={form.certifications}
            onChange={(v: typeof form.certifications) => set("certifications", v)}
            fieldPrefix="certifications"
            namePlaceholder={t("Certification name")}
            t={t}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Data Management Method")}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("Name")} value={form.dmmName} onChange={(v) => set("dmmName", v)} fieldKey="dmmName" />
            <FormField
              label={t("Identifier")}
              value={form.dmmIdentifier}
              onChange={(v) => set("dmmIdentifier", v)}
              fieldKey="dmmIdentifier"
            />
          </div>
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Custom Fields">
        <CustomFieldsEditor
          title={t("Compliance Custom Fields")}
          items={form.complianceCustomFields}
          onChange={(items: typeof form.complianceCustomFields) =>
            setCustomGroupFields("complianceCustomFields", items)
          }
          canUseLeaf={canUseLeaf}
          t={t}
        />
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
