import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "../[dppId]/page";
import { SupplyChain } from "@/types";

type SupplyChainComponentProps = Readonly<{
  supplyChain?: SupplyChain;
}>;

export function SupplyChainComponent({ supplyChain }: SupplyChainComponentProps) {
  return (
    <CollapsibleSection
      title="Supply Chain"
      color="amber"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Product Traceability">
          <ValueTree
            label="Traceability Event"
            value={supplyChain?.productTraceability?.traceabilityEvent}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Partners">
          <ValueTree label="Recycling Partner" value={supplyChain?.recyclingPartner} />
          <ValueTree label="Customer Return Channel" value={supplyChain?.customerReturnChannel} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
