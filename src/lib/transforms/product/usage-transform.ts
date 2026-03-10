import { createDataPoint, createNode, isRecord, transformEvent } from "./shared";

export function transformUsageInformation(usage: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(usage, "UsageInformation", "Usage Information", "usage-information");
  const dataPoint: Record<string, unknown>[] = [];

  if (Array.isArray(usage.maintenanceLog)) {
    const dp = createDataPoint({}, "MaintenanceLog", "Maintenance Log", "maintenance-log");
    dp.maintenanceLog = usage.maintenanceLog.filter(isRecord).map((event) => transformEvent(event));
    dataPoint.push(dp);
  }
  if (Array.isArray(usage.usageHistory)) {
    const dp = createDataPoint({}, "UsageHistory", "Usage History", "usage-history");
    dp.usageHistory = usage.usageHistory.filter(isRecord).map((event) => transformEvent(event));
    dataPoint.push(dp);
  }
  if (Array.isArray(usage.incidentsAndErrors)) {
    const dp = createDataPoint({}, "IncidentsAndErrors", "Incidents And Errors", "incidents-errors");
    dp.incidentsAndErrors = usage.incidentsAndErrors.filter(isRecord).map((event) => transformEvent(event));
    dataPoint.push(dp);
  }

  result.dataPoint = dataPoint;
  return result;
}
