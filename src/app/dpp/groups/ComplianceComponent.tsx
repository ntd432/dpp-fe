"use client";

import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { KeyValuePair, ListCards, ValueTree } from "./CommonComponents";
import { Certification, Compliance, Label, Legislation } from "@/types";
import InfoCard from "@/components/InfoCard";
import { useLanguage } from "@/contexts/LanguageContext";

type ComplianceComponentProps = Readonly<{
  compliance?: Compliance;
}>;

export function ProductLabelListCard({ list, label }: Readonly<{
  label: string;
  list: Readonly<ReadonlyArray<Label>>;
}>) {
  return (
    <ListCards
      list={list}
      label={label}
      getKey={(label, index) =>
        `label-${label.labelName || index}`
      }
      renderCard={(label) => LabelCard(label)}
    />
  );
}

function LabelCard(label: Readonly<Label>) {
  const { t } = useLanguage();
    const pairs = [
    { label: t("Name"), value: label.labelName },
    { label: t("Description"), value: label.labelDescription },
    { label: t("Value"), value: label.labelValue },
    { label: t("Documentation"), value: label.labelDocumentation },
    ];
    return <KeyValuePair numberOfColumn={2} pairs={pairs} />;
}

export function CertificationListCard({ list, label }: Readonly<{
  label: string;
  list: Readonly<ReadonlyArray<Certification>>;
}>) {
  return (
    <ListCards
      list={list}
      label={label}
      getKey={(certification, index) =>
        `certification-${certification.name || index}`
      }
      renderCard={(certification) => CertificationCard(certification)}
    />
  );
}

function CertificationCard(certification: Readonly<Certification>) {
  const { t } = useLanguage();
    const pairs = [
    { label: t("Name"), value: certification.name },
    { label: t("Description"), value: certification.description },
    ];
    return <KeyValuePair numberOfColumn={2} pairs={pairs} />;
}

export function RegulationListCard({ list, label }: Readonly<{
  label: string;
  list: Readonly<ReadonlyArray<Legislation>>;
}>) {
  return (
    <ListCards
      list={list}
      label={label}
      getKey={(regulation, index) =>
        `regulation-${regulation.name || index}`
      }
      renderCard={(regulation) => RegulationCard(regulation)}
    />
  );
}

function RegulationCard(regulation: Readonly<Legislation>) {
    return <InfoCard label="" value={regulation.name || "N/A"} />;
}

export function ComplianceComponent({ compliance }: ComplianceComponentProps) {
  const { t } = useLanguage();

  return (
    <CollapsibleSection
      title={t("Compliance")}
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer={t("datalayer.regulatory")}>
        <DataPointComponent label={t("Regulations")} isEmpty={(compliance?.regulation?.length || 0) === 0}>
          <RegulationListCard list={compliance?.regulation || []} label="" />
        </DataPointComponent>

        <DataPointComponent label={t("Product Labels")} isEmpty={(compliance?.productLabel?.length || 0) === 0}>
          <ProductLabelListCard list={compliance?.productLabel || []} label="" />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.sectoral")}>
        <DataPointComponent label={t("Product Status Assessment")} isEmpty={!compliance?.productStatusAssessment}>
          <ValueTree label="" value={compliance?.productStatusAssessment} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer={t("datalayer.commercial")}>

        <DataPointComponent label={t("Certifications")} isEmpty={(compliance?.certification?.length || 0) === 0}>
              <CertificationListCard list={compliance?.certification || []} label="" />
        </DataPointComponent>

        <DataPointComponent
          label={t("Data Management Method")}
          isEmpty={!compliance?.dataManagementMethod}
        >
          <ValueTree label="" value={compliance?.dataManagementMethod?.name} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
