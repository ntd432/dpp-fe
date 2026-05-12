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

// Translation keys for Electronic Extension fields
const ELECTRONIC_GROUP_KEYS = {
  ASSEMBLY_PROCESS: "extensions.electronic.groups.assemblyProcess",
  PRODUCTION_METHOD: "extensions.electronic.groups.productionMethod",
  PHYSICAL_MEASUREMENTS: "extensions.electronic.groups.physicalMeasurements",
  TECHNICAL_SPECIFICATIONS: "extensions.electronic.groups.technicalSpecifications",
  CROSS_COMPATIBILITY: "extensions.electronic.groups.crossCompatibility",
  INSTALLED_SOFTWARE: "extensions.electronic.groups.installedSoftware",
  EXPECTED_END_CONDITION: "extensions.electronic.groups.expectedEndCondition",
  RENEWABLE_ENERGY_PRODUCTION: "extensions.electronic.groups.renewableEnergyProduction",
  MATERIAL_SEPARABILITY: "extensions.electronic.groups.materialSeparability",
  COMPONENT_MODULARITY: "extensions.electronic.groups.componentModularity",
  PRODUCT_DESIGN: "extensions.electronic.groups.productDesign",
  APPLIED_STANDARDS_AND_NORMS: "extensions.electronic.groups.appliedStandardsAndNorms",
} as const;

const ELECTRONIC_FIELD_KEYS = {
  ASSEMBLY_DESC: "extensions.electronic.fields.assemblyProcessDescription",
  ASSEMBLY_AUTOMATION_LEVEL: "extensions.electronic.fields.assemblyAutomationLevel",
  ASSEMBLY_LOCATION_NAME: "extensions.electronic.fields.assemblyLocationName",
  ASSEMBLY_LOCATION_ADDRESS: "extensions.electronic.fields.assemblyLocationAddress",
  PRODUCTION_DESC: "extensions.electronic.fields.productionMethodDescription",
  MANUFACTURING_TECHNOLOGY: "extensions.electronic.fields.manufacturingTechnology",
  PROCESS_CERTIFICATION: "extensions.electronic.fields.processCertification",
  HEIGHT: "extensions.electronic.fields.height",
  WIDTH: "extensions.electronic.fields.width",
  DEPTH: "extensions.electronic.fields.depth",
  WEIGHT: "extensions.electronic.fields.weight",
  BATTERY_CAPACITY: "extensions.electronic.fields.batteryCapacity",
  VOLUME: "extensions.electronic.fields.volume",
  INGRESS_PROTECTION: "extensions.electronic.fields.ingressProtection",
  NETWORK_CONNECTIVITY: "extensions.electronic.fields.networkConnectivity",
  CHARGING_INTERFACE: "extensions.electronic.fields.chargingInterface",
  CROSS_COMPATIBILITY_DETAILS: "extensions.electronic.fields.crossCompatibilityDetails",
  COMPATIBLE_INTERFACE_STANDARD: "extensions.electronic.fields.compatibleInterfaceStandard",
  COMPATIBILITY_LEVEL: "extensions.electronic.fields.compatibilityLevel",
  INSTALLED_SOFTWARE_NAME: "extensions.electronic.fields.installedSoftwareName",
  INSTALLED_SOFTWARE_VERSION: "extensions.electronic.fields.installedSoftwareVersion",
  SOFTWARE_SUPPORT_END_DATE: "extensions.electronic.fields.softwareSupportEndDate",
  EXPECTED_END_CONDITION: "extensions.electronic.fields.expectedEndCondition",
  RENEWABLE_ENERGY_PRODUCTION_VALUE: "extensions.electronic.fields.producesRenewableEnergy",
  RENEWABLE_ENERGY_TYPE: "extensions.electronic.fields.renewableEnergyType",
  RENEWABLE_ENERGY_OUTPUT: "extensions.electronic.fields.renewableEnergyOutput",
  SEPARABILITY_SCORE: "extensions.electronic.fields.separabilityScore",
  SEPARABILITY_METHOD: "extensions.electronic.fields.separabilityMethod",
  MODULARITY_SCORE: "extensions.electronic.fields.modularityScore",
  REPLACEABLE_COMPONENT: "extensions.electronic.fields.replaceableComponent",
  PRODUCT_DESIGN: "extensions.electronic.fields.productDesign",
  DESIGN_FOR_DISASSEMBLY: "extensions.electronic.fields.designedForDisassembly",
  APPLIED_STANDARD_NAME: "extensions.electronic.fields.appliedStandardName",
  APPLIED_STANDARD_IDENTIFIER: "extensions.electronic.fields.appliedStandardIdentifier",
  STANDARD_REFERENCE: "extensions.electronic.fields.standardReference",
} as const;

export const ELECTRONIC_EXTENSION_FIELDS = {
  sectorRequiredInformation: {
    [ELECTRONIC_GROUP_KEYS.ASSEMBLY_PROCESS]: [
      {
        key: "sectorRequiredAssemblyDesc",
        label: ELECTRONIC_FIELD_KEYS.ASSEMBLY_DESC,
        kind: "textarea",
      },
      {
        key: "sectorRequiredAssemblyAutomationLevel",
        label: ELECTRONIC_FIELD_KEYS.ASSEMBLY_AUTOMATION_LEVEL,
        kind: "select",
        options: [
          { value: "manual", label: "extensions.electronic.options.manual" },
          { value: "semi-automated", label: "extensions.electronic.options.semiAutomated" },
          { value: "automated", label: "extensions.electronic.options.automated" },
        ],
      },
      {
        key: "sectorRequiredAssemblyLocationName",
        label: ELECTRONIC_FIELD_KEYS.ASSEMBLY_LOCATION_NAME,
        kind: "text",
      },
      {
        key: "sectorRequiredAssemblyLocationAddress",
        label: ELECTRONIC_FIELD_KEYS.ASSEMBLY_LOCATION_ADDRESS,
        kind: "text",
      },
    ],
    [ELECTRONIC_GROUP_KEYS.PRODUCTION_METHOD]: [
      {
        key: "sectorRequiredProductionDesc",
        label: ELECTRONIC_FIELD_KEYS.PRODUCTION_DESC,
        kind: "textarea",
      },
      {
        key: "sectorRequiredManufacturingTechnology",
        label: ELECTRONIC_FIELD_KEYS.MANUFACTURING_TECHNOLOGY,
        kind: "text",
      },
      {
        key: "sectorRequiredProcessCertification",
        label: ELECTRONIC_FIELD_KEYS.PROCESS_CERTIFICATION,
        kind: "text",
      },
    ],
  },
  productSpecification: {
    [ELECTRONIC_GROUP_KEYS.PHYSICAL_MEASUREMENTS]: [
      {
        key: "specHeight",
        label: ELECTRONIC_FIELD_KEYS.HEIGHT,
        kind: "measurement",
        unitOptions: LENGTH_UNITS,
      },
      {
        key: "specWidth",
        label: ELECTRONIC_FIELD_KEYS.WIDTH,
        kind: "measurement",
        unitOptions: LENGTH_UNITS,
      },
      {
        key: "specDepth",
        label: ELECTRONIC_FIELD_KEYS.DEPTH,
        kind: "measurement",
        unitOptions: LENGTH_UNITS,
      },
      {
        key: "specWeight",
        label: ELECTRONIC_FIELD_KEYS.WEIGHT,
        kind: "measurement",
        unitOptions: MASS_UNITS,
      },
      {
        key: "specBatteryCapacity",
        label: ELECTRONIC_FIELD_KEYS.BATTERY_CAPACITY,
        kind: "measurement",
        unitOptions: BATTERY_UNITS,
      },
      {
        key: "specVolume",
        label: ELECTRONIC_FIELD_KEYS.VOLUME,
        kind: "measurement",
        unitOptions: VOLUME_UNITS,
      },
    ],
    [ELECTRONIC_GROUP_KEYS.TECHNICAL_SPECIFICATIONS]: [
      {
        key: "specIngressProtection",
        label: ELECTRONIC_FIELD_KEYS.INGRESS_PROTECTION,
        kind: "text",
        placeholder: "e.g., IP68",
      },
      {
        key: "specNetworkConnectivity",
        label: ELECTRONIC_FIELD_KEYS.NETWORK_CONNECTIVITY,
        kind: "text",
        placeholder: "e.g., 5G",
      },
      {
        key: "specChargingInterface",
        label: ELECTRONIC_FIELD_KEYS.CHARGING_INTERFACE,
        kind: "text",
        placeholder: "e.g., USB-C",
      },
    ],
    [ELECTRONIC_GROUP_KEYS.CROSS_COMPATIBILITY]: [
      {
        key: "specCrossCompatibilityDetails",
        label: ELECTRONIC_FIELD_KEYS.CROSS_COMPATIBILITY_DETAILS,
        kind: "textarea",
      },
      {
        key: "specCompatibleInterfaceStandard",
        label: ELECTRONIC_FIELD_KEYS.COMPATIBLE_INTERFACE_STANDARD,
        kind: "text",
      },
      {
        key: "specCompatibilityLevel",
        label: ELECTRONIC_FIELD_KEYS.COMPATIBILITY_LEVEL,
        kind: "select",
        options: [
          { value: "full", label: "extensions.electronic.options.full" },
          { value: "partial", label: "extensions.electronic.options.partial" },
          { value: "conditional", label: "extensions.electronic.options.conditional" },
        ],
      },
    ],
    [ELECTRONIC_GROUP_KEYS.INSTALLED_SOFTWARE]: [
      {
        key: "specInstalledSoftwareName",
        label: ELECTRONIC_FIELD_KEYS.INSTALLED_SOFTWARE_NAME,
        kind: "text",
      },
      {
        key: "specInstalledSoftwareVersion",
        label: ELECTRONIC_FIELD_KEYS.INSTALLED_SOFTWARE_VERSION,
        kind: "text",
      },
      {
        key: "specSoftwareSupportEndDate",
        label: ELECTRONIC_FIELD_KEYS.SOFTWARE_SUPPORT_END_DATE,
        kind: "date",
      },
    ],
  },
  sectorNonRequiredInformation: {
    [ELECTRONIC_GROUP_KEYS.EXPECTED_END_CONDITION]: [
      {
        key: "sectorNonRequiredExpectedEndCondition",
        label: ELECTRONIC_FIELD_KEYS.EXPECTED_END_CONDITION,
        kind: "select",
        options: [
          { value: "reusable", label: "extensions.electronic.options.reusable" },
          { value: "refurbishable", label: "extensions.electronic.options.refurbishable" },
          { value: "remanufacturable", label: "extensions.electronic.options.remanufacturable" },
          { value: "recyclable", label: "extensions.electronic.options.recyclable" },
          { value: "disposal-only", label: "extensions.electronic.options.disposalOnly" },
        ],
      },
    ],
    [ELECTRONIC_GROUP_KEYS.RENEWABLE_ENERGY_PRODUCTION]: [
      {
        key: "sectorNonRequiredRenewableEnergyProductionValue",
        label: ELECTRONIC_FIELD_KEYS.RENEWABLE_ENERGY_PRODUCTION_VALUE,
        kind: "select",
        options: [
          { value: "true", label: "extensions.common.yes" },
          { value: "false", label: "extensions.common.no" },
        ],
      },
      {
        key: "sectorNonRequiredRenewableEnergyType",
        label: ELECTRONIC_FIELD_KEYS.RENEWABLE_ENERGY_TYPE,
        kind: "text",
      },
      {
        key: "sectorNonRequiredRenewableEnergyOutput",
        label: ELECTRONIC_FIELD_KEYS.RENEWABLE_ENERGY_OUTPUT,
        kind: "measurement",
        unitOptions: ENERGY_OUTPUT_UNITS,
      },
    ],
    [ELECTRONIC_GROUP_KEYS.MATERIAL_SEPARABILITY]: [
      {
        key: "sectorNonRequiredSeparabilityScore",
        label: ELECTRONIC_FIELD_KEYS.SEPARABILITY_SCORE,
        kind: "number",
      },
      {
        key: "sectorNonRequiredSeparabilityMethod",
        label: ELECTRONIC_FIELD_KEYS.SEPARABILITY_METHOD,
        kind: "text",
      },
    ],
    [ELECTRONIC_GROUP_KEYS.COMPONENT_MODULARITY]: [
      {
        key: "sectorNonRequiredModularityScore",
        label: ELECTRONIC_FIELD_KEYS.MODULARITY_SCORE,
        kind: "number",
      },
      {
        key: "sectorNonRequiredReplaceableComponent",
        label: ELECTRONIC_FIELD_KEYS.REPLACEABLE_COMPONENT,
        kind: "text",
      },
    ],
    [ELECTRONIC_GROUP_KEYS.PRODUCT_DESIGN]: [
      {
        key: "sectorNonRequiredProductDesign",
        label: ELECTRONIC_FIELD_KEYS.PRODUCT_DESIGN,
        kind: "textarea",
      },
      {
        key: "sectorNonRequiredDesignForDisassembly",
        label: ELECTRONIC_FIELD_KEYS.DESIGN_FOR_DISASSEMBLY,
        kind: "select",
        options: [
          { value: "true", label: "extensions.common.yes" },
          { value: "false", label: "extensions.common.no" },
        ],
      },
    ],
    [ELECTRONIC_GROUP_KEYS.APPLIED_STANDARDS_AND_NORMS]: [
      {
        key: "sectorNonRequiredAppliedStandardName",
        label: ELECTRONIC_FIELD_KEYS.APPLIED_STANDARD_NAME,
        kind: "text",
      },
      {
        key: "sectorNonRequiredAppliedStandardIdentifier",
        label: ELECTRONIC_FIELD_KEYS.APPLIED_STANDARD_IDENTIFIER,
        kind: "text",
      },
      {
        key: "sectorNonRequiredStandardReference",
        label: ELECTRONIC_FIELD_KEYS.STANDARD_REFERENCE,
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