/**
 * TypeScript interfaces for the DPP Compliance ontology module.
 * @see https://ntd432.github.io/dpp/models/dpp-compliance.ttl
 */

import type { Certification, Legislation } from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

export interface Regulation {
  regulation?: Legislation;
}

export interface ProductLabel {
  productLabel?: Label | Label[];
}

export interface Label {
  labelName?: string;
  labelDescription?: string;
  labelValue?: string;
  /** URI to documentation of the label */
  labelDocumentation?: string;
}

export interface ProductStatusAssessment {
  productStatusAssessment?: string;
}

export interface DataManagementMethod {
  dataManagementMethod?: Legislation;
}

// ── Data Group ──────────────────────────────────────────────────────────────

export interface Compliance {
  regulation?: Legislation;
  productLabel?: Label[];
  productStatusAssessment?: string;
  certification?: Certification[];
  dataManagementMethod?: Legislation;
}
