import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  handleAdditionalProperties,
  isRecord,
  transformEvent,
} from "../shared";

interface ScalarDataPointFieldConfig {
  key: string;
  type: string;
  label: string;
  idPrefix: string;
}

const SCALAR_FIELDS: ScalarDataPointFieldConfig[] = [
  {
    key: "recyclingReusePotential",
    type: "RecyclingReusePotential",
    label: "Recycling Reuse Potential",
    idPrefix: "recycling-reuse-potential",
  },
  {
    key: "disposalOptions",
    type: "DisposalOptions",
    label: "Disposal Options",
    idPrefix: "disposal-options",
  },
  {
    key: "unsoldProductsInformation",
    type: "UnsoldProductsInformation",
    label: "Unsold Products Information",
    idPrefix: "unsold-products-information",
  },
  {
    key: "expectedWaste",
    type: "ExpectedWaste",
    label: "Expected Waste",
    idPrefix: "expected-waste",
  },
  {
    key: "reusability",
    type: "Reusability",
    label: "Reusability",
    idPrefix: "reusability",
  },
  {
    key: "repairability",
    type: "Repairability",
    label: "Repairability",
    idPrefix: "repairability",
  },
  {
    key: "refurbrishability",
    type: "Refurbrishability",
    label: "Refurbrishability",
    idPrefix: "refurbrishability",
  },
  {
    key: "upgradeOptions",
    type: "UpgradeOptions",
    label: "Upgrade Options",
    idPrefix: "upgrade-options",
  },
  {
    key: "numberOfLifecycles",
    type: "NumberOfLifecycles",
    label: "Number Of Lifecycles",
    idPrefix: "number-of-lifecycles",
  },
];

export function transformEndOfLifeData(endOfLife: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(endOfLife, "EndOfLifeData", "End Of Life Data", "end-of-life");
  const dataPoint: Record<string, unknown>[] = [];

  for (const field of SCALAR_FIELDS) {
    const value = endOfLife[field.key];
    if (value === undefined) {
      continue;
    }

    const dp = createDataPoint({}, field.type, field.label, field.idPrefix);
    dp[field.key] = value;
    dataPoint.push(dp);
  }

  if (Array.isArray(endOfLife.endOfLifeHistory)) {
    const dp = createDataPoint({}, "EndOfLifeHistory", "End Of Life History", "end-of-life-history");
    dp.endOfLifeHistory = endOfLife.endOfLifeHistory.filter(isRecord).map((event) => transformEvent(event));
    dataPoint.push(dp);
  }

  if (isRecord(endOfLife.endOfLifeInformation)) {
    dataPoint.push(transformEndOfLifeInformation(endOfLife.endOfLifeInformation));
  }
  if (isRecord(endOfLife.additionalProperties)) {
    handleAdditionalProperties(result, endOfLife.additionalProperties, "dpp-eol");
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformEndOfLifeInformation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "EndOfLifeInformation", "End Of Life Information", "end-of-life-information");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}
