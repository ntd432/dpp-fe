import React from "react";
import { FormField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

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
    <CollapsibleSection title="Compliance" defaultOpen>
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Regulations">
          <RegulationArrayEditor
            items={form.regulations}
            onChange={(v: typeof form.regulations) => set("regulations", v)}
          />
        </DataPointComponent>

        <DataPointComponent label="Product Labels">
          <LabelArrayEditor
            items={form.productLabels}
            onChange={(v: typeof form.productLabels) => set("productLabels", v)}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label="Product Status Assessment">
          <FormField
            label="Assessment URL"
            value={form.productStatusAssessment}
            onChange={(v) => set("productStatusAssessment", v)}
            type="url"
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Certifications">
          <NameDescArrayEditor
            label="Certifications"
            items={form.certifications}
            onChange={(v: typeof form.certifications) => set("certifications", v)}
            namePlaceholder="Certification name"
          />
        </DataPointComponent>

        <DataPointComponent label="Data Management Method">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Name" value={form.dmmName} onChange={(v) => set("dmmName", v)} />
            <FormField
              label="Identifier"
              value={form.dmmIdentifier}
              onChange={(v) => set("dmmIdentifier", v)}
            />
          </div>
        </DataPointComponent>
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
