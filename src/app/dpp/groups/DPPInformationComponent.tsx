import { CollapsibleSection } from "@/components/form/CollapsibleSection";
import { ValueTree } from "./CommonComponents";
import { DPP } from "@/types";
import { InfoCardWithLink } from "@/components/InfoCard";

function formatString(key: string): string {
  return key
    .replaceAll(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function DPPInformation(dppInfo: Readonly<DPP>) {
  const corePairs = [
    { label: "Registration number", value: dppInfo.dppRegistrationNumber },
    {
      label: "Granularity",
      value: formatString(dppInfo.granularity as string),
    },
    { label: "Product batch number", value: dppInfo.productBatchNumber },
    { label: "Product serial number", value: dppInfo.productSerialNumber },
    { label: "Data carrier format", value: dppInfo.dataCarrierFormat },
  ];

  return (
    <CollapsibleSection title="DPP Information" defaultOpen>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {corePairs.map((pair) => (
          <ValueTree key={pair.label} label={pair.label} value={pair.value} />
        ))}
        <InfoCardWithLink
          label="Issuer"
          value={dppInfo.issuer?.name || "N/A"}
          link={dppInfo.issuer?.url}
        />
      </div>
    </CollapsibleSection>
  );
}
