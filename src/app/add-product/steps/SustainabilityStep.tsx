import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

export function SustainabilityStep({ shared }: { shared: any }) {
  const {
    form,
    set,
    canUseLeaf,
    setCustomGroupFields,
    ComponentArrayEditor,
    EnvironmentalFootprintArrayEditor,
    ResourceConsumptionArrayEditor,
    EnvironmentalImpactArrayEditor,
    CustomFieldsEditor,
  } = shared;

  return (
    <CollapsibleSection title="Sustainability" defaultOpen>
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Sustainability Performance">
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
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label="Decomposability">
          <TextAreaField
            label="Decomposability"
            value={form.decomposability}
            onChange={(v) => set("decomposability", v)}
          />
        </DataPointComponent>

        <DataPointComponent label="Sector Sustainability Indicators">
          <TextAreaField
            label="Sector indicators"
            value={form.sectorSustainabilityIndicatorsText}
            onChange={(v) => set("sectorSustainabilityIndicatorsText", v)}
          />
        </DataPointComponent>

        <DataPointComponent label="Critical Raw Materials">
          <ComponentArrayEditor
            label="Critical Raw Components"
            items={form.criticalRawMaterials}
            onChange={(v: any[]) => set("criticalRawMaterials", v)}
          />
        </DataPointComponent>

        <DataPointComponent label="Life Cycle Assessment">
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
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Renewable / Non-Renewable Content">
          <ComponentArrayEditor
            label="Components"
            items={form.renewableNonRenewableContent}
            onChange={(v: any[]) => set("renewableNonRenewableContent", v)}
          />
        </DataPointComponent>

        <DataPointComponent label="Circular Economy Indicator">
          <TextAreaField
            label="Circular economy indicator"
            value={form.circularEconomyIndicatorText}
            onChange={(v: string) => set("circularEconomyIndicatorText", v)}
          />
        </DataPointComponent>

        <DataPointComponent label="Social Indicator">
          <TextAreaField
            label="Labour Conditions"
            value={form.labourConditions}
            onChange={(v: string) => set("labourConditions", v)}
          />
        </DataPointComponent>

        <DataPointComponent label="Sustainability Attributes">
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
        </DataPointComponent>

        <DataPointComponent label="Environment Declaration">
          <FormField
            label="Declaration URL"
            value={form.environmentDeclaration}
            onChange={(v: string) => set("environmentDeclaration", v)}
            type="url"
          />
        </DataPointComponent>
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
