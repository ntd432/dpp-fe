import { CollapsibleSection } from "@/components/form/CollapsibleSection";
import { ValueTree } from "../[dppId]/page";
import { DPP } from "@/types";
import { InfoCardWithLink } from "@/components/InfoCard";

function formatString(key: string): string {
  return key
    .replaceAll(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function DPPInformation( dppInfo: DPP ) {
  const corePairs = [
    { label: "registrationNumber", value: dppInfo.dppRegistrationNumber },
    { label: "granularity", value: formatString(dppInfo.granularity as string) },
    { label: "productBatchNumber", value: dppInfo.productBatchNumber },
    { label: "productSerialNumber", value: dppInfo.productSerialNumber },
    { label: "dataCarrierFormat", value: dppInfo.dataCarrierFormat },
  ];

  return (
    <CollapsibleSection title="DPP Core Information" color="indigo" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {corePairs.map((pair) => (
            <ValueTree key={pair.label} label={pair.label} value={pair.value} />
        ))}
        <InfoCardWithLink label="issuer" value={dppInfo.issuer?.name || "N/A"} link={dppInfo.issuer?.url} />
        </div>
        
      </CollapsibleSection>
  );
}
