import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { KeyValuePair, ListCards, ValueTree } from "./CommonComponents";
import { Certification, Compliance, Label, Legislation } from "@/types";
import InfoCard from "@/components/InfoCard";

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
    const pairs = [
        { label: "Name", value: label.labelName },
        { label: "Description", value: label.labelDescription },
        { label: "Value", value: label.labelValue },
        { label: "Documentation", value: label.labelDocumentation },
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
    const pairs = [
        { label: "Name", value: certification.name },
        { label: "Description", value: certification.description },
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
  return (
    <CollapsibleSection
      title="Compliance"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Regulations" isEmpty={(compliance?.regulation?.length || 0) === 0}>
          <RegulationListCard list={compliance?.regulation || []} label="" />
        </DataPointComponent>

        <DataPointComponent label="Product Labels" isEmpty={(compliance?.productLabel?.length || 0) === 0}>
          <ProductLabelListCard list={compliance?.productLabel || []} label="" />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Sectoral">
        <DataPointComponent label="Product Status Assessment" isEmpty={!compliance?.productStatusAssessment}>
          <ValueTree label="" value={compliance?.productStatusAssessment} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">

        <DataPointComponent label="Certifications" isEmpty={(compliance?.certification?.length || 0) === 0}>
              <CertificationListCard list={compliance?.certification || []} label="" />
        </DataPointComponent>

        <DataPointComponent
          label="Data Management Method"
          isEmpty={!compliance?.dataManagementMethod}
        >
          <ValueTree label="" value={compliance?.dataManagementMethod?.name} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
