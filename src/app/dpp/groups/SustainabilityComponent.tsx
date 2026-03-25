import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ComponentListCard, KeyValuePair, ListCards, ValueTree } from "./CommonComponents";
import { EnvironmentalFootprint, EnvironmentalImpact, ResourceConsumption, SustainabilityInformation } from "@/types";
import { InfoCardWithLink } from "@/components/InfoCard";

function EnvironmentalFootprintListCard({ list }: Readonly<{
  list: Readonly<ReadonlyArray<EnvironmentalFootprint>>;
}>) {
  return (
    <ListCards
      list={list}
      label="Environmental Footprint"
      getKey={(footprint, index) =>
        `footprint-${footprint.environmentalFootprintType || index}`
      }
      renderCard={(footprint) => EnvironmentalFootprintCard(footprint)}
    />
  );
}

function EnvironmentalFootprintCard(
  footprint: Readonly<EnvironmentalFootprint>,
) {
  const pairs = [
    { label: "Footprint type", value: footprint.environmentalFootprintType },
    {
      label: "Value",
      value: `${footprint.environmentalFootprintValue}${footprint.environmentalFootprintUnit}`,
    },
    {
      label: "Measuring method",
      value: footprint.environmentalFootprintMeasuringMethod,
    },
  ];
  return <KeyValuePair numberOfColumn={3} pairs={pairs} />;
}

function ResourceConsumptionListCard({
  label,
  list,
}: Readonly<{
  label?: string;
  list: Readonly<ReadonlyArray<ResourceConsumption>>;
}>) {
  return (
    <ListCards
      list={list}
      label={label || "Resource Consumption"}
      getKey={(consumption, index) =>
        `consumption-${consumption.resource || index}`
      }
      renderCard={(consumption) => ResourceConsumptionCard(consumption)}
    />
  );
}

function ResourceConsumptionCard(consumption: Readonly<ResourceConsumption>) {
  const pairs = [
    { label: "Resource", value: consumption.resource },
    {
      label: "Value",
      value: `${consumption.resourceConsumptionValue}${consumption.resourceConsumptionUnit}`,
    },
  ];
  return <KeyValuePair numberOfColumn={3} pairs={pairs} />;
}

function EnvironmentalImpactListCard({
  list,
}: Readonly<{
  list: Readonly<ReadonlyArray<EnvironmentalImpact>>;
}>) {
  return (
    <ListCards
      list={list}
      label="Environmental Impact"
      getKey={(impact, index) =>
        `impact-${impact.impactCategory || index}-${impact.impactIndicator ? impact.impactIndicator : ""}`
      }
      renderCard={(impact) => EnvironmentalImpactCard(impact)}
    />
  );
}

function EnvironmentalImpactCard(impact: Readonly<EnvironmentalImpact>) {
  const pairs = [
    { label: "Impact category", value: impact.impactCategory },
    { label: "Method", value: impact.method },
    { label: "Characterization Factor", value: impact.characterizationFactor },
    { label: "Characterization Model", value: impact.characterizationModel },
    {
      label: "Impact indicator",
      value: `${impact.impactIndicator.measurementValue}${impact.impactIndicator.measurementUnit}`,
    },
  ];
  return <KeyValuePair numberOfColumn={3} pairs={pairs} />;
}

type SustainabilityComponentProps = Readonly<{
  sustainability?: SustainabilityInformation;
}>;

export function SustainabilityComponent({
  sustainability,
}: SustainabilityComponentProps) {
  const socialIndicator = sustainability?.socialIndicator;
  const socialIndicatorPairs = [
    { label: "Labour Conditions", value: socialIndicator?.labourConditions },
  ];
  return (
    <CollapsibleSection
      title="Sustainability"
      color="emerald"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent
          label="Sustainability Performance"
          isEmpty={!sustainability?.sustainabilityPerformance}
        >
          <EnvironmentalFootprintListCard
            list={
              sustainability?.sustainabilityPerformance
                ?.environmentalFootprint || []
            }
          />
          <ResourceConsumptionListCard
            list={
              sustainability?.sustainabilityPerformance?.resourceConsumption ||
              []
            }
          />
          <ValueTree
            label="Plastics Release"
            value={sustainability?.sustainabilityPerformance?.plasticsRelease}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label="Decomposability" isEmpty={!sustainability?.decomposability}>
          <ValueTree label="" value={sustainability?.decomposability} />
        </DataPointComponent>

        {/* TODO: CHANGE THE EXTENSION
        <DataPointComponent label="Sector Sustainability Indicator">
            <ValueTree label="" value={sustainability?.decomposability}/>
        </DataPointComponent> */}

        <DataPointComponent label="Critical Raw Material" isEmpty={(sustainability?.criticalRawMaterial?.length || 0) === 0}>
          <ComponentListCard
            label=""
            componentList={sustainability?.criticalRawMaterial || []}
          />
        </DataPointComponent>

        <DataPointComponent
          label="Life Cycle Assessment"
          isEmpty={!sustainability?.lifeCycleAssessment}
        >
          <InfoCardWithLink
            label=""
            value="Life Cycle Assessment Report"
            link={
              sustainability?.lifeCycleAssessment?.lifeCycleAssessmentReport
            }
          />
          {/* <ValueTree label="Life Cycle Assessment Report" value={sustainability?.lifeCycleAssessment?.lifeCycleAssessmentReport}/> */}
          <EnvironmentalImpactListCard
            list={
              sustainability?.lifeCycleAssessment?.environmentalImpact || []
            }
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Renewable/Non-Renewable Content" isEmpty={(sustainability?.renewableNonRenewableContent?.length || 0) === 0}>
          <ComponentListCard
            label=""
            componentList={sustainability?.renewableNonRenewableContent || []}
          />
        </DataPointComponent>

        {/* TODO: CHANGE THE EXTENSION
        <DataPointComponent label="Circular Economy Indicator">
            <ValueTree label="" value={sustainability?.decomposability}/>
        </DataPointComponent> */}

        <DataPointComponent label="Social Indicator" isEmpty={!socialIndicator}>
          <KeyValuePair numberOfColumn={1} pairs={socialIndicatorPairs} />
        </DataPointComponent>

        <DataPointComponent
          label="Sustainability Attributes"
          isEmpty={!sustainability?.sustainabilityAttributes}
        >
          <ResourceConsumptionListCard
            label="Resource Consumption When Using"
            list={
              sustainability?.sustainabilityAttributes
                ?.resourceConsumptionWhenUsing || []
            }
          />
          <ResourceConsumptionListCard
            label="Resource Consumption When Recovering"
            list={
              sustainability?.sustainabilityAttributes
                ?.resourceConsumptionWhenRecovering || []
            }
          />
        </DataPointComponent>

        <DataPointComponent label="Environmental Declaration" isEmpty={!sustainability?.environmentDeclaration}>
          <InfoCardWithLink
            label=""
            value="Environmental Declaration"
            link={sustainability?.environmentDeclaration}
          />
          {/* <ValueTree label="" value={sustainability?.environmentDeclaration}/> */}
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
