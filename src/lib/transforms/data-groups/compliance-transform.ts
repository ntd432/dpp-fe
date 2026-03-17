import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  handleAdditionalProperties,
  isRecord,
  transformCertificationInfo,
  transformLegislation,
} from "../shared";

export function transformCompliance(compliance: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(compliance, "Compliance", "Compliance", "compliance");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(compliance.regulation)) {
    const reg = createDataPoint({}, "Regulation", "Regulation", "regulation");
    reg.regulation = transformLegislation(compliance.regulation);
    dataPoint.push(reg);
  }
  if (Array.isArray(compliance.productLabel)) {
    const pl = createDataPoint({}, "ProductLabel", "Product Label", "product-label");
    pl.productLabel = transformLabel(compliance.productLabel.filter(isRecord));
    dataPoint.push(pl);
  }
  if (compliance.productStatusAssessment !== undefined) {
    const psa = createDataPoint({}, "ProductStatusAssessment", "Product Status Assessment", "product-status-assessment");
    psa.productStatusAssessment = compliance.productStatusAssessment;
    dataPoint.push(psa);
  }
  if (Array.isArray(compliance.certification)) {
    const cert = createDataPoint({}, "Certification", "Certification", "certification");
    cert.certification = compliance.certification
      .filter(isRecord)
      .map((item) => transformCertificationInfo(item));
    dataPoint.push(cert);
  }
  if (isRecord(compliance.dataManagementMethod)) {
    const dmm = createDataPoint({}, "DataManagementMethod", "Data Management Method", "data-management-method");
    dmm.dataManagementMethod = transformLegislation(compliance.dataManagementMethod);
    dataPoint.push(dmm);
  }
  if (isRecord(compliance.additionalProperties)) {
      handleAdditionalProperties(result, compliance.additionalProperties, "dpp-compliance");
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformLabel(value: Record<string, unknown>[]): Record<string, unknown>[] {
  return value.map((item) => {
    const result = createNode(item, "Label", "Label", "label");
    copyUnhandledProperties(item, result, new Set(["id", "@id", "@type"]));
    return result;
  });
}
