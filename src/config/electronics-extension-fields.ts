import { BATTERY_UNITS, LENGTH_UNITS, MASS_UNITS, ENERGY_OUTPUT_UNITS } from "./master-data";
import { ExtensionSectionGroups } from "./product-extension-fields";

export const ELECTRONIC_EXTENSION_FIELDS: ExtensionSectionGroups = {
  sectorRequiredInformation: {
    "Assembly Process": [
      {
        key: "sectorRequiredAssemblyDesc",
        label: "Assembly Process Description",
        kind: "textarea",
      },
      {
        key: "sectorRequiredAssemblyAutomationLevel",
        label: "Assembly Automation Level",
        kind: "select",
        options: [
          { value: "manual", label: "Manual" },
          { value: "semi-automated", label: "Semi-automated" },
          { value: "automated", label: "Automated" },
        ],
      },
      {
        key: "sectorRequiredAssemblyLocationName",
        label: "Assembly Location Name",
        kind: "text",
      },
      {
        key: "sectorRequiredAssemblyLocationAddress",
        label: "Assembly Location Address",
        kind: "text",
      },
    ],
    "Production Method": [
      {
        key: "sectorRequiredProductionDesc",
        label: "Production Method Description",
        kind: "textarea",
      },
      {
        key: "sectorRequiredManufacturingTechnology",
        label: "Manufacturing Technology",
        kind: "text",
      },
      {
        key: "sectorRequiredProcessCertification",
        label: "Process Certification",
        kind: "text",
      },
    ],
  },
  productSpecification: {
    "Physical Measurements": [
      {
        key: "specHeight",
        label: "Height",
        kind: "measurement",
        unitOptions: LENGTH_UNITS,
      },
      {
        key: "specWidth",
        label: "Width",
        kind: "measurement",
        unitOptions: LENGTH_UNITS,
      },
      {
        key: "specDepth",
        label: "Depth",
        kind: "measurement",
        unitOptions: LENGTH_UNITS,
      },
      {
        key: "specWeight",
        label: "Weight",
        kind: "measurement",
        unitOptions: MASS_UNITS,
      },
      {
        key: "specBatteryCapacity",
        label: "Battery Capacity",
        kind: "measurement",
        unitOptions: BATTERY_UNITS,
      },
    ],
    "Technical Specifications": [
      {
        key: "specIngressProtection",
        label: "Ingress Protection",
        kind: "text",
        placeholder: "e.g., IP68",
      },
      {
        key: "specNetworkConnectivity",
        label: "Network Connectivity",
        kind: "text",
        placeholder: "e.g., 5G",
      },
      {
        key: "specChargingInterface",
        label: "Charging Interface",
        kind: "text",
        placeholder: "e.g., USB-C",
      },
    ],
    "Cross Compatibility": [
      {
        key: "specCrossCompatibilityDetails",
        label: "Cross Compatibility Details",
        kind: "textarea",
      },
      {
        key: "specCompatibleInterfaceStandard",
        label: "Compatible Interface Standard",
        kind: "text",
      },
      {
        key: "specCompatibilityLevel",
        label: "Compatibility Level",
        kind: "select",
        options: [
          { value: "full", label: "Full" },
          { value: "partial", label: "Partial" },
          { value: "conditional", label: "Conditional" },
        ],
      },
    ],
    "Installed Software": [
      {
        key: "specInstalledSoftwareName",
        label: "Installed Software Name",
        kind: "text",
      },
      {
        key: "specInstalledSoftwareVersion",
        label: "Installed Software Version",
        kind: "text",
      },
      {
        key: "specSoftwareSupportEndDate",
        label: "Software Support End Date",
        kind: "date",
      },
    ],
  },
  sectorNonRequiredInformation: {
    General: [
      {
        key: "sectorNonRequiredInformationText",
        label: "Additional Sector Details",
        kind: "textarea",
      },
    ],
    "Expected End Condition": [
      {
        key: "sectorNonRequiredExpectedEndCondition",
        label: "Expected End Condition",
        kind: "select",
        options: [
          { value: "reusable", label: "Reusable" },
          { value: "refurbishable", label: "Refurbishable" },
          { value: "remanufacturable", label: "Remanufacturable" },
          { value: "recyclable", label: "Recyclable" },
          { value: "disposal-only", label: "Disposal-only" },
        ],
      },
    ],
    "Renewable Energy Production": [
      {
        key: "sectorNonRequiredRenewableEnergyProductionValue",
        label: "Produces Renewable Energy",
        kind: "select",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
      },
      {
        key: "sectorNonRequiredRenewableEnergyType",
        label: "Renewable Energy Type",
        kind: "text",
      },
      {
        key: "sectorNonRequiredRenewableEnergyOutput",
        label: "Renewable Energy Output",
        kind: "measurement",
        unitOptions: ENERGY_OUTPUT_UNITS,
      },
    ],
    "Material Separability": [
      {
        key: "sectorNonRequiredSeparabilityScore",
        label: "Separability Score",
        kind: "number",
      },
      {
        key: "sectorNonRequiredSeparabilityMethod",
        label: "Separability Method",
        kind: "text",
      },
    ],
    "Component Modularity": [
      {
        key: "sectorNonRequiredModularityScore",
        label: "Modularity Score",
        kind: "number",
      },
      {
        key: "sectorNonRequiredReplaceableComponent",
        label: "Replaceable Component",
        kind: "text",
      },
    ],
    "Product Design": [
      {
        key: "sectorNonRequiredProductDesign",
        label: "Product Design",
        kind: "textarea",
      },
      {
        key: "sectorNonRequiredDesignForDisassembly",
        label: "Designed for Disassembly",
        kind: "select",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
      },
    ],
    "Applied Standards and Norms": [
      {
        key: "sectorNonRequiredAppliedStandardName",
        label: "Applied Standard Name",
        kind: "text",
      },
      {
        key: "sectorNonRequiredAppliedStandardIdentifier",
        label: "Applied Standard Identifier",
        kind: "text",
      },
      {
        key: "sectorNonRequiredStandardReference",
        label: "Standard Reference",
        kind: "text",
      },
    ],
  },
};