import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  isRecord,
  transformEvent,
} from "./shared";

export function transformEndOfLifeData(endOfLife: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(endOfLife, "EndOfLifeData", "End Of Life Data", "end-of-life");
  const dataPoint: Record<string, unknown>[] = [];

  if (endOfLife.recyclingReusePotential !== undefined) {
    const dp = createDataPoint({}, "RecyclingReusePotential", "Recycling Reuse Potential", "recycling-reuse-potential");
    dp.recyclingReusePotential = endOfLife.recyclingReusePotential;
    dataPoint.push(dp);
  }
  if (endOfLife.disposalOptions !== undefined) {
    const dp = createDataPoint({}, "DisposalOptions", "Disposal Options", "disposal-options");
    dp.disposalOptions = endOfLife.disposalOptions;
    dataPoint.push(dp);
  }
  if (endOfLife.unsoldProductsInformation !== undefined) {
    const dp = createDataPoint({}, "UnsoldProductsInformation", "Unsold Products Information", "unsold-products-information");
    dp.unsoldProductsInformation = endOfLife.unsoldProductsInformation;
    dataPoint.push(dp);
  }
  if (endOfLife.expectedWaste !== undefined) {
    const dp = createDataPoint({}, "ExpectedWaste", "Expected Waste", "expected-waste");
    dp.expectedWaste = endOfLife.expectedWaste;
    dataPoint.push(dp);
  }
  if (endOfLife.reusability !== undefined) {
    const dp = createDataPoint({}, "Reusability", "Reusability", "reusability");
    dp.reusability = endOfLife.reusability;
    dataPoint.push(dp);
  }
  if (endOfLife.repairability !== undefined) {
    const dp = createDataPoint({}, "Repairability", "Repairability", "repairability");
    dp.repairability = endOfLife.repairability;
    dataPoint.push(dp);
  }
  if (endOfLife.refurbrishability !== undefined) {
    const dp = createDataPoint({}, "Refurbrishability", "Refurbrishability", "refurbrishability");
    dp.refurbrishability = endOfLife.refurbrishability;
    dataPoint.push(dp);
  }
  if (endOfLife.upgradeOptions !== undefined) {
    const dp = createDataPoint({}, "UpgradeOptions", "Upgrade Options", "upgrade-options");
    dp.upgradeOptions = endOfLife.upgradeOptions;
    dataPoint.push(dp);
  }
  if (Array.isArray(endOfLife.endOfLifeHistory)) {
    const dp = createDataPoint({}, "EndOfLifeHistory", "End Of Life History", "end-of-life-history");
    dp.endOfLifeHistory = endOfLife.endOfLifeHistory.filter(isRecord).map((event) => transformEvent(event));
    dataPoint.push(dp);
  }
  if (endOfLife.numberOfLifecycles !== undefined) {
    const dp = createDataPoint({}, "NumberOfLifecycles", "Number Of Lifecycles", "number-of-lifecycles");
    dp.numberOfLifecycles = endOfLife.numberOfLifecycles;
    dataPoint.push(dp);
  }
  if (isRecord(endOfLife.endOfLifeInformation)) {
    dataPoint.push(transformEndOfLifeInformation(endOfLife.endOfLifeInformation));
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformEndOfLifeInformation(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "EndOfLifeInformation", "End Of Life Information", "end-of-life-information");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}
