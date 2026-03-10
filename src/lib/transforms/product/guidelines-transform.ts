import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  isRecord,
  transformGuide,
} from "./shared";

export function transformGuidelinesAndManuals(guidelines: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(guidelines, "GuidelinesAndManuals", "Guidelines And Manuals", "guidelines-manuals");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(guidelines.assemblyGuideline)) {
    const dp = createDataPoint({}, "AssemblyGuideline", "Assembly Guideline", "assembly-guideline");
    dp.assemblyGuideline = transformGuide(guidelines.assemblyGuideline);
    dataPoint.push(dp);
  }
  if (isRecord(guidelines.nonDestructiveDisassemblyGuideline)) {
    const dp = createDataPoint({}, "NonDestructiveDisassemblyGuideline", "Non Destructive Disassembly Guideline", "non-destructive-disassembly-guideline");
    dp.nonDestructiveDisassemblyGuideline = transformGuide(guidelines.nonDestructiveDisassemblyGuideline);
    dataPoint.push(dp);
  }
  if (isRecord(guidelines.productManual)) {
    const dp = createDataPoint({}, "ProductManual", "Product Manual", "product-manual");
    dp.productManual = transformGuide(guidelines.productManual);
    dataPoint.push(dp);
  }
  if (isRecord(guidelines.storageAndTransportGuideline)) {
    dataPoint.push(transformStorageAndTransportGuideline(guidelines.storageAndTransportGuideline));
  }
  if (isRecord(guidelines.commercialInstruction)) {
    dataPoint.push(transformCommercialInstruction(guidelines.commercialInstruction));
  }
  if (guidelines.accessibility !== undefined) {
    const dp = createDataPoint({}, "Accessibility", "Accessibility", "accessibility");
    dp.accessibility = guidelines.accessibility;
    dataPoint.push(dp);
  }
  if (guidelines.utilizationCharacteristic !== undefined) {
    const dp = createDataPoint({}, "UtilizationCharacteristic", "Utilization Characteristic", "utilization-characteristic");
    dp.utilizationCharacteristic = guidelines.utilizationCharacteristic;
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
