/**
 * TypeScript interfaces for the DPP Usage ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-usage.ttl
 */

import type { Event } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

export interface MaintenanceLog {
  maintenanceLog?: Event[];
}

export interface UsageHistory {
  usageHistory?: Event[];
}

export interface IncidentsAndErrors {
  incidentsAndErrors?: Event[];
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface UsageInformation {
  maintenanceLog?: Event[];
  usageHistory?: Event[];
  incidentsAndErrors?: Event[];
}
