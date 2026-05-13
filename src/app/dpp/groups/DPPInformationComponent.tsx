"use client";

import { CollapsibleSection } from "@/components/form/CollapsibleSection";
import { ValueTree } from "./CommonComponents";
import { DPP } from "@/types";
import { InfoCardWithLink } from "@/components/InfoCard";
import { useLanguage } from "@/contexts/LanguageContext";

function formatString(key: string): string {
  if (!key) return "N/A";
  return key
    .replaceAll(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function DPPInformation(dppInfo: Readonly<DPP>) {
  const { t } = useLanguage();
  const corePairs = [
    { label: t("Registration number"), value: dppInfo.dppRegistrationNumber },
    {
      label: t("DPP Granularity"),
      value: formatString(dppInfo.granularity as string),
    },
    { label: t("Batch Number"), value: dppInfo.productBatchNumber },
    { label: t("Serial Number"), value: dppInfo.productSerialNumber },
    { label: t("Data Carrier Format"), value: dppInfo.dataCarrierFormat },
  ];

  return (
    <CollapsibleSection title={t("Digital Product Passport Information")} defaultOpen>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {corePairs.map((pair) => (
          <ValueTree key={pair.label} label={pair.label} value={pair.value} />
        ))}
        <InfoCardWithLink
          label={t("DPP Issuer")}
          value={dppInfo.issuer?.name || "N/A"}
          link={dppInfo.issuer?.url}
        />
      </div>
    </CollapsibleSection>
  );
}
