/**
 * TypeScript interfaces for the DPP Usage ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-usage.ttl
 */

import type { DataGroup, DataPoint, Event } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

/** A log of maintenance activities performed on the product. */
export interface MaintenanceLog extends DataPoint {
  maintenanceLog?: Event[];
}

/** A record of the product's usage history over time. */
export interface UsageHistory extends DataPoint {
  usageHistory?: Event[];
}

/** A record of incidents and errors that occurred with the product. */
export interface IncidentsAndErrors extends DataPoint {
  incidentsAndErrors?: Event[];
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** Usage history, maintenance, and incident tracking for the product. */
export interface UsageInformation extends DataGroup {
  maintenanceLog?: MaintenanceLog;
  usageHistory?: UsageHistory;
  incidentsAndErrors?: IncidentsAndErrors;
}
