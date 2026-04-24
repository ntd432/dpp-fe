import { ExtensionSectionGroups } from "@/config/product-extension-fields";
import { BATTERY_UNITS, LENGTH_UNITS, MASS_UNITS, ENERGY_OUTPUT_UNITS, VOLUME_UNITS } from "../../../config/master-data";
import {
  ExtensionPayload,
  ExtensionPayloadBuildDependencies,
  FormState,
  MeasurementValue,
} from "../InputInterfaces";

function resolveElectronicField<K extends keyof ElectronicExtensionFormState>(
  form: FormState,
  key: K,
): ElectronicExtensionFormState[K] {
  const extensionValue = form.extensionData.ElectronicExtension?.[key];
  if (extensionValue !== undefined) {
    return extensionValue as ElectronicExtensionFormState[K];
  }

  const value = form[key];
  if (value !== undefined) {
    return value as ElectronicExtensionFormState[K];
  }

  return createElectronicExtensionFormState()[key];
}

export function buildElectronicExtensionPayload(
  form: FormState,
  { toBoolean, toMeasurementEntry, toValueUnitObject }: ExtensionPayloadBuildDependencies,
): ExtensionPayload {
  const sectorRequiredAssemblyDesc = resolveElectronicField(form, "sectorRequiredAssemblyDesc");
  const sectorRequiredAssemblyAutomationLevel = resolveElectronicField(
    form,
    "sectorRequiredAssemblyAutomationLevel",
  );
  const sectorRequiredAssemblyLocationName = resolveElectronicField(
    form,
    "sectorRequiredAssemblyLocationName",
  );
  const sectorRequiredAssemblyLocationAddress = resolveElectronicField(
    form,
    "sectorRequiredAssemblyLocationAddress",
  );
  const sectorRequiredProductionDesc = resolveElectronicField(form, "sectorRequiredProductionDesc");
  const sectorRequiredManufacturingTechnology = resolveElectronicField(
    form,
    "sectorRequiredManufacturingTechnology",
  );
  const sectorRequiredProcessCertification = resolveElectronicField(
    form,
    "sectorRequiredProcessCertification",
  );
  const sectorNonRequiredExpectedEndCondition = resolveElectronicField(
    form,
    "sectorNonRequiredExpectedEndCondition",
  );
  const sectorNonRequiredRenewableEnergyProductionValue = resolveElectronicField(
    form,
    "sectorNonRequiredRenewableEnergyProductionValue",
  );
  const sectorNonRequiredRenewableEnergyType = resolveElectronicField(
    form,
    "sectorNonRequiredRenewableEnergyType",
  );
  const sectorNonRequiredRenewableEnergyOutput = resolveElectronicField(
    form,
    "sectorNonRequiredRenewableEnergyOutput",
  );
  const sectorNonRequiredSeparabilityScore = resolveElectronicField(
    form,
    "sectorNonRequiredSeparabilityScore",
  );
  const sectorNonRequiredSeparabilityMethod = resolveElectronicField(
    form,
    "sectorNonRequiredSeparabilityMethod",
  );
  const sectorNonRequiredModularityScore = resolveElectronicField(
    form,
    "sectorNonRequiredModularityScore",
  );
  const sectorNonRequiredReplaceableComponent = resolveElectronicField(
    form,
    "sectorNonRequiredReplaceableComponent",
  );
  const sectorNonRequiredProductDesign = resolveElectronicField(
    form,
    "sectorNonRequiredProductDesign",
  );
  const sectorNonRequiredDesignForDisassembly = resolveElectronicField(
    form,
    "sectorNonRequiredDesignForDisassembly",
  );
  const sectorNonRequiredAppliedStandardName = resolveElectronicField(
    form,
    "sectorNonRequiredAppliedStandardName",
  );
  const sectorNonRequiredAppliedStandardIdentifier = resolveElectronicField(
    form,
    "sectorNonRequiredAppliedStandardIdentifier",
  );
  const sectorNonRequiredStandardReference = resolveElectronicField(
    form,
    "sectorNonRequiredStandardReference",
  );
  const specHeight = resolveElectronicField(form, "specHeight");
  const specWidth = resolveElectronicField(form, "specWidth");
  const specDepth = resolveElectronicField(form, "specDepth");
  const specWeight = resolveElectronicField(form, "specWeight");
  const specIngressProtection = resolveElectronicField(form, "specIngressProtection");
  const specNetworkConnectivity = resolveElectronicField(form, "specNetworkConnectivity");
  const specBatteryCapacity = resolveElectronicField(form, "specBatteryCapacity");
  const specVolume = resolveElectronicField(form, "specVolume");
  const specChargingInterface = resolveElectronicField(form, "specChargingInterface");
  const specCrossCompatibilityDetails = resolveElectronicField(
    form,
    "specCrossCompatibilityDetails",
  );
  const specCompatibleInterfaceStandard = resolveElectronicField(
    form,
    "specCompatibleInterfaceStandard",
  );
  const specCompatibilityLevel = resolveElectronicField(form, "specCompatibilityLevel");
  const specInstalledSoftwareName = resolveElectronicField(form, "specInstalledSoftwareName");
  const specInstalledSoftwareVersion = resolveElectronicField(
    form,
    "specInstalledSoftwareVersion",
  );
  const specSoftwareSupportEndDate = resolveElectronicField(
    form,
    "specSoftwareSupportEndDate",
  );

  return {
    sectorRequiredInformation: {
      extensionType: form.sectorType,
      assemblyProcess: {
        assemblyProcessDescription: sectorRequiredAssemblyDesc,
        assemblyAutomationLevel: sectorRequiredAssemblyAutomationLevel,
        assemblyLocation: {
          name: sectorRequiredAssemblyLocationName,
          address: sectorRequiredAssemblyLocationAddress,
        },
      },
      productionMethod: {
        productionMethodDescription: sectorRequiredProductionDesc,
        manufacturingTechnology: sectorRequiredManufacturingTechnology,
        processCertification: sectorRequiredProcessCertification,
      },
    },
    sectorNonRequiredInformation: {
      extensionType: form.sectorType,
      expectedEndConditionInfo: {
        expectedEndCondition: sectorNonRequiredExpectedEndCondition,
      },
      renewableEnergyProductionInfo: {
        renewableEnergyProductionValue: toBoolean(sectorNonRequiredRenewableEnergyProductionValue),
        renewableEnergyType: sectorNonRequiredRenewableEnergyType,
        ...toValueUnitObject(
          sectorNonRequiredRenewableEnergyOutput,
          "renewableEnergyOutput",
          "renewableEnergyOutputUnit",
        ),
      },
      materialSeparability: {
        separabilityScore: sectorNonRequiredSeparabilityScore
          ? Number(sectorNonRequiredSeparabilityScore)
          : "",
        separabilityMethod: sectorNonRequiredSeparabilityMethod,
      },
      componentModularity: {
        modularityScore: sectorNonRequiredModularityScore
          ? Number(sectorNonRequiredModularityScore)
          : "",
        replaceableComponent: sectorNonRequiredReplaceableComponent,
      },
      productDesignInfo: {
        productDesign: sectorNonRequiredProductDesign,
        designForDisassembly: toBoolean(sectorNonRequiredDesignForDisassembly),
      },
      appliedStandardsAndNorms: {
        appliedStandard: {
          name: sectorNonRequiredAppliedStandardName,
          identifier: sectorNonRequiredAppliedStandardIdentifier,
        },
        standardReference: sectorNonRequiredStandardReference,
      },
    },
    productSpecification: {
      extensionType: form.sectorType,
      height: toMeasurementEntry(specHeight),
      width: toMeasurementEntry(specWidth),
      depth: toMeasurementEntry(specDepth),
      weight: toMeasurementEntry(specWeight),
      ingressProtection: specIngressProtection,
      networkConnectivity: specNetworkConnectivity,
      batteryCapacity: toMeasurementEntry(specBatteryCapacity),
      volume: toMeasurementEntry(specVolume),
      chargingInterface: specChargingInterface,
      crossCompatibility: {
        crossCompatibilityDetails: specCrossCompatibilityDetails,
        compatibleInterfaceStandard: specCompatibleInterfaceStandard,
        compatibilityLevel: specCompatibilityLevel,
      },
      installedSoftware: {
        installedSoftwareName: specInstalledSoftwareName,
        installedSoftwareVersion: specInstalledSoftwareVersion,
        softwareSupportEndDate: specSoftwareSupportEndDate,
      },
    },
  };
}

export const ELECTRONIC_EXTENSION_FIELDS = {
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
      {
        key: "specVolume",
        label: "Volume",
        kind: "measurement",
        unitOptions: VOLUME_UNITS,
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
} as const satisfies ExtensionSectionGroups;

type Values<T> = T[keyof T];

type ElectronicExtensionFieldDefinition = Values<{
  [S in keyof typeof ELECTRONIC_EXTENSION_FIELDS]:
    (typeof ELECTRONIC_EXTENSION_FIELDS)[S] extends Record<string, readonly unknown[]>
      ? Values<(typeof ELECTRONIC_EXTENSION_FIELDS)[S]>[number]
      : never;
}>;

type ElectronicExtensionFieldKey = ElectronicExtensionFieldDefinition["key"];
type ElectronicMeasurementFieldKey = Extract<
  ElectronicExtensionFieldDefinition,
  { kind: "measurement" }
>["key"];

export type ElectronicExtensionFormState = {
  [K in ElectronicExtensionFieldKey]:
    K extends ElectronicMeasurementFieldKey ? MeasurementValue : string;
};

const EMPTY_MEASUREMENT: MeasurementValue = { value: "", unit: "", customUnit: "" };

export function createElectronicExtensionFormState(): ElectronicExtensionFormState {
  const state = {} as ElectronicExtensionFormState;

  const fieldDefinitions = Object.values(ELECTRONIC_EXTENSION_FIELDS).flatMap((section) =>
    Object.values(section ?? {}).flat(),
  ) as ElectronicExtensionFieldDefinition[];

  for (const field of fieldDefinitions) {
    const key = field.key as ElectronicExtensionFieldKey;
    (state as Record<string, unknown>)[key] =
      field.kind === "measurement" ? { ...EMPTY_MEASUREMENT } : "";
  }

  return state;
}