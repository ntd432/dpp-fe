import {
  copyUnhandledProperties,
  createNode,
  isRecord,
  transformMeasurementEntry,
  transformPlace,
} from "../shared";

interface NodeConfig {
  type: string;
  label: string;
  idPrefix: string;
}

const SIMPLE_OBJECT_FIELDS: Record<string, NodeConfig> = {
  crossCompatibility: {
    type: "CrossCompatibility",
    label: "Cross Compatibility",
    idPrefix: "cross-compatibility",
  },
  productionMethod: {
    type: "ProductionMethod",
    label: "Production Method",
    idPrefix: "production-method",
  },
  volume: {
    type: "Volume",
    label: "Volume",
    idPrefix: "volume",
  },
  components: {
    type: "Components",
    label: "Components",
    idPrefix: "components",
  },
  expectedEndConditionInfo: {
    type: "ExpectedEndCondition",
    label: "Expected End Condition",
    idPrefix: "expected-end-condition",
  },
  renewableEnergyProductionInfo: {
    type: "RenewableEnergyProduction",
    label: "Renewable Energy Production",
    idPrefix: "renewable-energy-production",
  },
  materialSeparability: {
    type: "MaterialSeparability",
    label: "Material Separability",
    idPrefix: "material-separability",
  },
  componentModularity: {
    type: "ComponentModularity",
    label: "Component Modularity",
    idPrefix: "component-modularity",
  },
  productDesignInfo: {
    type: "ProductDesign",
    label: "Product Design",
    idPrefix: "product-design",
  },
  installedSoftware: {
    type: "InstalledSoftware",
    label: "Installed Software",
    idPrefix: "installed-software",
  },
};

const MEASUREMENT_FIELDS = new Set(["height", "width", "depth", "weight", "batteryCapacity"]);

export function transformElectronicExtension(
  electronics: Record<string, unknown>,
  label: string,
  idPrefix: string,
  previousPredicate: string,
): Record<string, unknown> {
  const result = createNode(electronics, "ElectronicExtension", label, idPrefix);
  result.previousPredicate = previousPredicate;

  for (const [field, config] of Object.entries(SIMPLE_OBJECT_FIELDS)) {
    const value = electronics[field];
    if (isRecord(value)) {
      result[field] = transformSimpleNode(value, config);
    }
  }

  for (const field of MEASUREMENT_FIELDS) {
    const value = electronics[field];
    if (isRecord(value)) {
      result[field] = transformMeasurementEntry(value);
    }
  }

  if (isRecord(electronics.assemblyProcess)) {
    result.assemblyProcess = transformAssemblyProcess(electronics.assemblyProcess);
  }

  if (isRecord(electronics.appliedStandardsAndNorms)) {
    result.appliedStandardsAndNorms = transformAppliedStandardsAndNorms(
      electronics.appliedStandardsAndNorms,
    );
  }

  copyUnhandledProperties(
    electronics,
    result,
    new Set([
      "id",
      "@id",
      "@type",
      "extensionType",
      "assemblyProcess",
      "appliedStandardsAndNorms",
      ...Object.keys(SIMPLE_OBJECT_FIELDS),
      ...MEASUREMENT_FIELDS,
    ]),
  );
  return result;
}

function transformSimpleNode(value: Record<string, unknown>, config: NodeConfig): Record<string, unknown> {
  const result = createNode(value, config.type, config.label, config.idPrefix);
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}

function transformAssemblyProcess(value: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(value, "AssemblyProcess", "Assembly Process", "assembly-process");

  if (isRecord(value.assemblyLocation)) {
    result.assemblyLocation = transformPlace(value.assemblyLocation);
  }

  copyUnhandledProperties(
    value,
    result,
    new Set(["id", "@id", "@type", "assemblyLocation"]),
  );
  return result;
}

function transformAppliedStandardsAndNorms(
  value: Record<string, unknown>,
): Record<string, unknown> {
  const result = createNode(
    value,
    "AppliedStandardsAndNorms",
    "Applied Standards And Norms",
    "applied-standards-and-norms",
  );

  if (isRecord(value.appliedStandard)) {
    result.appliedStandard = transformDefinedTerm(value.appliedStandard);
  }

  copyUnhandledProperties(
    value,
    result,
    new Set(["id", "@id", "@type", "appliedStandard"]),
  );
  return result;
}

function transformDefinedTerm(value: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(value, "DefinedTerm", "Defined Term", "defined-term");
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]));
  return result;
}
