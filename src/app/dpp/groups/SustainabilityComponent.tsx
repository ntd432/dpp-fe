"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ComponentListCard, KeyValuePair, ListCards, ValueTree } from "./CommonComponents";
import { EnvironmentalFootprint, EnvironmentalImpact, ResourceConsumption, SustainabilityInformation } from "@/types";
import InfoCard, { InfoCardWithLink } from "@/components/InfoCard";
import { useLanguage } from "@/contexts/LanguageContext";

function EnvironmentalFootprintListCard({ list }: Readonly<{
  list: Readonly<ReadonlyArray<EnvironmentalFootprint>>;
}>) {
  const { t } = useLanguage();
  return (
    <ListCards
      list={list}
      label={t("Environmental Footprint")}
      getKey={(footprint, index) =>
        `footprint-${footprint.environmentalFootprintType || index}`
      }
      renderCard={(footprint) => EnvironmentalFootprintCard(t, footprint)}
    />
  );
}

function EnvironmentalFootprintCard(
  t: (key: string) => string,
  footprint: Readonly<EnvironmentalFootprint>,
) {
  const pairs = [
    { label: t("Footprint type"), value: footprint.environmentalFootprintType },
    {
      label: t("Value"),
      value: `${footprint.environmentalFootprintValue} ${footprint.environmentalFootprintUnit}`,
    },
    {
      label: t("Measuring method"),
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
  const { t } = useLanguage();
  return (
    <ListCards
      list={list}
      label={label || t("Resource Consumption")}
      getKey={(consumption, index) =>
        `consumption-${consumption.resource || index}`
      }
      renderCard={(consumption) => ResourceConsumptionCard(t, consumption)}
    />
  );
}

function ResourceConsumptionCard(
  t: (key: string) => string,
  consumption: Readonly<ResourceConsumption>,
) {
  const pairs = [
    { label: t("Resource"), value: consumption.resource },
    {
      label: t("Value"),
      value: `${consumption.resourceConsumptionValue} ${consumption.resourceConsumptionUnit}`,
    },
  ];
  return <KeyValuePair numberOfColumn={3} pairs={pairs} />;
}

function EnvironmentalImpactListCard({
  list,
}: Readonly<{
  list: Readonly<ReadonlyArray<EnvironmentalImpact>>;
}>) {
  const { t } = useLanguage();
  return (
    <ListCards
      list={list}
      label={t("Environmental Impact")}
      getKey={(impact, index) =>
        `impact-${impact.impactCategory || index}-${impact.method || ""}`
      }
      renderCard={(impact) => EnvironmentalImpactCard(t, impact)}
    />
  );
}

function EnvironmentalImpactCard(
  t: (key: string) => string,
  impact: Readonly<EnvironmentalImpact>,
) {
  const pairs = [
    { label: t("Impact category"), value: impact.impactCategory },
    { label: t("Method"), value: impact.method },
    { label: t("Characterization Factor"), value: impact.characterizationFactor },
    { label: t("Characterization Model"), value: impact.characterizationModel },
    {
      label: t("Impact indicator"),
      value: `${impact.impactIndicator.measurementValue} ${impact.impactIndicator.measurementUnit}`,
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
  const { t } = useLanguage();
  const socialIndicator = sustainability?.socialIndicator;
  const socialIndicatorPairs = [
    { label: t("Labour Conditions"), value: socialIndicator?.labourConditions },
  ];
  return (
    <CollapsibleSection
      title={t("Sustainability")}
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer={t("datalayer.regulatory")}>
        <DataPointComponent
          label={t("Sustainability Performance")}
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
            label={t("Plastics Release")}
            value={sustainability?.sustainabilityPerformance?.plasticsRelease}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.sectoral")}>
        <DataPointComponent label={t("Decomposability")} isEmpty={!sustainability?.decomposability}>
          <ValueTree label="" value={sustainability?.decomposability} />
        </DataPointComponent>

        <DataPointComponent label={t("Critical Raw Materials")} isEmpty={(sustainability?.criticalRawMaterial?.length || 0) === 0}>
          <ComponentListCard
            label=""
            componentList={sustainability?.criticalRawMaterial || []}
          />
        </DataPointComponent>

        <DataPointComponent
          label={t("Life Cycle Assessment")}
          isEmpty={!sustainability?.lifeCycleAssessment}
        >
            <InfoCard label={t("LCA Report URL")} value={sustainability?.lifeCycleAssessment?.lifeCycleAssessmentReport || "N/A"} />
          <EnvironmentalImpactListCard
            list={
              sustainability?.lifeCycleAssessment?.environmentalImpact || []
            }
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.commercial")}>
        <DataPointComponent label={t("Renewable / Non-Renewable Content")} isEmpty={(sustainability?.renewableNonRenewableContent?.length || 0) === 0}>
          <ComponentListCard
            label=""
            componentList={sustainability?.renewableNonRenewableContent || []}
          />
        </DataPointComponent>

        <DataPointComponent label={t("Social Indicator")} isEmpty={!socialIndicator}>
          <KeyValuePair numberOfColumn={1} pairs={socialIndicatorPairs} />
        </DataPointComponent>

        <DataPointComponent
          label={t("Sustainability Attributes")}
          isEmpty={!sustainability?.sustainabilityAttributes}
        >
          <ResourceConsumptionListCard
            label={t("Resource Consumption When Using")}
            list={
              sustainability?.sustainabilityAttributes
                ?.resourceConsumptionWhenUsing || []
            }
          />
          <ResourceConsumptionListCard
            label={t("Resource Consumption When Recovering")}
            list={
              sustainability?.sustainabilityAttributes
                ?.resourceConsumptionWhenRecovering || []
            }
          />
        </DataPointComponent>

        <DataPointComponent label={t("Environment Declaration")} isEmpty={!sustainability?.environmentDeclaration}>
          <InfoCardWithLink
            label=""
            value={t("Environment Declaration")}
            link={sustainability?.environmentDeclaration}
          />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
