"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "./CommonComponents";
import { Guide, GuidelinesAndManuals } from "@/types";
import InfoCard, { InfoCardWithLink } from "@/components/InfoCard";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  return (
    <CollapsibleSection
      title={t("Guidelines & Manuals")}
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer={t("datalayer.regulatory")}>
        <DataPointComponent
          label={t("Assembly Guideline")}
          isEmpty={!guidelines?.assemblyGuideline}
        >
            <GuideCard label="" guide={guidelines?.assemblyGuideline || {}} />
        </DataPointComponent>
        <DataPointComponent
          label={t("Non-Destructive Disassembly Guideline")}
          isEmpty={!guidelines?.nonDestructiveDisassemblyGuideline}
        >
            <GuideCard label="" guide={guidelines?.nonDestructiveDisassemblyGuideline || {}} />
        </DataPointComponent>
        <DataPointComponent
          label={t("Product Manual")}
          isEmpty={!guidelines?.productManual}
        >
          <GuideCard label="" guide={guidelines?.productManual || {}} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.sectoral")}>
        <DataPointComponent
          label={t("Storage & Transport Guideline")}
          isEmpty={!guidelines?.storageAndTransportGuideline}
        >
          <InfoCardWithLink value={guidelines?.storageAndTransportGuideline?.name || guidelines?.storageAndTransportGuideline?.url || "N/A"} link={guidelines?.storageAndTransportGuideline?.url} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.commercial")}>
        <DataPointComponent
          label={t("Commercial Instructions")}
          isEmpty={!guidelines?.commercialInstruction}
        >
            <GuideCard label={t("Safety Instruction")} guide={guidelines?.commercialInstruction?.safetyInstruction || {}} />
            <GuideCard label={t("Maintenance Instruction")} guide={guidelines?.commercialInstruction?.maintenanceInstruction || {}} />
            <GuideCard label={t("Waste Sorting Instruction")} guide={guidelines?.commercialInstruction?.wasteSortingInstruction || {}} />
        </DataPointComponent>
        <DataPointComponent
          label={t("Accessibility")}
          isEmpty={!guidelines?.accessibility}
        >
          <ValueTree label="" value={guidelines?.accessibility} />
        </DataPointComponent>
        <DataPointComponent
          label={t("Utilization Characteristic")}
          isEmpty={!guidelines?.utilizationCharacteristic}
        >
          <ValueTree label="" value={guidelines?.utilizationCharacteristic} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
