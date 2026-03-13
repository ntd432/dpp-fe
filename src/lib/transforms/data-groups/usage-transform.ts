import { createDataPoint, createNode, isRecord, transformEvent } from "../shared";

interface EventArrayFieldConfig {
  key: string;
  type: string;
  label: string;
  idPrefix: string;
}

const EVENT_ARRAY_FIELDS: EventArrayFieldConfig[] = [
  {
    key: "maintenanceLog",
    type: "MaintenanceLog",
    label: "Maintenance Log",
    idPrefix: "maintenance-log",
  },
  {
    key: "usageHistory",
    type: "UsageHistory",
    label: "Usage History",
    idPrefix: "usage-history",
  },
  {
    key: "incidentsAndErrors",
    type: "IncidentsAndErrors",
    label: "Incidents And Errors",
    idPrefix: "incidents-errors",
  },
];

export function transformUsageInformation(usage: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(usage, "UsageInformation", "Usage Information", "usage-information");
  const dataPoint: Record<string, unknown>[] = [];

  for (const field of EVENT_ARRAY_FIELDS) {
    const value = usage[field.key];
    if (!Array.isArray(value)) {
      continue;
    }

    const dp = createDataPoint({}, field.type, field.label, field.idPrefix);
    dp[field.key] = value.filter(isRecord).map((event) => transformEvent(event));
    dataPoint.push(dp);
  }

  result.dataPoint = dataPoint;
  return result;
}
