import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { EventListCard } from "./CommonComponents";
import { UsageInformation } from "@/types";

type UsageComponentProps = Readonly<{
  usage?: UsageInformation;
}>;

export function UsageComponent({ usage }: UsageComponentProps) {
  return (
    <CollapsibleSection
      title="Usage"
      color="cyan"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Downstream Data">
        <DataPointComponent label="Maintenance Log">
            <EventListCard list={usage?.maintenanceLog || []} label=""/>
        </DataPointComponent>

        <DataPointComponent label="Usage History">
            <EventListCard list={usage?.usageHistory || []} label=""/>
        </DataPointComponent>

        <DataPointComponent label="Incidents and Errors">
            <EventListCard list={usage?.incidentsAndErrors || []} label=""/>
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
