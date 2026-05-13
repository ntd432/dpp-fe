"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { EventListCard, ParticipantListCard } from "./CommonComponents";
import { SupplyChain } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

type SupplyChainComponentProps = Readonly<{
  supplyChain?: SupplyChain;
}>;

export function SupplyChainComponent({ supplyChain }: SupplyChainComponentProps) {
  const { t } = useLanguage();
  return (
    <CollapsibleSection
      title={t("Product Supply Chain Information")}
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer={t("datalayer.regulatory")}>
        <DataPointComponent
          label={t("Product Traceability")}
          isEmpty={(supplyChain?.productTraceability?.traceabilityEvent?.length || 0) === 0}
        >
          <EventListCard list={supplyChain?.productTraceability?.traceabilityEvent || []} label="" />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.commercial")}>
        <DataPointComponent label={t("Recycling Partner")} isEmpty={ !supplyChain?.recyclingPartner }>
            <ParticipantListCard list={supplyChain?.recyclingPartner || []} label="" />
        </DataPointComponent>

        <DataPointComponent label={t("Customer Return Channel")} isEmpty={ !supplyChain?.customerReturnChannel }>
            <ParticipantListCard list={supplyChain?.customerReturnChannel || []} label="" />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
