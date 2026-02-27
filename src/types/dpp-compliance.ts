import type {
  CertificationInfo,
  DataGroup,
  DataPoint,
  Legislation,
  NamedItem,
} from "./dpp-core";

// ── Data Points ─────────────────────────────────────────────────────────────

/** Applicable regulations and legislation the product must comply with. */
export interface Regulation extends DataPoint {
  regulation?: Legislation;
}

/** Eco-labels, energy labels, or other regulatory labels assigned to the product. */
export interface Label extends DataPoint {
  label?: NamedItem;
}

/** Assessment of the product status (e.g. new, refurbished, remanufactured). */
export interface ProductStatusAssessment extends DataPoint {
  productStatusAssessment?: NamedItem;
}

/** Certifications obtained by the product (e.g. CE marking, ISO standards). */
export interface Certification extends DataPoint {
  certification?: CertificationInfo;
}

/** Method used to manage, store, and share the DPP data. */
export interface DataManagementMethod extends DataPoint {
  dataManagementMethod?: NamedItem;
}

// ── Data Group ──────────────────────────────────────────────────────────────

/** Data group covering regulatory compliance, certifications, labels, and data management. */
export interface Compliance extends DataGroup {
  regulation?: Regulation;
  label?: Label;
  productStatusAssessment?: ProductStatusAssessment;
  certification?: Certification;
  dataManagementMethod?: DataManagementMethod;
}
