import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "./CommonComponents";
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
        <DataPointComponent label="Disposal and Recovery">
          <ValueTree label="Recycling and Reuse Potential" value={endOfLife?.recyclingReusePotential} />
          <ValueTree label="Disposal Options" value={endOfLife?.disposalOptions} />
          <ValueTree label="Expected Waste" value={endOfLife?.expectedWaste} />
          <ValueTree label="Unsold Products Information" value={endOfLife?.unsoldProductsInformation} />
        </DataPointComponent>

        <DataPointComponent label="Circularity Properties">
          <ValueTree label="Reusability" value={endOfLife?.reusability} />
          <ValueTree label="Repairability" value={endOfLife?.repairability} />
          <ValueTree label="Refurbishability" value={endOfLife?.refurbishability} />
          <ValueTree label="Upgrade Options" value={endOfLife?.upgradeOptions} />
          <ValueTree label="Number of Lifecycles" value={endOfLife?.numberOfLifecycles} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label="End-of-Life Information">
          <ValueTree label="Waste Prevention" value={endOfLife?.endOfLifeInformation?.wastePrevention} />
          <ValueTree label="Separate Collection" value={endOfLife?.endOfLifeInformation?.separateCollection} />
          <ValueTree label="Collection Information" value={endOfLife?.endOfLifeInformation?.collectionInformation} />
          <ValueTree label="End-of-Life Report" value={endOfLife?.endOfLifeInformation?.endOfLifeReport} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Downstream Data">
        <DataPointComponent label="End-of-Life History">
          <ValueTree label="End-of-Life History" value={endOfLife?.endOfLifeHistory} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
