import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  isRecord,
  transformGuide,
} from "../shared";

interface GuideFieldConfig {
  key: string;
  type: string;
  label: string;
  idPrefix: string;
}

interface ScalarFieldConfig {
  key: string;
  type: string;
  label: string;
  idPrefix: string;
}

const GUIDE_FIELDS: GuideFieldConfig[] = [
  {
    key: "assemblyGuideline",
    type: "AssemblyGuideline",
    label: "Assembly Guideline",
    idPrefix: "assembly-guideline",
  },
  {
    key: "nonDestructiveDisassemblyGuideline",
    type: "NonDestructiveDisassemblyGuideline",
    label: "Non Destructive Disassembly Guideline",
    idPrefix: "non-destructive-disassembly-guideline",
  },
  {
    key: "productManual",
    type: "ProductManual",
    label: "Product Manual",
    idPrefix: "product-manual",
  },
];

const SCALAR_FIELDS: ScalarFieldConfig[] = [
  {
    key: "accessibility",
    type: "Accessibility",
    label: "Accessibility",
    idPrefix: "accessibility",
  },
  {
    key: "utilizationCharacteristic",
    type: "UtilizationCharacteristic",
    label: "Utilization Characteristic",
    idPrefix: "utilization-characteristic",
  },
];

export function transformGuidelinesAndManuals(guidelines: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(guidelines, "GuidelinesAndManuals", "Guidelines And Manuals", "guidelines-manuals");
  const dataPoint: Record<string, unknown>[] = [];

  for (const field of GUIDE_FIELDS) {
    const value = guidelines[field.key];
    if (!isRecord(value)) {
      continue;
    }

    const dp = createDataPoint({}, field.type, field.label, field.idPrefix);
    dp[field.key] = transformGuide(value);
    dataPoint.push(dp);
  }

  if (isRecord(guidelines.storageAndTransportGuideline)) {
    dataPoint.push(transformStorageAndTransportGuideline(guidelines.storageAndTransportGuideline));
  }
  if (isRecord(guidelines.commercialInstruction)) {
    dataPoint.push(transformCommercialInstruction(guidelines.commercialInstruction));
  }

  for (const field of SCALAR_FIELDS) {
    const value = guidelines[field.key];
    if (value === undefined) {
      continue;
    }

    const dp = createDataPoint({}, field.type, field.label, field.idPrefix);
    dp[field.key] = value;
    dataPoint.push(dp);
  }

  result.dataPoint = dataPoint;
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
  copyUnhandledProperties(
    value,
    result,
    new Set(["id", "@id", "@type", "safetyInstruction", "maintenanceInstruction", "wasteSortingInstruction"]),
  );
  return result;
}
