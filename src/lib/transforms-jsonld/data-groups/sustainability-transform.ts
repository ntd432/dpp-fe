import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  handleAdditionalProperties,
  isRecord,
  transformEnvironmentalFootprint,
  transformComponent,
  transformMeasurementEntry,
  transformResourceConsumption,
} from "../shared";

export function transformSustainabilityInformation(sustainability: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(sustainability, "SustainabilityInformation", "Sustainability Information", "sustainability");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(sustainability.sustainabilityPerformance)) {
    dataPoint.push(transformSustainabilityPerformance(sustainability.sustainabilityPerformance));
  }
  if (sustainability.decomposability !== undefined) {
    const d = createDataPoint({}, "Decomposability", "Decomposability", "decomposability");
    d.decomposability = sustainability.decomposability;
    dataPoint.push(d);
  }
  if (isRecord(sustainability.sectorSustainabilityIndicators)) {
    const ssi = createDataPoint({}, "SectorSustainabilityIndicators", "Sector Sustainability Indicators", "sector-sustainability-indicators");
    ssi.sectorSustainabilityIndicators = sustainability.sectorSustainabilityIndicators;
    dataPoint.push(ssi);
  }
  if (Array.isArray(sustainability.criticalRawMaterial)) {
    const crm = createDataPoint({}, "CriticalRawMaterial", "Critical Raw Material", "critical-raw-material");
    crm.criticalRawMaterial = transformComponent(sustainability.criticalRawMaterial.filter(isRecord));
    dataPoint.push(crm);
  }
  if (isRecord(sustainability.lifeCycleAssessment)) {
    dataPoint.push(transformLifeCycleAssessment(sustainability.lifeCycleAssessment));
  } else if (typeof sustainability.lifeCycleAssessment === "string") {
    const lca = createDataPoint({}, "LifeCycleAssessment", "Life Cycle Assessment", "life-cycle-assessment");
    lca.lifeCycleAssessmentReport = sustainability.lifeCycleAssessment;
    dataPoint.push(lca);
  }
  if (Array.isArray(sustainability.renewableNonRenewableContent)) {
    const rnrc = createDataPoint({}, "RenewableNonRenewableContent", "Renewable Non Renewable Content", "renewable-non-renewable-content");
    rnrc.renewableNonRenewableContent = transformComponent(sustainability.renewableNonRenewableContent.filter(isRecord));
    dataPoint.push(rnrc);
  }
  if (isRecord(sustainability.circularEconomyIndicator)) {
    const cei = createDataPoint({}, "CircularEconomyIndicator", "Circular Economy Indicator", "circular-economy-indicator");
    cei.circularEconomyIndicator = sustainability.circularEconomyIndicator;
    dataPoint.push(cei);
  }
  if (isRecord(sustainability.socialIndicator)) {
    dataPoint.push(transformSocialIndicator(sustainability.socialIndicator));
  }
  if (isRecord(sustainability.sustainabilityAttributes)) {
    dataPoint.push(transformSustainabilityAttributes(sustainability.sustainabilityAttributes));
  }
  if (sustainability.environmentDeclaration !== undefined) {
    const ed = createDataPoint({}, "EnvironmentDeclaration", "Environment Declaration", "environment-declaration");
    ed.environmentDeclaration = sustainability.environmentDeclaration;
    dataPoint.push(ed);
  }
  if (isRecord(sustainability.additionalProperties)) {
    handleAdditionalProperties(result, sustainability.additionalProperties, "dpp-sustainability");
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformSustainabilityPerformance(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SustainabilityPerformance", "Sustainability Performance", "sustainability-performance");
  if (Array.isArray(value.environmentalFootprint)) {
    result.environmentalFootprint = transformEnvironmentalFootprint(value.environmentalFootprint.filter(isRecord));
  }
  if (Array.isArray(value.resourceConsumption)) {
    result.resourceConsumption = transformResourceConsumption(value.resourceConsumption.filter(isRecord));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "environmentalFootprint", "resourceConsumption"]));
  return result;
}

function transformSocialIndicator(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SocialIndicator", "Social Indicator", "social-indicator");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformSustainabilityAttributes(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "SustainabilityAttributes", "Sustainability Attributes", "sustainability-attributes");
  if (Array.isArray(value.resourceConsumptionWhenUsing)) {
    result.resourceConsumptionWhenUsing = transformResourceConsumption(value.resourceConsumptionWhenUsing.filter(isRecord));
  }
  if (Array.isArray(value.resourceConsumptionWhenRecovering)) {
    result.resourceConsumptionWhenRecovering = transformResourceConsumption(value.resourceConsumptionWhenRecovering.filter(isRecord));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "resourceConsumptionWhenUsing", "resourceConsumptionWhenRecovering"]));
  return result;
}

function transformLifeCycleAssessment(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "LifeCycleAssessment", "Life Cycle Assessment", "life-cycle-assessment");

  if (Array.isArray(value.environmentalImpact)) {
    result.environmentalImpact = transformEnvironmentalImpact(value.environmentalImpact.filter(isRecord));
  }

  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "environmentalImpact"]));
  return result;
}

function transformEnvironmentalImpact(impacts: Record<string, unknown>[]): Record<string, unknown>[] {
  return impacts.map((impact) => {
    const result = createNode(impact, "EnvironmentalImpact", "Environmental Impact", "environmental-impact");

    if (isRecord(impact.impactIndicator)) {
      result.impactIndicator = transformMeasurementEntry(impact.impactIndicator);
    }

    copyUnhandledProperties(impact, result, new Set(["id", "@id", "@type", "impactIndicator"]));
    return result;
  });
}
