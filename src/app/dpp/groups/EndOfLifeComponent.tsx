"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { EventListCard, ValueTree } from "./CommonComponents";
import { EndOfLifeData } from "@/types";

type EndOfLifeComponentProps = Readonly<{
  endOfLife?: EndOfLifeData;
}>;

export function EndOfLifeComponent({ endOfLife }: EndOfLifeComponentProps) {
  return (
    <CollapsibleSection
      title="End of Life"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer={t("datalayer.regulatory")}>
        <DataPointComponent label="Recycling and Reuse Potential" isEmpty={!endOfLife?.recyclingReusePotential}>
          <ValueTree label="" value={endOfLife?.recyclingReusePotential} />
        </DataPointComponent>

        <DataPointComponent label="Disposal Options" isEmpty={!endOfLife?.disposalOptions}>
          <ValueTree label="" value={endOfLife?.disposalOptions} />
        </DataPointComponent>

        <DataPointComponent label="Unsold Products Information" isEmpty={!endOfLife?.unsoldProductsInformation}>
          <ValueTree label="" value={endOfLife?.unsoldProductsInformation} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.sectoral")}>
        <DataPointComponent label="Expected Waste" isEmpty={!endOfLife?.expectedWaste}>
          <ValueTree label="" value={endOfLife?.expectedWaste} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.commercial")}>
        <DataPointComponent label="Reusability and Repurposability" isEmpty={!endOfLife?.reusability}>
          <ValueTree label="" value={endOfLife?.reusability} />
        </DataPointComponent>

        <DataPointComponent label="Repairability and Maintainability" isEmpty={!endOfLife?.repairability}>
          <ValueTree label="" value={endOfLife?.repairability} />
        </DataPointComponent>

        <DataPointComponent label="Refurbishability and Remanufacturability" isEmpty={!endOfLife?.refurbishability}>
          <ValueTree label="" value={endOfLife?.refurbishability} />
        </DataPointComponent>

        <DataPointComponent label="Upgrade Options" isEmpty={!endOfLife?.upgradeOptions}>
          <ValueTree label="" value={endOfLife?.upgradeOptions} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Downstream Data">
        <DataPointComponent label="End-of-Life History" isEmpty={(endOfLife?.endOfLifeHistory?.length || 0) === 0}>
            <EventListCard list={endOfLife?.endOfLifeHistory || []} label=""/>
        </DataPointComponent>

        <DataPointComponent label="Number of Lifecycles" isEmpty={endOfLife?.numberOfLifecycles === undefined || endOfLife?.numberOfLifecycles === null}>
          <ValueTree label="" value={endOfLife?.numberOfLifecycles} />
        </DataPointComponent>

        <DataPointComponent
          label="End-of-Life Information"
          isEmpty={!endOfLife?.endOfLifeInformation}
        >
          <ValueTree label="Waste Prevention" value={endOfLife?.endOfLifeInformation?.wastePrevention} />
          <ValueTree label="Separate Collection" value={endOfLife?.endOfLifeInformation?.separateCollection} />
          <ValueTree label="Collection Information" value={endOfLife?.endOfLifeInformation?.collectionInformation} />
          <ValueTree label="End-of-Life Report" value={endOfLife?.endOfLifeInformation?.endOfLifeReport} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
