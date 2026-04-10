import React from "react";
import { FormField, TextAreaField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";

export function SustainabilityStep({ shared }: Readonly<{ shared: any }>) {
  const {
    t,
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
    <CollapsibleSection title={t("Sustainability")} defaultOpen>
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label={t("Sustainability Performance")}>
          <EnvironmentalFootprintArrayEditor
            items={form.environmentalFootprints}
            onChange={(v: any[]) => set("environmentalFootprints", v)}
            fieldPrefix="environmentalFootprints"
            t={t}
          />
          <ResourceConsumptionArrayEditor
            label={t("Resource Consumption")}
            items={form.resourceConsumptions}
            onChange={(v: any[]) => set("resourceConsumptions", v)}
            fieldPrefix="resourceConsumptions"
            t={t}
          />
          <TextAreaField
            label={t("Plastics Release")}
            value={form.plasticsRelease}
            onChange={(v: string) => set("plasticsRelease", v)}
            fieldKey="plasticsRelease"
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label={t("Decomposability")}>
          <TextAreaField
            label={t("Decomposability")}
            value={form.decomposability}
            onChange={(v) => set("decomposability", v)}
            fieldKey="decomposability"
          />
        </DataPointComponent>

        <DataPointComponent label={t("Sector Sustainability Indicators")}>
          <TextAreaField
            label={t("Sector indicators")}
            value={form.sectorSustainabilityIndicatorsText}
            onChange={(v) => set("sectorSustainabilityIndicatorsText", v)}
            fieldKey="sectorSustainabilityIndicatorsText"
          />
        </DataPointComponent>

        <DataPointComponent label={t("Critical Raw Materials")}>
          <ComponentArrayEditor
            label={t("Critical Raw Components")}
            items={form.criticalRawMaterials}
            onChange={(v: any[]) => set("criticalRawMaterials", v)}
            fieldPrefix="criticalRawMaterials"
            t={t}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Life Cycle Assessment")}>
          <FormField
            label={t("LCA Report URL")}
            value={form.lifeCycleAssessmentReport}
            onChange={(v) => set("lifeCycleAssessmentReport", v)}
            fieldKey="lifeCycleAssessmentReport"
            type="url"
          />
          <EnvironmentalImpactArrayEditor
            items={form.environmentalImpacts}
            onChange={(v: any[]) => set("environmentalImpacts", v)}
            fieldPrefix="environmentalImpacts"
            t={t}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label={t("Renewable / Non-Renewable Content")}>
          <ComponentArrayEditor
            label={t("Components")}
            items={form.renewableNonRenewableContent}
            onChange={(v: any[]) => set("renewableNonRenewableContent", v)}
            fieldPrefix="renewableNonRenewableContent"
            t={t}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Circular Economy Indicator")}>
          <TextAreaField
            label={t("Circular economy indicator")}
            value={form.circularEconomyIndicatorText}
            onChange={(v: string) => set("circularEconomyIndicatorText", v)}
            fieldKey="circularEconomyIndicatorText"
          />
        </DataPointComponent>

        <DataPointComponent label={t("Social Indicator")}>
          <TextAreaField
            label={t("Labour Conditions")}
            value={form.labourConditions}
            onChange={(v: string) => set("labourConditions", v)}
            fieldKey="labourConditions"
          />
        </DataPointComponent>

        <DataPointComponent label={t("Sustainability Attributes")}>
          <div className="space-y-4">
            <ResourceConsumptionArrayEditor
              label={t("Resource Consumption When Using")}
              items={form.usingResourceConsumptions}
              onChange={(v: any[]) => set("usingResourceConsumptions", v)}
              fieldPrefix="usingResourceConsumptions"
              t={t}
            />
            <ResourceConsumptionArrayEditor
              label={t("Resource Consumption When Recovering")}
              items={form.recoveringResourceConsumptions}
              onChange={(v: any[]) => set("recoveringResourceConsumptions", v)}
              fieldPrefix="recoveringResourceConsumptions"
              t={t}
            />
          </div>
        </DataPointComponent>

        <DataPointComponent label={t("Environment Declaration")}>
          <FormField
            label={t("Declaration URL")}
            value={form.environmentDeclaration}
            onChange={(v: string) => set("environmentDeclaration", v)}
            fieldKey="environmentDeclaration"
            type="url"
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Custom Fields">
        <CustomFieldsEditor
          title={t("Sustainability Custom Fields")}
          items={form.sustainabilityCustomFields}
          onChange={(items: any[]) => setCustomGroupFields("sustainabilityCustomFields", items)}
          canUseLeaf={canUseLeaf}
          t={t}
        />
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
