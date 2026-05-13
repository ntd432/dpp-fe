/**
 * Sector config shared across add-product and add-dpp screens.
 * The `extensionType` value matches the key used in EXTENSION_FIELD_CONFIG.
 */
export interface SectorOption {
  /** Human-readable label shown in dropdowns */
  label: string;
  /** Value stored in the payload (e.g. as productSector or extensionType) */
  value: string;
  /** Corresponding extensionType key in EXTENSION_FIELD_CONFIG */
  extensionType: string;
}

export const SECTORS: SectorOption[] = [
  {
    label: "sectors.electronics",
    value: "Electronics",
    extensionType: "ElectronicExtension",
  },
  {
    label: "sectors.others",
    value: "Others",
    extensionType: "OtherExtension",
  }
];

/** Lookup map: sector value → extensionType */
export const SECTOR_EXTENSION_TYPE: Record<string, string> = Object.fromEntries(
  SECTORS.map((s) => [s.value, s.extensionType]),
);

/** Lookup map: extensionType → sector value */
export const EXTENSION_TYPE_TO_SECTOR: Record<string, string> = Object.fromEntries(
  SECTORS.map((s) => [s.extensionType, s.value]),
);
