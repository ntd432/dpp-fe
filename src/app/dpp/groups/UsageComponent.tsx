import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "../[dppId]/page";
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
          <ValueTree label="Maintenance Log" value={usage?.maintenanceLog} />
        </DataPointComponent>

        <DataPointComponent label="Usage History">
          <ValueTree label="Usage History" value={usage?.usageHistory} />
        </DataPointComponent>

        <DataPointComponent label="Incidents and Errors">
          <ValueTree label="Incidents and Errors" value={usage?.incidentsAndErrors} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
