"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { EventListCard, ValueTree } from "./CommonComponents";
import { EndOfLifeData } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

type EndOfLifeComponentProps = Readonly<{
  endOfLife?: EndOfLifeData;
}>;

export function EndOfLifeComponent({ endOfLife }: EndOfLifeComponentProps) {
  const { t } = useLanguage();
  return (
    <CollapsibleSection
      title={t("End of Life")}
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer={t("datalayer.regulatory")}>
        <DataPointComponent label={t("Recycling and Reuse Potential")} isEmpty={!endOfLife?.recyclingReusePotential}>
          <ValueTree label="" value={endOfLife?.recyclingReusePotential} />
        </DataPointComponent>

        <DataPointComponent label={t("Disposal Options")} isEmpty={!endOfLife?.disposalOptions}>
          <ValueTree label="" value={endOfLife?.disposalOptions} />
        </DataPointComponent>

        <DataPointComponent label={t("Unsold Products Information")} isEmpty={!endOfLife?.unsoldProductsInformation}>
          <ValueTree label="" value={endOfLife?.unsoldProductsInformation} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.sectoral")}>
        <DataPointComponent label={t("Expected Waste")} isEmpty={!endOfLife?.expectedWaste}>
          <ValueTree label="" value={endOfLife?.expectedWaste} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.commercial")}>
        <DataPointComponent label={t("Reusability and Repurposability")} isEmpty={!endOfLife?.reusability}>
          <ValueTree label="" value={endOfLife?.reusability} />
        </DataPointComponent>

        <DataPointComponent label={t("Repairability and Maintainability")} isEmpty={!endOfLife?.repairability}>
          <ValueTree label="" value={endOfLife?.repairability} />
        </DataPointComponent>

        <DataPointComponent label={t("Refurbishability and Remanufacturability")} isEmpty={!endOfLife?.refurbishability}>
          <ValueTree label="" value={endOfLife?.refurbishability} />
        </DataPointComponent>

        <DataPointComponent label={t("Upgrade Options")} isEmpty={!endOfLife?.upgradeOptions}>
          <ValueTree label="" value={endOfLife?.upgradeOptions} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("Downstream Data")}>
        <DataPointComponent label={t("End-of-Life History")} isEmpty={(endOfLife?.endOfLifeHistory?.length || 0) === 0}>
            <EventListCard list={endOfLife?.endOfLifeHistory || []} label=""/>
        </DataPointComponent>

        <DataPointComponent label={t("Number of Lifecycles")} isEmpty={endOfLife?.numberOfLifecycles === undefined || endOfLife?.numberOfLifecycles === null}>
          <ValueTree label="" value={endOfLife?.numberOfLifecycles} />
        </DataPointComponent>

        <DataPointComponent
          label={t("End-of-Life Information")}
          isEmpty={!endOfLife?.endOfLifeInformation}
        >
          <ValueTree label={t("Waste Prevention")} value={endOfLife?.endOfLifeInformation?.wastePrevention} />
          <ValueTree label={t("Separate Collection")} value={endOfLife?.endOfLifeInformation?.separateCollection} />
          <ValueTree label={t("Collection Information")} value={endOfLife?.endOfLifeInformation?.collectionInformation} />
          <ValueTree label={t("End-of-Life Report URL")} value={endOfLife?.endOfLifeInformation?.endOfLifeReport} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
