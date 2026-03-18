/**
 * TypeScript interfaces for the DPP Compliance ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-compliance.ttl
 */

import type { Certification, Legislation } from "./dpp-core";

export interface Label {
  labelName?: string;
  labelDescription?: string;
  labelValue?: string;
  /** URI to documentation of the label */
  labelDocumentation?: string;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface Compliance {
  regulation?: Legislation[];
  productLabel?: Label[];
  productStatusAssessment?: string;
  certification?: Certification[];
  dataManagementMethod?: Legislation;
}
