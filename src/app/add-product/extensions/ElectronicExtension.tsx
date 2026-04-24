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
  const value = form?.[key];
  if (value !== undefined) {
    return value as ElectronicExtensionFormState[K];
  }
  const directValue = form[key];
  if (directValue !== undefined) {
    return directValue as ElectronicExtensionFormState[K];
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

export function createElectronicExtensionFormState(): ElectronicExtensionFormState {
  return {
    sectorRequiredAssemblyDesc: "",
    sectorRequiredAssemblyAutomationLevel: "",
    sectorRequiredAssemblyLocationName: "",
    sectorRequiredAssemblyLocationAddress: "",
    sectorRequiredProductionDesc: "",
    sectorRequiredManufacturingTechnology: "",
    sectorRequiredProcessCertification: "",
    sectorNonRequiredExpectedEndCondition: "",
    sectorNonRequiredRenewableEnergyProductionValue: "",
    sectorNonRequiredRenewableEnergyType: "",
    sectorNonRequiredRenewableEnergyOutput: { value: "", unit: "", customUnit: "" },
    sectorNonRequiredSeparabilityScore: "",
    sectorNonRequiredSeparabilityMethod: "",
    sectorNonRequiredModularityScore: "",
    sectorNonRequiredReplaceableComponent: "",
    sectorNonRequiredProductDesign: "",
    sectorNonRequiredDesignForDisassembly: "",
    sectorNonRequiredAppliedStandardName: "",
    sectorNonRequiredAppliedStandardIdentifier: "",
    sectorNonRequiredStandardReference: "",
    specHeight: { value: "", unit: "", customUnit: "" },
    specWidth: { value: "", unit: "", customUnit: "" },
    specDepth: { value: "", unit: "", customUnit: "" },
    specWeight: { value: "", unit: "", customUnit: "" },
    specIngressProtection: "",
    specNetworkConnectivity: "",
    specBatteryCapacity: { value: "", unit: "", customUnit: "" },
    specVolume: { value: "", unit: "", customUnit: "" },
    specChargingInterface: "",
    specCrossCompatibilityDetails: "",
    specCompatibleInterfaceStandard: "",
    specCompatibilityLevel: "",
    specComponentDescription: "",
    specComponentCount: "",
    specInstalledSoftwareName: "",
    specInstalledSoftwareVersion: "",
    specSoftwareSupportEndDate: "",
  };
}

export interface ElectronicExtensionFormState {
  sectorRequiredAssemblyDesc: string;
  sectorRequiredAssemblyAutomationLevel: string;
  sectorRequiredAssemblyLocationName: string;
  sectorRequiredAssemblyLocationAddress: string;
  sectorRequiredProductionDesc: string;
  sectorRequiredManufacturingTechnology: string;
  sectorRequiredProcessCertification: string;
  sectorNonRequiredExpectedEndCondition: string;
  sectorNonRequiredRenewableEnergyProductionValue: string;
  sectorNonRequiredRenewableEnergyType: string;
  sectorNonRequiredRenewableEnergyOutput: MeasurementValue;
  sectorNonRequiredSeparabilityScore: string;
  sectorNonRequiredSeparabilityMethod: string;
  sectorNonRequiredModularityScore: string;
  sectorNonRequiredReplaceableComponent: string;
  sectorNonRequiredProductDesign: string;
  sectorNonRequiredDesignForDisassembly: string;
  sectorNonRequiredAppliedStandardName: string;
  sectorNonRequiredAppliedStandardIdentifier: string;
  sectorNonRequiredStandardReference: string;
  specHeight: MeasurementValue;
  specWidth: MeasurementValue;
  specDepth: MeasurementValue;
  specWeight: MeasurementValue;
  specIngressProtection: string;
  specNetworkConnectivity: string;
  specBatteryCapacity: MeasurementValue;
  specVolume: MeasurementValue;
  specChargingInterface: string;
  specCrossCompatibilityDetails: string;
  specCompatibleInterfaceStandard: string;
  specCompatibilityLevel: string;
  specComponentDescription: string;
  specComponentCount: string;
  specInstalledSoftwareName: string;
  specInstalledSoftwareVersion: string;
  specSoftwareSupportEndDate: string;
}