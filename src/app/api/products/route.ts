import { NextRequest, NextResponse } from "next/server";
import { queryFromTriplyDB } from "@/lib/api";
import {
  queryProductByCompanyQuery,
  queryProductByGTINQuery,
} from "@/query/products";
import {
  toJsonLdPayload,
  TriplyUploadError,
  uploadToTriplyDB,
} from "@/lib/triplydb-client";
import { Product } from "@/types";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getDataLayer } from "@/config/DataLayerConfig";

/** Raw flat row returned by the SPARQL query */
interface ProductRow {
  [key: string]: string | undefined;
}

/**
 * Fields that can differ across rows for the same product (due to multiple
 * traceability events, maintenance logs, etc.).  Each "event group" lists the
 * flat keys that belong together — they will be collected into arrays of
 * objects on the aggregated result.
 */
const EVENT_GROUPS: { arrayKey: string; fields: string[] }[] = [
  {
    arrayKey: "traceabilityEvents",
    fields: [
      "traceActionName",
      "traceActionType",
      "traceTime",
      "traceLocation",
    ],
  },
  {
    arrayKey: "maintenanceEvents",
    fields: ["maintActionName", "maintTime"],
  },
  {
    arrayKey: "usageEvents",
    fields: ["usageActionName", "usageTime"],
  },
  {
    arrayKey: "incidentEvents",
    fields: ["incidentActionName", "incidentTime"],
  },
];

/** Flat field names that belong to event groups (used to exclude from scalar copy) */
const EVENT_FIELD_NAMES = new Set(EVENT_GROUPS.flatMap((g) => g.fields));

/**
 * Aggregate flat SPARQL rows into a single product object.
 * Scalar fields are taken from the first row. Event-like fields that vary
 * across rows are collected into de-duplicated arrays.
 */
function aggregateRows(rows: ProductRow[]): Record<string, unknown> {
  if (rows.length === 0) return {};

  // 1. Copy all scalar (non-event) fields from the first row
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rows[0])) {
    if (!EVENT_FIELD_NAMES.has(key) && value !== undefined) {
      result[key] = value;
    }
  }

  // 2. Collect event arrays, de-duplicating by serialised value
  for (const group of EVENT_GROUPS) {
    const seen = new Set<string>();
    const items: Record<string, string>[] = [];

    for (const row of rows) {
      const product: Record<string, string> = {};
      let hasValue = false;
      for (const field of group.fields) {
        if (row[field]) {
          product[field] = row[field]!;
          hasValue = true;
        }
      }
      if (hasValue) {
        const key = JSON.stringify(product);
        if (!seen.has(key)) {
          seen.add(key);
          items.push(product);
        }
      }
    }

    if (items.length > 0) {
      result[group.arrayKey] = items;
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  const manufacturerId = request.nextUrl.searchParams.get("manufacturerId");
  const gtin = request.nextUrl.searchParams.get("gtin");

  // Query by GTIN — returns a single aggregated product
  if (gtin) {
    try {
      const query = queryProductByGTINQuery(gtin);
      const rows = await queryFromTriplyDB<ProductRow>(query);

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      const product = aggregateRows(rows);
      return NextResponse.json(product);
    } catch (error) {
      console.error("Failed to fetch product by GTIN:", error);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 },
      );
    }
  }

  // Query by manufacturer ID — returns a list of products
  if (manufacturerId) {
    try {
      const query = queryProductByCompanyQuery(manufacturerId);
      const data = await queryFromTriplyDB<ProductRow>(query);
      return NextResponse.json(data);
    } catch (error) {
      console.error("Failed to fetch products by manufacturer:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { error: "Either 'manufacturerId' or 'gtin' query parameter is required" },
    { status: 400 },
  );
}

async function getContext(): Promise<Record<string, unknown>> {
  const contextsDir = join(process.cwd(), "src", "contexts");

  const contextFiles = [
    "base.context.jsonld",
    "dpp-core.context.jsonld",
    "dpp-product-info.context.jsonld",
    "dpp-compliance.context.jsonld",
    "dpp-supply-chain.context.jsonld",
    "dpp-sustainability.context.jsonld",
    "dpp-eol.context.jsonld",
    "dpp-guidelines.context.jsonld",
    "dpp-usage.context.jsonld",
    "dpp-electronics.context.jsonld",
  ];

  const raws = await Promise.all(
    contextFiles.map((fileName) => readFile(join(contextsDir, fileName), "utf-8")),
  );

  const mergedContext: Record<string, unknown> = {};

  for (const raw of raws) {
    const parsed = JSON.parse(raw) as { "@context": unknown };
    const context = parsed["@context"];

    if (Array.isArray(context)) {
      for (const entry of context) {
        if (typeof entry === "object" && entry !== null && !Array.isArray(entry)) {
          Object.assign(mergedContext, entry as Record<string, unknown>);
        }
      }
      continue;
    }

    if (typeof context === "object" && context !== null) {
      Object.assign(mergedContext, context as Record<string, unknown>);
    }
  }

  return mergedContext;
}

function transformNestedObjects(product: Record<string, unknown>): void {
  const dataGroup: Record<string, unknown>[] = [];

  if (isRecord(product.productInfo)) {
    dataGroup.push(transformProductInformation(product.productInfo));
  }
  if (isRecord(product.compliance)) {
    dataGroup.push(transformCompliance(product.compliance));
  }
  if (isRecord(product.supplyChain)) {
    dataGroup.push(transformSupplyChain(product.supplyChain));
  }
  if (isRecord(product.sustainability)) {
    dataGroup.push(transformSustainabilityInformation(product.sustainability));
  }
  if (isRecord(product.endOfLife)) {
    dataGroup.push(transformEndOfLifeData(product.endOfLife));
  }
  if (isRecord(product.guidelines)) {
    dataGroup.push(transformGuidelinesAndManuals(product.guidelines));
  }
  if (isRecord(product.usage)) {
    dataGroup.push(transformUsageInformation(product.usage));
  }

  delete product.productInfo;
  delete product.compliance;
  delete product.supplyChain;
  delete product.sustainability;
  delete product.endOfLife;
  delete product.guidelines;
  delete product.usage;

  product.dataGroup = dataGroup;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createDataPoint(
  source: Record<string, unknown>,
  type: string,
  label: string,
  idPrefix: string,
): Record<string, unknown> {
  const dataLayer = getDataLayer(type);
  // Only set dataLayer for data points
  if (!dataLayer) {
    return {
      "@type": type,
      "@id": source.id ?? `urn:generated:${idPrefix}:${randomUUID()}`,
      // label,
    };
  }
  return {
    "@type": type,
    "@id": source.id ?? `urn:generated:${idPrefix}:${randomUUID()}`,
    dataLayer: dataLayer,
    // label,
  };
}

function createNode(
  source: Record<string, unknown>,
  type: string,
  label: string,
  idPrefix: string,
): Record<string, unknown> {
  return {
    "@type": type,
    "@id": source.id ?? `urn:generated:${idPrefix}:${randomUUID()}`,
    // label,
  };
}

function copyUnhandledProperties(
  source: Record<string, unknown>,
  result: Record<string, unknown>,
  handled: Set<string>,
): void {
  for (const [key, value] of Object.entries(source)) {
    if (!handled.has(key)) {
      result[key] = value;
    }
  }
}

function transformEvent(event: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(event, "Event", "Event", "event");

  if (isRecord(event.location)) {
    result.location = transformPlace(event.location);
  }

  if (isRecord(event.actor)) {
    result.actor = transformOrganization(event.actor);
  }

  copyUnhandledProperties(event, result, new Set(["id", "@id", "@type", "location", "actor"]));
  return result;
}

function transformPlace(place: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(place, "Place", "Place", "place");
  copyUnhandledProperties(place, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformGuide(guide: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(guide, "Guide", "Guide", "guide");
  copyUnhandledProperties(guide, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformImageObject(image: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(image, "ImageObject", "Image", "image");
  copyUnhandledProperties(image, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformOrganization(
  org: Record<string, unknown>,
): Record<string, unknown> {
  const result = createNode(org, "Organization", "Organization", "organization");
  copyUnhandledProperties(org, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformLegislation(
  legislation: Record<string, unknown>,
): Record<string, unknown> {
  const result = createNode(legislation, "Legislation", "Legislation", "legislation");
  copyUnhandledProperties(legislation, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformCertificationInfo(
  certification: Record<string, unknown>,
): Record<string, unknown> {
  const result = createNode(certification, "Certification", "Certification", "certification");
  copyUnhandledProperties(certification, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformCountry(country: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(country, "Country", "Country", "country");
  copyUnhandledProperties(country, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSubstance(substance: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(substance, "Substance", "Substance", "substance");
  copyUnhandledProperties(substance, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformResourceConsumption(resource: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(resource, "ResourceConsumption", "Resource Consumption", "resource-consumption");
  copyUnhandledProperties(resource, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformEnvironmentalFootprint(footprint: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(footprint, "EnvironmentalFootprint", "Environmental Footprint", "environmental-footprint");
  copyUnhandledProperties(footprint, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformProductInformation(
  info: Record<string, unknown>,
): Record<string, unknown> {
  const result = createNode(info, "ProductInformation", "Product Information", "product-info");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(info.identification)) {
    dataPoint.push(transformProductIdentificationInformation(info.identification));
  }
  if (isRecord(info.manufacturer)) {
    dataPoint.push(transformManufacturer(info.manufacturer));
  }
  if (isRecord(info.material)) {
    dataPoint.push(transformMaterialInformation(info.material));
  }
  if (isRecord(info.spareParts)) {
    dataPoint.push(transformSparePartsAvailability(info.spareParts));
  }
  if (isRecord(info.hazardousSubstances)) {
    dataPoint.push(transformHazardousSubstances(info.hazardousSubstances));
  }
  if (isRecord(info.substancesOfConcern)) {
    dataPoint.push(transformSubstancesOfConcern(info.substancesOfConcern));
  }
  if (isRecord(info.sectorRequiredInformation)) {
    dataPoint.push(transformSectorRequiredInformation(info.sectorRequiredInformation));
  }
  if (isRecord(info.productSpecification)) {
    dataPoint.push(transformProductSpecification(info.productSpecification));
  }
  if (isRecord(info.sectorNonRequiredInformation)) {
    dataPoint.push(transformSectorNonRequiredInformation(info.sectorNonRequiredInformation));
  }
  if (isRecord(info.relatedObjects)) {
    dataPoint.push(transformRelatedObjects(info.relatedObjects));
  }
  if (isRecord(info.testReports)) {
    dataPoint.push(transformTestReports(info.testReports));
  }
  if (isRecord(info.commercialInformation)) {
    dataPoint.push(transformProductCommercialInformation(info.commercialInformation));
  }
  if (isRecord(info.qualityAssessment)) {
    dataPoint.push(transformQualityAssessment(info.qualityAssessment));
  }
  if (isRecord(info.identifiedRisk)) {
    dataPoint.push(transformIdentifiedRisk(info.identifiedRisk));
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformManufacturer(
  manufacturer: Record<string, unknown>,
): Record<string, unknown> {
  const result = createDataPoint(manufacturer, "Manufacturer", "Manufacturer", "manufacturer");

  if (isRecord(manufacturer.manufacturerInfo)) {
    result.manufacturerInfo = transformOrganization(manufacturer.manufacturerInfo);
  }
  if (isRecord(manufacturer.manufacturer)) {
    result.manufacturer = transformOrganization(manufacturer.manufacturer);
  }

  copyUnhandledProperties(
    manufacturer,
    result,
    new Set(["id", "@id", "@type", "manufacturerInfo", "manufacturer"]),
  );

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
  copyUnhandledProperties(material, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSparePartsAvailability(spareParts: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(spareParts, "SparePartsAvailability", "Spare Parts Availability", "spare-parts");
  copyUnhandledProperties(spareParts, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformHazardousSubstances(hazardous: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(hazardous, "HazardousSubstances", "Hazardous Substances", "hazardous-substances");

  if (Array.isArray(hazardous.hazardousSubstances)) {
    result.hazardousSubstances = hazardous.hazardousSubstances
      .filter(isRecord)
      .map((item) => transformSubstance(item));
  }

  copyUnhandledProperties(hazardous, result, new Set(["id", "@id", "@type", "hazardousSubstances"]));
  return result;
}

function transformSubstancesOfConcern(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SubstancesOfConcern", "Substances Of Concern", "substances-of-concern");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSectorRequiredInformation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SectorRequiredInformation", "Sector Required Information", "sector-required-info");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformProductSpecification(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ProductSpecification", "Product Specification", "product-specification");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSectorNonRequiredInformation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SectorNonRequiredInformation", "Sector Non-Required Information", "sector-non-required-info");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformRelatedObjects(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "RelatedObjects", "Related Objects", "related-objects");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformTestReports(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "TestReports", "Test Reports", "test-reports");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
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

function transformQualityAssessment(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "QualityAssessment", "Quality Assessment", "quality-assessment");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformIdentifiedRisk(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "IdentifiedRisk", "Identified Risk", "identified-risk");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformCompliance(compliance: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(compliance, "Compliance", "Compliance", "compliance");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(compliance.regulation)) dataPoint.push(transformRegulation(compliance.regulation));
  if (isRecord(compliance.complianceLabel)) dataPoint.push(transformComplianceLabel(compliance.complianceLabel));
  if (isRecord(compliance.productStatusAssessment)) {
    dataPoint.push(transformProductStatusAssessment(compliance.productStatusAssessment));
  }
  if (isRecord(compliance.certification)) {
    dataPoint.push(transformCertification(compliance.certification));
  }
  if (isRecord(compliance.dataManagementMethod)) {
    dataPoint.push(transformDataManagementMethod(compliance.dataManagementMethod));
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformRegulation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "Regulation", "Regulation", "regulation");
  if (isRecord(value.regulation)) {
    result.regulation = transformLegislation(value.regulation);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "regulation"]));
  return result;
}

function transformComplianceLabel(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ComplianceLabel", "Compliance Label", "compliance-label");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformProductStatusAssessment(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ProductStatusAssessment", "Product Status Assessment", "product-status-assessment");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformCertification(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "Certification", "Certification", "compliance-certification");
  if (isRecord(value.certification)) {
    result.certification = transformCertificationInfo(value.certification);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "certification"]));
  return result;
}

function transformDataManagementMethod(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "DataManagementMethod", "Data Management Method", "data-management-method");
  if (isRecord(value.dataManagementMethod)) {
    result.dataManagementMethod = transformLegislation(value.dataManagementMethod);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "dataManagementMethod"]));
  return result;
}

function transformSupplyChain(supplyChain: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(supplyChain, "SupplyChain", "Supply Chain", "supply-chain");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(supplyChain.productTraceability)) {
    dataPoint.push(transformProductTraceability(supplyChain.productTraceability));
  }
  if (isRecord(supplyChain.recyclingPartner)) {
    dataPoint.push(transformRecyclingPartner(supplyChain.recyclingPartner));
  }
  if (isRecord(supplyChain.customerReturnChannel)) {
    dataPoint.push(transformCustomerReturnChannel(supplyChain.customerReturnChannel));
  }
  if (isRecord(supplyChain.componentSupplier)) {
    dataPoint.push(transformComponentSupplier(supplyChain.componentSupplier));
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformProductTraceability(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ProductTraceability", "Product Traceability", "product-traceability");
  if (Array.isArray(value.traceabilityEvent)) {
    result.traceabilityEvent = value.traceabilityEvent.filter(isRecord).map((event) => transformEvent(event));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "traceabilityEvent"]));
  return result;
}

function transformRecyclingPartner(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "RecyclingPartner", "Recycling Partner", "recycling-partner");
  if (isRecord(value.participant)) {
    result.participant = transformOrganization(value.participant);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "participant"]));
  return result;
}

function transformCustomerReturnChannel(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "CustomerReturnChannel", "Customer Return Channel", "customer-return-channel");
  if (isRecord(value.participant)) {
    result.participant = transformOrganization(value.participant);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "participant"]));
  return result;
}

function transformComponentSupplier(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ComponentSupplier", "Component Supplier", "component-supplier");
  if (isRecord(value.participant)) {
    result.participant = transformOrganization(value.participant);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "participant"]));
  return result;
}

function transformSustainabilityInformation(sustainability: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(sustainability, "SustainabilityInformation", "Sustainability Information", "sustainability");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(sustainability.sustainabilityPerformance)) {
    dataPoint.push(transformSustainabilityPerformance(sustainability.sustainabilityPerformance));
  }
  if (isRecord(sustainability.decomposability)) dataPoint.push(transformDecomposability(sustainability.decomposability));
  if (isRecord(sustainability.sectorSustainabilityIndicators)) {
    dataPoint.push(transformSectorSustainabilityIndicators(sustainability.sectorSustainabilityIndicators));
  }
  if (isRecord(sustainability.criticalRawMaterial)) {
    dataPoint.push(transformCriticalRawMaterial(sustainability.criticalRawMaterial));
  }
  if (isRecord(sustainability.lifeCycleAssessment)) {
    dataPoint.push(transformLifeCycleAssessment(sustainability.lifeCycleAssessment));
  }
  if (isRecord(sustainability.renewableNonRenewableContent)) {
    dataPoint.push(transformRenewableNonRenewableContent(sustainability.renewableNonRenewableContent));
  }
  if (isRecord(sustainability.commercialSustainableIndicators)) {
    dataPoint.push(transformCommercialSustainableIndicators(sustainability.commercialSustainableIndicators));
  }
  if (isRecord(sustainability.socialIndicator)) {
    dataPoint.push(transformSocialIndicator(sustainability.socialIndicator));
  }
  if (isRecord(sustainability.sustainabilityAttributes)) {
    dataPoint.push(transformSustainabilityAttributes(sustainability.sustainabilityAttributes));
  }
  if (isRecord(sustainability.environmentDeclaration)) {
    dataPoint.push(transformEnvironmentDeclaration(sustainability.environmentDeclaration));
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformSustainabilityPerformance(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SustainabilityPerformance", "Sustainability Performance", "sustainability-performance");
  if (isRecord(value.environmentalFootprint)) {
    result.environmentalFootprint = transformEnvironmentalFootprint(value.environmentalFootprint);
  }
  if (isRecord(value.resourceConsumption)) {
    result.resourceConsumption = transformResourceConsumption(value.resourceConsumption);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "environmentalFootprint", "resourceConsumption"]));
  return result;
}

function transformDecomposability(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "Decomposability", "Decomposability", "decomposability");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSectorSustainabilityIndicators(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SectorSustainabilityIndicators", "Sector Sustainability Indicators", "sector-sustainability-indicators");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformCriticalRawMaterial(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "CriticalRawMaterial", "Critical Raw Material", "critical-raw-material");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformLifeCycleAssessment(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "LifeCycleAssessment", "Life Cycle Assessment", "life-cycle-assessment");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformRenewableNonRenewableContent(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "RenewableNonRenewableContent", "Renewable Non Renewable Content", "renewable-non-renewable-content");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformCommercialSustainableIndicators(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "CommercialSustainableIndicators", "Commercial Sustainable Indicators", "commercial-sustainable-indicators");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSocialIndicator(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SocialIndicator", "Social Indicator", "social-indicator");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSustainabilityAttributes(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SustainabilityAttributes", "Sustainability Attributes", "sustainability-attributes");
  if (isRecord(value.resourceConsumptionWhenUsing)) {
    result.resourceConsumptionWhenUsing = transformResourceConsumption(value.resourceConsumptionWhenUsing);
  }
  if (isRecord(value.resourceConsumptionWhenRecovering)) {
    result.resourceConsumptionWhenRecovering = transformResourceConsumption(value.resourceConsumptionWhenRecovering);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "resourceConsumptionWhenUsing", "resourceConsumptionWhenRecovering"]));
  return result;
}

function transformEnvironmentDeclaration(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "EnvironmentDeclaration", "Environment Declaration", "environment-declaration");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformEndOfLifeData(endOfLife: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(endOfLife, "EndOfLifeData", "End Of Life Data", "end-of-life");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(endOfLife.recyclingReusePotential)) dataPoint.push(transformRecyclingReusePotential(endOfLife.recyclingReusePotential));
  if (isRecord(endOfLife.disposalOptions)) dataPoint.push(transformDisposalOptions(endOfLife.disposalOptions));
  if (isRecord(endOfLife.unsoldProductsInformation)) dataPoint.push(transformUnsoldProductsInformation(endOfLife.unsoldProductsInformation));
  if (isRecord(endOfLife.expectedWaste)) dataPoint.push(transformExpectedWaste(endOfLife.expectedWaste));
  if (isRecord(endOfLife.reusability)) dataPoint.push(transformReusability(endOfLife.reusability));
  if (isRecord(endOfLife.repairability)) dataPoint.push(transformRepairability(endOfLife.repairability));
  if (isRecord(endOfLife.refurbrishability)) dataPoint.push(transformRefurbrishability(endOfLife.refurbrishability));
  if (isRecord(endOfLife.upgradeOptions)) dataPoint.push(transformUpgradeOptions(endOfLife.upgradeOptions));
  if (isRecord(endOfLife.endOfLifeHistory)) dataPoint.push(transformEndOfLifeHistory(endOfLife.endOfLifeHistory));
  if (isRecord(endOfLife.numberOfLifecycles)) dataPoint.push(transformNumberOfLifecycles(endOfLife.numberOfLifecycles));
  if (isRecord(endOfLife.endOfLifeInformation)) dataPoint.push(transformEndOfLifeInformation(endOfLife.endOfLifeInformation));

  result.dataPoint = dataPoint;
  return result;
}

function transformRecyclingReusePotential(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "RecyclingReusePotential", "Recycling Reuse Potential", "recycling-reuse-potential");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformDisposalOptions(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "DisposalOptions", "Disposal Options", "disposal-options");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformUnsoldProductsInformation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "UnsoldProductsInformation", "Unsold Products Information", "unsold-products-information");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformExpectedWaste(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ExpectedWaste", "Expected Waste", "expected-waste");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformReusability(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "Reusability", "Reusability", "reusability");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformRepairability(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "Repairability", "Repairability", "repairability");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformRefurbrishability(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "Refurbrishability", "Refurbrishability", "refurbrishability");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformUpgradeOptions(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "UpgradeOptions", "Upgrade Options", "upgrade-options");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformEndOfLifeHistory(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "EndOfLifeHistory", "End Of Life History", "end-of-life-history");
  if (Array.isArray(value.endOfLifeHistory)) {
    result.endOfLifeHistory = value.endOfLifeHistory.filter(isRecord).map((event) => transformEvent(event));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "endOfLifeHistory"]));
  return result;
}

function transformNumberOfLifecycles(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "NumberOfLifecycles", "Number Of Lifecycles", "number-of-lifecycles");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformEndOfLifeInformation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "EndOfLifeInformation", "End Of Life Information", "end-of-life-information");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformGuidelinesAndManuals(guidelines: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(guidelines, "GuidelinesAndManuals", "Guidelines And Manuals", "guidelines-manuals");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(guidelines.assemblyGuideline)) dataPoint.push(transformAssemblyGuideline(guidelines.assemblyGuideline));
  if (isRecord(guidelines.nonDestructiveDisassemblyGuideline)) dataPoint.push(transformNonDestructiveDisassemblyGuideline(guidelines.nonDestructiveDisassemblyGuideline));
  if (isRecord(guidelines.productManual)) dataPoint.push(transformProductManual(guidelines.productManual));
  if (isRecord(guidelines.storageAndTransportGuideline)) dataPoint.push(transformStorageAndTransportGuideline(guidelines.storageAndTransportGuideline));
  if (isRecord(guidelines.commercialInstruction)) dataPoint.push(transformCommercialInstruction(guidelines.commercialInstruction));
  if (isRecord(guidelines.accessibility)) dataPoint.push(transformAccessibility(guidelines.accessibility));
  if (isRecord(guidelines.utilizationCharacteristic)) dataPoint.push(transformUtilizationCharacteristic(guidelines.utilizationCharacteristic));

  result.dataPoint = dataPoint;
  return result;
}

function transformAssemblyGuideline(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "AssemblyGuideline", "Assembly Guideline", "assembly-guideline");
  if (isRecord(value.assemblyGuideline)) {
    result.assemblyGuideline = transformGuide(value.assemblyGuideline);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "assemblyGuideline"]));
  return result;
}

function transformNonDestructiveDisassemblyGuideline(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "NonDestructiveDisassemblyGuideline", "Non Destructive Disassembly Guideline", "non-destructive-disassembly-guideline");
  if (isRecord(value.nonDestructiveDisassemblyGuideline)) {
    result.nonDestructiveDisassemblyGuideline = transformGuide(value.nonDestructiveDisassemblyGuideline);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "nonDestructiveDisassemblyGuideline"]));
  return result;
}

function transformProductManual(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ProductManual", "Product Manual", "product-manual");
  if (isRecord(value.productManual)) {
    result.productManual = transformGuide(value.productManual);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "productManual"]));
  return result;
}

function transformStorageAndTransportGuideline(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "StorageAndTransportGuideline", "Storage And Transport Guideline", "storage-transport-guideline");
  if (isRecord(value.storageAndTransportGuideline)) {
    result.storageAndTransportGuideline = transformGuide(value.storageAndTransportGuideline);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "storageAndTransportGuideline"]));
  return result;
}

function transformCommercialInstruction(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "CommercialInstruction", "Commercial Instruction", "commercial-instruction");
  if (isRecord(value.safetyInstruction)) {
    result.safetyInstruction = transformGuide(value.safetyInstruction);
  }
  if (isRecord(value.maintenanceInstruction)) {
    result.maintenanceInstruction = transformGuide(value.maintenanceInstruction);
  }
  if (isRecord(value.wasteSortingInstruction)) {
    result.wasteSortingInstruction = transformGuide(value.wasteSortingInstruction);
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "safetyInstruction", "maintenanceInstruction", "wasteSortingInstruction"]));
  return result;
}

function transformAccessibility(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "Accessibility", "Accessibility", "accessibility");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformUtilizationCharacteristic(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "UtilizationCharacteristic", "Utilization Characteristic", "utilization-characteristic");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformUsageInformation(usage: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(usage, "UsageInformation", "Usage Information", "usage-information");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(usage.maintenanceLog)) dataPoint.push(transformMaintenanceLog(usage.maintenanceLog));
  if (isRecord(usage.usageHistory)) dataPoint.push(transformUsageHistory(usage.usageHistory));
  if (isRecord(usage.incidentsAndErrors)) dataPoint.push(transformIncidentsAndErrors(usage.incidentsAndErrors));

  result.dataPoint = dataPoint;
  return result;
}

function transformMaintenanceLog(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "MaintenanceLog", "Maintenance Log", "maintenance-log");
  if (Array.isArray(value.maintenanceLog)) {
    result.maintenanceLog = value.maintenanceLog.filter(isRecord).map((event) => transformEvent(event));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "maintenanceLog"]));
  return result;
}

function transformUsageHistory(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "UsageHistory", "Usage History", "usage-history");
  if (Array.isArray(value.usageHistory)) {
    result.usageHistory = value.usageHistory.filter(isRecord).map((event) => transformEvent(event));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "usageHistory"]));
  return result;
}

function transformIncidentsAndErrors(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "IncidentsAndErrors", "Incidents And Errors", "incidents-errors");
  if (Array.isArray(value.incidentsAndErrors)) {
    result.incidentsAndErrors = value.incidentsAndErrors.filter(isRecord).map((event) => transformEvent(event));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "incidentsAndErrors"]));
  return result;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = process.env.TRIPLYDB_TOKEN;
  const datasetName = process.env.DATASET_NAME;
  const companyName = process.env.COMPANY_NAME || "example-manufacturer";
  const graphName = `urn:dpp:data:${companyName}`;

  if (!token || !datasetName) {
    return NextResponse.json(
      {
        error:
          "Missing environment variables. TRIPLYDB_TOKEN and DATASET_NAME are required.",
      },
      { status: 500 },
    );
  }

  let productData: Product;
  try {
    productData = (await request.json()) as Product;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  productData.label =
    productData.productInfo?.identification?.productName || "Unnamed Product";

  try {
    const jsonLdPayload = await toJsonLdPayload(
      productData as Record<string, unknown>,
      "dpp-core:Product",
      getContext,
      transformNestedObjects,
    );

    const uploadResult = await uploadToTriplyDB(jsonLdPayload, {
      token,
      datasetName,
      graphName,
    });

    return NextResponse.json({
      message:
        "Product created, transformed to JSON-LD, and uploaded successfully.",
      product: productData,
      jsonLdPayload,
      uploadResult,
    });
  } catch (error: unknown) {
    if (error instanceof TriplyUploadError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error during DPP upload test";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
