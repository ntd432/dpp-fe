"use client";

import {
  CollapsibleSection,
  DataLayerGroup,
} from "@/components/form/CollapsibleSection";
import { ComponentListCard, KeyValuePair, ListCards, ValueTree } from "./CommonComponents";
import { ProductInformation, Substance } from "@/types";
import { ImageInfoCard, InfoCardWithLink } from "@/components/InfoCard";
import DataPointComponent from "@/components/DataPointComponent";
import { SectorExtensionComponent } from "./extensions/SectorExtensionFactory";
import { useLanguage } from "@/contexts/LanguageContext";

type ProductInformationComponentProps = Readonly<{
  productInfo: ProductInformation;
  productSector?: string;
}>;

function formatIsoDuration(isoDuration?: string): string {
  if (!isoDuration) return "N/A";

  const value = isoDuration.trim();
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

function toCamelCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      return index === 0 ? lowerWord : lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join('');
}

function SubstanceListCard({ list }: Readonly<{ list: ReadonlyArray<Substance> }>) {
  const { t } = useLanguage();
  return (
    <ListCards
      list={list}
      label=""
      getKey={(substance, index) => `substance-${substance.substanceName || index}`}
      renderCard={(substance) => SubstanceCard(t, substance)}
    />
  );
}

function SubstanceCard(t: (key: string) => string, substance: Readonly<Substance>) {
  const pairs = [
    { label: t("Name"), value: substance.substanceName },
    { label: t("Description"), value: substance.substanceDescription },
    { label: t("IUPAC Name"), value: substance.iupacName },
    { label: t("EC Number"), value: substance.ecNumber },
    { label: t("CAS Number"), value: substance.casNumber },
    { label: t("Concentration Level"), value: substance.concentrationLevel },
    { label: t("Location within product"), value: substance.locationWithinProduct },
    { label: t("Safe Usage Instruction"), value: substance.safeUsageInstruction },
    { label: t("Disassembly Instruction"), value: substance.disassemblyInstruction },
  ];

  return <KeyValuePair numberOfColumn={2} pairs={pairs} />;
}

export function ProductInformationComponent({
  productInfo,
  productSector,
}: ProductInformationComponentProps) {
  const { t } = useLanguage();
  const pii = productInfo.identification;
  const piiPairs = [
    { label: t("Product Name"), value: pii?.productName },
    { label: t("GTIN"), value: pii?.gtin },
    { label: t("TARIC Code"), value: pii?.taricCode },
    { label: t("Country of Origin"), value: pii?.countryOfOrigin?.name },
    { label: t("Production Date"), value: pii?.productionDate },
    { label: t("Documentation URL"), value: pii?.documentation },
    { label: t("Description"), value: pii?.description },
  ];
  const manufacturer = productInfo.manufacturer;
  const componentInfo = productInfo.component;
  const spareParts = productInfo.sparePartsAvailability;
  const hazardousSubstances = productInfo.hazardousSubstances;
  const substancesOfConcern = productInfo.substancesOfConcern;
  const sectorRequiredInformation = productInfo.sectorRequiredInformation;
  const productSpecification = productInfo.productSpecification;
  const sectorNonRequiredInformation = productInfo.sectorNonRequiredInformation;
  const testReport = productInfo.testReport;
  const commercialInfo = productInfo.commercialInformation;
  const commercialInfoPairs = [
    { label: t("Lifetime Expectancy (ISO 8601)"), value: formatIsoDuration(commercialInfo?.lifetimeExpectancy) },
    { label: t("Warranty Period (ISO 8601)"), value: formatIsoDuration(commercialInfo?.warrantyPeriod) },
    { label: t("Takeback Option"), value: commercialInfo?.takebackOption },
  ];
  const qualityAssessment = productInfo.qualityAssessment;
  const identifiedRisk = productInfo.identifiedRisk;

  return (
    <CollapsibleSection
      title={t("Product Information")}
      showCollapseButton
      defaultOpen={false}
    >
      <div className="block font-medium mb-5">
        {t("Product Sector")}: {t(`sectors.${toCamelCase(productSector || "")}`) || productSector || "N/A"}
      </div>
      <DataLayerGroup layer={t("datalayer.regulatory")}>
        <DataPointComponent
          label={t("Product Identification Information")}
          isEmpty={!pii}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {piiPairs.map((pair) => (
              <ValueTree key={pair.label} label={pair.label} value={pair.value} />
            ))}
          </div>
        </DataPointComponent>
        <DataPointComponent label={t("Manufacturer")} isEmpty={!manufacturer}>
          <InfoCardWithLink value={manufacturer?.name || "N/A"} link={manufacturer?.url} />
        </DataPointComponent>
        <DataPointComponent label={t("Component Information")} isEmpty={!componentInfo}>
          <ComponentListCard
            label={t("Component Composition")}
            componentList={componentInfo?.componentComposition || []}
          />
          <InfoCardWithLink
            label={t("Component Bills URL")}
            value={componentInfo?.componentBills || t("No data")}
            link={componentInfo?.componentBills}
          />
          <ComponentListCard
            label={t("Recycled / Reused Content")}
            componentList={componentInfo?.recycledReusedContent || []}
          />
        </DataPointComponent>
        <DataPointComponent label={t("Spare Parts Availability")} isEmpty={!spareParts}>
          <ValueTree label={t("Spare Parts")} value={spareParts} />
        </DataPointComponent>
        <DataPointComponent
          label={t("Hazardous Substances")}
          isEmpty={(hazardousSubstances?.length || 0) === 0}
        >
          <SubstanceListCard list={hazardousSubstances || []} />
        </DataPointComponent>
        <DataPointComponent
          label={t("Substances of Concern")}
          isEmpty={(substancesOfConcern?.length || 0) === 0}
        >
          <SubstanceListCard list={substancesOfConcern || []} />
        </DataPointComponent>
        <DataPointComponent
          label={t("Sector Required Information")}
          isEmpty={!sectorRequiredInformation}
        >
          <SectorExtensionComponent
            sector={productSector}
            field="sectorRequiredInformation"
            data={sectorRequiredInformation}
          />
        </DataPointComponent>
      </DataLayerGroup>
      <DataLayerGroup layer={t("datalayer.sectoral")}>
        <DataPointComponent label={t("Product Specification")} isEmpty={!productSpecification}>
          <SectorExtensionComponent
            sector={productSector}
            field="productSpecification"
            data={productSpecification}
          />
        </DataPointComponent>
        <DataPointComponent
          label={t("Sector Non-Required Information")}
          isEmpty={!sectorNonRequiredInformation}
        >
          <SectorExtensionComponent
            sector={productSector}
            field="sectorNonRequiredInformation"
            data={sectorNonRequiredInformation}
          />
        </DataPointComponent>
        <DataPointComponent label={t("Test Report")} isEmpty={!testReport}>
          <ValueTree label="" value={testReport} />
        </DataPointComponent>
      </DataLayerGroup>
      <DataLayerGroup layer={t("datalayer.commercial")}>
        <DataPointComponent
          label={t("Product Commercial Information")}
          isEmpty={!commercialInfo}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {commercialInfoPairs.map((pair) => (
              <ValueTree key={pair.label} label={pair.label} value={pair.value} />
            ))}
            <ImageInfoCard label={t("Product Image")} value={commercialInfo?.image?.url || ""} />
          </div>
        </DataPointComponent>
        <DataPointComponent label={t("Quality Assessment")} isEmpty={!qualityAssessment}>
          <ValueTree label="" value={qualityAssessment} />
        </DataPointComponent>
        <DataPointComponent label={t("Identified Risk")} isEmpty={!identifiedRisk}>
          <ValueTree label="" value={identifiedRisk} />
        </DataPointComponent>
      </DataLayerGroup>
    </CollapsibleSection>
  );
}
