"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { EventListCard } from "./CommonComponents";
import { UsageInformation } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

type UsageComponentProps = Readonly<{
  usage?: UsageInformation;
}>;

export function UsageComponent({ usage }: UsageComponentProps) {
  const { t } = useLanguage();
  return (
    <CollapsibleSection
      title={t("Usage & Maintenance")}
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer={t("Downstream Data")}>
        <DataPointComponent label={t("Maintenance Log")} isEmpty={(usage?.maintenanceLog?.length || 0) === 0}>
            <EventListCard list={usage?.maintenanceLog || []} label=""/>
        </DataPointComponent>

        <DataPointComponent label={t("Usage History")} isEmpty={(usage?.usageHistory?.length || 0) === 0}>
            <EventListCard list={usage?.usageHistory || []} label=""/>
        </DataPointComponent>

        <DataPointComponent label={t("Incidents & Errors")} isEmpty={(usage?.incidentsAndErrors?.length || 0) === 0}>
            <EventListCard list={usage?.incidentsAndErrors || []} label=""/>
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
