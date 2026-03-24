import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import DataPointComponent from "@/components/DataPointComponent";
import { ValueTree } from "./CommonComponents";
import { Compliance } from "@/types";

type ComplianceComponentProps = Readonly<{
  compliance?: Compliance;
}>;

export function ComplianceComponent({ compliance }: ComplianceComponentProps) {
  return (
    <CollapsibleSection
      title="Compliance"
      color="rose"
      showCollapseButton
      defaultOpen={false}
    >
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Regulations">
          <ValueTree label="Regulation" value={compliance?.regulation} />
        </DataPointComponent>

        <DataPointComponent label="Product Labels">
          <ValueTree label="Product Label" value={compliance?.productLabel} />
        </DataPointComponent>

        <DataPointComponent label="Certifications">
          <ValueTree label="Certification" value={compliance?.certification} />
        </DataPointComponent>
      </DataLayerGroup>

      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Product Status Assessment">
          <ValueTree label="Product Status Assessment" value={compliance?.productStatusAssessment} />
        </DataPointComponent>

        <DataPointComponent label="Data Management Method">
          <ValueTree label="Data Management Method" value={compliance?.dataManagementMethod} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
