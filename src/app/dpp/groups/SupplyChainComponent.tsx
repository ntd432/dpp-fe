import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { EventListCard, ParticipantListCard, ValueTree } from "./CommonComponents";
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
        <DataPointComponent
          label="Product Traceability"
          isEmpty={(supplyChain?.productTraceability?.traceabilityEvent?.length || 0) === 0}
        >
          <EventListCard list={supplyChain?.productTraceability?.traceabilityEvent || []} label="" />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Recycling Partner" isEmpty={ !supplyChain?.recyclingPartner }>
            <ParticipantListCard list={supplyChain?.recyclingPartner || []} label="" />
        </DataPointComponent>

        <DataPointComponent label="Customer Return Channel" isEmpty={ !supplyChain?.customerReturnChannel }>
            <ParticipantListCard list={supplyChain?.customerReturnChannel || []} label="" />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
