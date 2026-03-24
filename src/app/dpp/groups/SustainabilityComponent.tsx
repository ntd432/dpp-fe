import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "../[dppId]/page";
import { SustainabilityInformation } from "@/types";

type SustainabilityComponentProps = Readonly<{
  sustainability?: SustainabilityInformation;
}>;

export function SustainabilityComponent({ sustainability }: SustainabilityComponentProps) {
  return (
    <CollapsibleSection
      title="Sustainability"
      color="emerald"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Sustainability Performance">
          <ValueTree
            label="Environmental Footprint"
            value={sustainability?.sustainabilityPerformance?.environmentalFootprint}
          />
          <ValueTree
            label="Resource Consumption"
            value={sustainability?.sustainabilityPerformance?.resourceConsumption}
          />
          <ValueTree
            label="Plastics Release"
            value={sustainability?.sustainabilityPerformance?.plasticsRelease}
          />
        </DataPointComponent>

        <DataPointComponent label="Life Cycle Assessment">
          <ValueTree
            label="Life Cycle Assessment Report"
            value={sustainability?.lifeCycleAssessment?.lifeCycleAssessmentReport}
          />
          <ValueTree
            label="Environmental Impact"
            value={sustainability?.lifeCycleAssessment?.environmentalImpact}
          />
        </DataPointComponent>

        <DataPointComponent label="Environment Declaration">
          <ValueTree label="Environment Declaration" value={sustainability?.environmentDeclaration} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label="Materials and Circularity">
          <ValueTree label="Critical Raw Material" value={sustainability?.criticalRawMaterial} />
          <ValueTree
            label="Renewable and Non-Renewable Content"
            value={sustainability?.renewableNonRenewableContent}
          />
          <ValueTree label="Decomposability" value={sustainability?.decomposability} />
          <ValueTree
            label="Circular Economy Indicator"
            value={sustainability?.circularEconomyIndicator}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Social and Usage Attributes">
          <ValueTree label="Labour Conditions" value={sustainability?.socialIndicator?.labourConditions} />
          <ValueTree
            label="Resource Consumption When Using"
            value={sustainability?.sustainabilityAttributes?.resourceConsumptionWhenUsing}
          />
          <ValueTree
            label="Resource Consumption When Recovering"
            value={sustainability?.sustainabilityAttributes?.resourceConsumptionWhenRecovering}
          />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
