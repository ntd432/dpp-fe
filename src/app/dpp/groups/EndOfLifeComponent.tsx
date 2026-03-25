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
      color="amber"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Recycling and Reuse Potential">
          <ValueTree label="" value={endOfLife?.recyclingReusePotential} />
        </DataPointComponent>

        <DataPointComponent label="Disposal Options">
          <ValueTree label="" value={endOfLife?.disposalOptions} />
        </DataPointComponent>

        <DataPointComponent label="Unsold Products Information">
          <ValueTree label="" value={endOfLife?.unsoldProductsInformation} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label="Expected Waste">
          <ValueTree label="" value={endOfLife?.expectedWaste} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Reusability/Repurposability">
          <ValueTree label="" value={endOfLife?.reusability} />
        </DataPointComponent>

        <DataPointComponent label="Repairability/Maintainability">
          <ValueTree label="" value={endOfLife?.repairability} />
        </DataPointComponent>

        <DataPointComponent label="Refurbishability/Remanufacturability">
          <ValueTree label="" value={endOfLife?.refurbishability} />
        </DataPointComponent>

        <DataPointComponent label="Upgrade Options">
          <ValueTree label="" value={endOfLife?.upgradeOptions} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Downstream Data">
        <DataPointComponent label="End-of-Life History">
            <EventListCard list={endOfLife?.endOfLifeHistory || []} label=""/>
        </DataPointComponent>

        <DataPointComponent label="Number of Lifecycles">
          <ValueTree label="" value={endOfLife?.numberOfLifecycles} />
        </DataPointComponent>

        <DataPointComponent label="End-of-Life Information">
          <ValueTree label="Waste Prevention" value={endOfLife?.endOfLifeInformation?.wastePrevention} />
          <ValueTree label="Separate Collection" value={endOfLife?.endOfLifeInformation?.separateCollection} />
          <ValueTree label="Collection Information" value={endOfLife?.endOfLifeInformation?.collectionInformation} />
          <ValueTree label="End-of-Life Report" value={endOfLife?.endOfLifeInformation?.endOfLifeReport} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
