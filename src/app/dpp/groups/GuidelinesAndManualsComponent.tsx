import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "../[dppId]/page";
import { GuidelinesAndManuals } from "@/types";

type GuidelinesAndManualsComponentProps = Readonly<{
  guidelines?: GuidelinesAndManuals;
}>;

export function GuidelinesAndManualsComponent({ guidelines }: GuidelinesAndManualsComponentProps) {
  return (
    <CollapsibleSection
      title="Guidelines and Manuals"
      color="blue"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Technical Guides">
          <ValueTree label="Assembly Guideline" value={guidelines?.assemblyGuideline} />
          <ValueTree
            label="Non-Destructive Disassembly Guideline"
            value={guidelines?.nonDestructiveDisassemblyGuideline}
          />
          <ValueTree label="Product Manual" value={guidelines?.productManual} />
          <ValueTree
            label="Storage and Transport Guideline"
            value={guidelines?.storageAndTransportGuideline?.storageAndTransportGuideline}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Commercial Instructions">
          <ValueTree
            label="Safety Instruction"
            value={guidelines?.commercialInstruction?.safetyInstruction}
          />
          <ValueTree
            label="Maintenance Instruction"
            value={guidelines?.commercialInstruction?.maintenanceInstruction}
          />
          <ValueTree
            label="Waste Sorting Instruction"
            value={guidelines?.commercialInstruction?.wasteSortingInstruction}
          />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Downstream Data">
        <DataPointComponent label="Accessibility and Utilization">
          <ValueTree label="Accessibility" value={guidelines?.accessibility} />
          <ValueTree label="Utilization Characteristic" value={guidelines?.utilizationCharacteristic} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
