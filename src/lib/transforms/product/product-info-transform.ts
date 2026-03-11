import { transformExtension } from "./extension-transformer";
import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  isRecord,
  transformCountry,
  transformImageObject,
  transformMaterial,
  transformOrganization,
  transformSubstance,
} from "./shared";

export function transformProductInformation(
  info: Record<string, unknown>,
): Record<string, unknown> {
  const result = createNode(info, "ProductInformation", "Product Information", "product-info");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(info.identification)) {
    dataPoint.push(transformProductIdentificationInformation(info.identification));
  }
  if (isRecord(info.manufacturer)) {
    const mfr = createDataPoint({}, "Manufacturer", "Manufacturer", "manufacturer");
    mfr.manufacturer = transformOrganization(info.manufacturer);
    dataPoint.push(mfr);
  }
  if (isRecord(info.material)) {
    dataPoint.push(transformMaterialInformation(info.material));
  }
  if (info.sparePartsAvailability !== undefined) {
    const sp = createDataPoint({}, "SparePartsAvailability", "Spare Parts Availability", "spare-parts");
    sp.sparePartsAvailability = info.sparePartsAvailability;
    dataPoint.push(sp);
  }
  if (Array.isArray(info.hazardousSubstances)) {
    const hs = createDataPoint({}, "HazardousSubstances", "Hazardous Substances", "hazardous-substances");
    hs.hazardousSubstances = info.hazardousSubstances
      .filter(isRecord)
      .map((item) => transformSubstance(item));
    dataPoint.push(hs);
  }
  if (Array.isArray(info.substancesOfConcern)) {
    const soc = createDataPoint({}, "SubstancesOfConcern", "Substances Of Concern", "substances-of-concern");
    soc.substancesOfConcern = info.substancesOfConcern
      .filter(isRecord)
      .map((item) => transformSubstance(item));
    dataPoint.push(soc);
  }
  if (isRecord(info.sectorRequiredInformation)) {
    dataPoint.push(
      transformExtension(
        info.sectorRequiredInformation,
        "Sector Required Information",
        "sector-required-info",
      ),
    );
  }
  if (isRecord(info.productSpecification)) {
    dataPoint.push(
      transformExtension(
        info.productSpecification,
        "Product Specification",
        "product-specification",
      ),
    );
  }
  if (isRecord(info.sectorNonRequiredInformation)) {
    dataPoint.push(
      transformExtension(
        info.sectorNonRequiredInformation,
        "Sector Non-Required Information",
        "sector-non-required-info",
      ),
    );
  }
  if (Array.isArray(info.relatedObjects)) {
    const ro = createDataPoint({}, "RelatedObjects", "Related Objects", "related-objects");
    ro.relatedObjects = info.relatedObjects;
    dataPoint.push(ro);
  }
  if (info.testReport !== undefined) {
    const tr = createDataPoint({}, "TestReport", "Test Report", "test-report");
    tr.testReport = info.testReport;
    dataPoint.push(tr);
  }
  if (isRecord(info.commercialInformation)) {
    dataPoint.push(transformProductCommercialInformation(info.commercialInformation));
  }
  if (info.qualityAssessment !== undefined) {
    const qa = createDataPoint({}, "QualityAssessment", "Quality Assessment", "quality-assessment");
    qa.qualityAssessment = info.qualityAssessment;
    dataPoint.push(qa);
  }
  if (info.identifiedRisk !== undefined) {
    const ir = createDataPoint({}, "IdentifiedRisk", "Identified Risk", "identified-risk");
    ir.identifiedRisk = info.identifiedRisk;
    dataPoint.push(ir);
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformProductIdentificationInformation(
  pii: Record<string, unknown>,
): Record<string, unknown> {
  const result = createDataPoint(
    pii,
    "ProductIdentificationInformation",
    "Product Identification Information",
    "pii",
  );

  if (isRecord(pii.countryOfOrigin)) {
    result.countryOfOrigin = transformCountry(pii.countryOfOrigin);
  }

  copyUnhandledProperties(pii, result, new Set(["id", "@id", "@type", "countryOfOrigin"]));

  return result;
}

function transformMaterialInformation(material: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(material, "MaterialInformation", "Material Information", "material-info");

  if (Array.isArray(material.materialComposition)) {
    result.materialComposition = transformMaterial(material.materialComposition.filter(isRecord));
  }
  if (Array.isArray(material.recycledReusedContent)) {
    result.recycledReusedContent = transformMaterial(material.recycledReusedContent.filter(isRecord));
  }

  copyUnhandledProperties(
    material,
    result,
    new Set(["id", "@id", "@type", "materialComposition", "recycledReusedContent"]),
  );
  return result;
}

function transformProductCommercialInformation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ProductCommercialInformation", "Product Commercial Information", "commercial-info");

  if (isRecord(value.image)) {
    result.image = transformImageObject(value.image);
  }

  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "image"]));
  return result;
}
