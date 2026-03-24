import {
  CollapsibleSection,
  DataLayerGroup,
} from "@/components/form/CollapsibleSection";
import { ValueTree } from "../[dppId]/page";
import { Component, ProductInformation, Substance } from "@/types";
import { ImageInfoCard, InfoCardWithLink } from "@/components/InfoCard";
import DataPointComponent from "@/components/DataPointComponent";

type ProductInformationComponentProps = Readonly<{
  productInfo: ProductInformation;
  productSector?: string;
}>;

function formatIsoDuration(isoDuration?: string): string {
  if (!isoDuration) return "N/A";

  const value = isoDuration.trim();
  // Supports common date-based durations such as P5Y, P2Y6M, P3M10D, P1Y2M15D.
  const match = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?$/i.exec(value);

  if (!match) {
    return value;
  }

  const years = match[1] ? Number(match[1]) : 0;
  const months = match[2] ? Number(match[2]) : 0;
  const days = match[3] ? Number(match[3]) : 0;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);

  return parts.length > 0 ? parts.join(", ") : value;
}

function SubstanceListCard({label, substanceList}: Readonly<{ label: string; substanceList: ReadonlyArray<Substance> }>) {
  if (substanceList.length === 0) {
    return (
      <ValueTree label={label} value="No data" />
    )
  }
  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-semibold text-gray-700">{label}</p>}
      {substanceList.map((substance, index) => (
        <div key={`substance-${substance.iupacName || index}`}>{SubstanceCard(substance)}</div>
      ))}
    </div>
  );
}

function SubstanceCard(substance: Readonly<Substance>) {
  const pairs = [
    { label: "Name", value: substance.substanceName },
    { label: "Description", value: substance.substanceDescription },
    { label: "IUPAC Name", value: substance.iupacName },
    { label: "EC Number", value: substance.ecNumber },
    { label: "CAS Number", value: substance.casNumber },
    { label: "Concentration Level", value: substance.concentrationLevel },
    { label: "Location within product", value: substance.locationWithinProduct },
    { label: "Safe Usage Instruction", value: substance.safeUsageInstruction },
    { label: "Disassembly Instruction", value: substance.disassemblyInstruction },
  ];
  return (
    <div className="ml-5 rounded-lg bg-white p-3 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pairs.map((pair) => (
          <ValueTree key={pair.label} label={pair.label} value={pair.value} />
        ))}
      </div>
    </div>

  );
}

function ComponentListCard({label, componentList}: Readonly<{ label: string; componentList: ReadonlyArray<Component> }>) {
  if (componentList.length === 0) {
    return (
      <ValueTree label={label} value="No data" />
    )
  }
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      {componentList.map((component, index) => (
        <div key={`component-${component.componentName || index}`}>{ComponentCard(component)}</div>
      ))}
    </div>
  );
}

function ComponentCard(component: Readonly<Component>) {
  let componentName = component.componentName || "Unnamed Component";
  if (component.componentPercentage !== undefined) {
    componentName = `${componentName} (${component.componentPercentage}%)`;
  } else if (component.componentCountValue !== undefined) {
    componentName = `${componentName} (${component.componentCountValue} ${component.componentCountUnit || "units"})`;
  }
  const componentPairs = [
    { label: "Component", value: componentName },
    { label: "Component Reference", value: component.componentReference },
    { label: "Component URI", value: component.componentURI },
  ];
  return (
    <div className="ml-5 rounded-lg bg-white p-3 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {componentPairs.map((pair) => (
          <ValueTree key={pair.label} label={pair.label} value={pair.value} />
        ))}
        {component.componentSupplier && (
          <InfoCardWithLink
            label="Component Supplier"
            value={component.componentSupplier?.name || "N/A"}
            link={component.componentSupplier?.url}
          />
        )}
      </div>
    </div>

  );
}

export function ProductInformationComponent({
  productInfo,
  productSector,
}: ProductInformationComponentProps) {
  const pii = productInfo.identification;
  const piiPairs = [
    { label: "Product Name", value: pii?.productName },
    { label: "GTIN", value: pii?.gtin },
    { label: "TARIC Code", value: pii?.taricCode },
    { label: "Country of Origin", value: pii?.countryOfOrigin?.name },
    { label: "Production Date", value: pii?.productionDate },
    { label: "Documentation", value: pii?.documentation },
    { label: "Description", value: pii?.description },
  ];
  const manufacturer = productInfo.manufacturer;
  const componentInfo = productInfo.component;
  const spareParts = productInfo.sparePartsAvailability;
  const hazardousSubstances = productInfo.hazardousSubstances;
  const substancesOfConcern = productInfo.substancesOfConcern;
  const sectorRequiredInformation = productInfo.sectorRequiredInformation;
  const productSpecification = productInfo.productSpecification;
  const sectorNonRequiredInformation = productInfo.sectorNonRequiredInformation;
  const relatedObjects = productInfo.relatedObjects;
  const testReport = productInfo.testReport;
  const commercialInfo = productInfo.commercialInformation;
  const commercialInfoPairs = [
    {
      label: "Lifetime Expectancy",
      value: formatIsoDuration(commercialInfo?.lifetimeExpectancy),
    },
    { label: "Warranty Period", value: commercialInfo?.warrantyPeriod },
    { label: "Takeback Option", value: commercialInfo?.takebackOption },
  ];
  const qualityAssessment = productInfo.qualityAssessment;
  const identifiedRisk = productInfo.identifiedRisk;

  return (
    <CollapsibleSection
      title="Product Information"
      color="emerald"
      showCollapseButton
      defaultOpen={false}
    >
      <div className="block font-medium mb-5">
        Product Sector: {productSector || "N/A"}
      </div>
      <DataLayerGroup layer="Regulatory">
        <DataPointComponent label="Product Identification Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {piiPairs.map((pair) => (
              <ValueTree
                key={pair.label}
                label={pair.label}
                value={pair.value}
              />
            ))}
          </div>
        </DataPointComponent>
        <DataPointComponent label="Manufacturer">
          <InfoCardWithLink
            value={manufacturer?.name || "N/A"}
            link={manufacturer?.url}
          />
        </DataPointComponent>
        <DataPointComponent label="Component Information">
          <ComponentListCard label="Component Composition" componentList={componentInfo?.componentComposition || []} />
          <InfoCardWithLink
            label="Component Bills"
            value={componentInfo?.componentBills || "N/A"}
            link={componentInfo?.componentBills}
          />
          <ComponentListCard label="Recycled/Reused Content" componentList={componentInfo?.recycledReusedContent || []} />
        </DataPointComponent>
        <DataPointComponent label="Spare Parts Availability">
          <ValueTree label="Spare Parts" value={spareParts} />
        </DataPointComponent>
        <DataPointComponent label="Hazardous Substances">
          <SubstanceListCard label="Substances" substanceList={hazardousSubstances || []} />
        </DataPointComponent>
        <DataPointComponent label="Substances of Concern">
          <SubstanceListCard label="Substances" substanceList={substancesOfConcern || []} />
        </DataPointComponent>
        {/* TODO: Add remaining data points (sector required/non-required information, related objects, test report, commercial information, quality assessment, identified risk) */}
        {/* <DataPointComponent label="Sector Required Information">
          <ValueTree label="Sector Required Information" value={sectorRequiredInformation} />
        </DataPointComponent>
        */}
      </DataLayerGroup>
      <DataLayerGroup layer="Sectoral">
        {/* <DataPointComponent label="Product Specification">
          <ValueTree label="Product Specification" value={productSpecification} />
        </DataPointComponent>
        <DataPointComponent label="Sector Non-Required Information">
          <ValueTree label="Sector Non-Required Information" value={sectorNonRequiredInformation} />
        </DataPointComponent> 
        <DataPointComponent label="Related Objects">
          <ValueTree label="Related Objects" value={relatedObjects} />
        </DataPointComponent>*/}
        <DataPointComponent label="Test Report">
          <ValueTree label="" value={testReport} />
        </DataPointComponent>
      </DataLayerGroup>
      <DataLayerGroup layer="Commercial">
        <DataPointComponent label="Commercial Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {commercialInfoPairs.map((pair) => (
              <ValueTree key={pair.label} label={pair.label} value={pair.value} />
            ))}
            <ImageInfoCard label="Product Image" value={commercialInfo?.image?.url || ""} />
          </div>
        </DataPointComponent>
        <DataPointComponent label="Quality Assessment">
          <ValueTree label="" value={qualityAssessment} />
        </DataPointComponent>
        <DataPointComponent label="Identified Risk">
          <ValueTree label="" value={identifiedRisk} />
        </DataPointComponent>
      </DataLayerGroup>
      {/* <DataLayerGroup layer="Other">
        <ValueTree label="Full Product Information JSON" value={productInfo} />
      </DataLayerGroup> */}
    </CollapsibleSection>
  );
}
