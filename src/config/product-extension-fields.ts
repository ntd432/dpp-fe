import { ELECTRONIC_EXTENSION_FIELDS } from "./electronics-extension-fields";

export type ExtensionSectionKey =
  | "sectorRequiredInformation"
  | "sectorNonRequiredInformation"
  | "productSpecification";

export type ExtensionFieldKind =
  | "text"
  | "textarea"
  | "measurement"
  | "select"
  | "number"
  | "date";

export interface ExtensionFieldDefinition {
  key: string;
  label: string;
  kind: ExtensionFieldKind;
  placeholder?: string;
  rows?: number;
  unitOptions?: string[];
  options?: Array<{ value: string; label: string }>;
}

export type ExtensionSectionGroups = Partial<
  Record<ExtensionSectionKey, Record<string, ExtensionFieldDefinition[]>>
>;

export const EXTENSION_SECTION_LABELS: Record<ExtensionSectionKey, string> = {
  sectorRequiredInformation: "Sector Required Information",
  sectorNonRequiredInformation: "Sector Non-Required Information",
  productSpecification: "Product Specification",
};

export const EXTENSION_FIELD_CONFIG: Record<string, ExtensionSectionGroups> = {
  ElectronicExtension: ELECTRONIC_EXTENSION_FIELDS,
};