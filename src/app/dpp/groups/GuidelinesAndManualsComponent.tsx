"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "./CommonComponents";
import { Guide, GuidelinesAndManuals } from "@/types";
import InfoCard, { InfoCardWithLink } from "@/components/InfoCard";

type GuidelinesAndManualsComponentProps = Readonly<{
  guidelines?: GuidelinesAndManuals;
}>;

function GuideCard({label, guide}: Readonly<{label: string, guide: Readonly<Guide>}>) {
  return (
    (guide.url ? 
    <InfoCardWithLink label={label} value={guide.name || guide.url} link={guide.url} /> 
    : <InfoCard label={label} value={guide.name || "N/A"} />)
  );
}

export function GuidelinesAndManualsComponent({ guidelines }: GuidelinesAndManualsComponentProps) {
  return (
    <CollapsibleSection
      title="Guidelines and Manuals"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent
          label="Assembly Guideline"
          isEmpty={!guidelines?.assemblyGuideline}
        >
            <GuideCard label="" guide={guidelines?.assemblyGuideline || {}} />
        </DataPointComponent>
        <DataPointComponent
          label="Non-Destructive Disassembly Guideline"
          isEmpty={!guidelines?.nonDestructiveDisassemblyGuideline}
        >
            <GuideCard label="" guide={guidelines?.nonDestructiveDisassemblyGuideline || {}} />
        </DataPointComponent>
        <DataPointComponent
          label="Product Manual"
          isEmpty={!guidelines?.productManual}
        >
          <GuideCard label="" guide={guidelines?.productManual || {}} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent
          label="Storage & Transport Guideline"
          isEmpty={!guidelines?.storageAndTransportGuideline}
        >
          <InfoCardWithLink value={guidelines?.storageAndTransportGuideline?.name || guidelines?.storageAndTransportGuideline?.url || "N/A"} link={guidelines?.storageAndTransportGuideline?.url} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent
          label="Commercial Instructions"
          isEmpty={!guidelines?.commercialInstruction}
        >
            <GuideCard label="Safety Instruction" guide={guidelines?.commercialInstruction?.safetyInstruction || {}} />
            <GuideCard label="Maintenance Instruction" guide={guidelines?.commercialInstruction?.maintenanceInstruction || {}} />
            <GuideCard label="Waste Sorting Instruction" guide={guidelines?.commercialInstruction?.wasteSortingInstruction || {}} />
        </DataPointComponent>
        <DataPointComponent
          label="Accessibility"
          isEmpty={!guidelines?.accessibility}
        >
          <ValueTree label="" value={guidelines?.accessibility} />
        </DataPointComponent>
        <DataPointComponent
          label="Utilization Characteristic"
          isEmpty={!guidelines?.utilizationCharacteristic}
        >
          <ValueTree label="" value={guidelines?.utilizationCharacteristic} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
