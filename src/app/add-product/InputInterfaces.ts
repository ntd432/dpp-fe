import { ElectronicExtensionFormState } from "./extensions/ElectronicExtension";

export interface MeasurementValue {
  value: string;
  unit: string;
  customUnit: string;
}
export interface ExtensionPayloadBuildDependencies {
  toBoolean: (value: string) => boolean | "";
  toMeasurementEntry: (measurement: MeasurementValue) => Record<string, unknown>;
  toValueUnitObject: (
    measurement: MeasurementValue,
    valueKey: string,
    unitKey: string,
  ) => Record<string, unknown>;
}

export interface ExtensionPayload {
  sectorRequiredInformation: Record<string, unknown>;
  sectorNonRequiredInformation: Record<string, unknown>;
  productSpecification: Record<string, unknown>;
}

export interface ExtensionStateByType {
  ElectronicExtension: ElectronicExtensionFormState;
}

export type ExtensionState = {
  [K in keyof ExtensionStateByType]?: Partial<ExtensionStateByType[K]>;
} & Record<string, Record<string, unknown> | undefined>;

export interface BaseFormState {
  sector: string;
  sectorType: string;
  extensionData: ExtensionState;
  // Product Information - Identification
  gtin: string;
  taricCode: string;
  productName: string;
  description: string;
  documentation: string;
  countryOfOrigin: string;
  productionDate: string;
  // Product Information - Manufacturer
  manufacturerMode: "existing" | "new";
  manufacturerName: string;
  manufacturerUrl: string;
  manufacturerId: string;
  // Product Information - Material
  componentComposition: ComponentEntry[];
  componentBills: string;
  recycledReusedContent: ComponentEntry[];
  // Product Information - Other
  sparePartsAvailability: string;
  hazardousSubstances: SubstanceEntry[];
  substancesOfConcern: SubstanceEntry[];
  relatedObjectsRaw: string;
  // Product Information - Test Report
  testReport: string;
  // Product Information - Commercial
  imageUrl: string;
  lifetimeExpectancy: string;
  warrantyPeriod: string;
  takebackOption: string;
  qualityAssessment: string;
  identifiedRisk: string;
  // Compliance
  regulations: RegulationEntry[];
  productLabels: LabelEntry[];
  productStatusAssessment: string;
  certifications: NameDescEntry[];
  dmmName: string;
  dmmIdentifier: string;
  // Sustainability
  environmentalFootprints: EnvironmentalFootprintEntry[];
  resourceConsumptions: ResourceConsumptionEntry[];
  plasticsRelease: string;
  decomposability: string;
  sectorSustainabilityIndicatorsText: string;
  criticalRawMaterials: ComponentEntry[];
  lifeCycleAssessmentReport: string;
  environmentalImpacts: EnvironmentalImpactEntry[];
  renewableNonRenewableContent: ComponentEntry[];
  circularEconomyIndicatorText: string;
  labourConditions: string;
  usingResourceConsumptions: ResourceConsumptionEntry[];
  recoveringResourceConsumptions: ResourceConsumptionEntry[];
  environmentDeclaration: string;
  // End of Life
  recyclingReusePotential: string;
  disposalOptions: string;
  unsoldProductsInformation: string;
  expectedWaste: string;
  reusability: string;
  repairability: string;
  refurbishability: string;
  upgradeOptions: string;
  endOfLifeHistory: EventEntry[];
  numberOfLifecycles: string;
  wastePrevention: string;
  separateCollection: string;
  collectionInformation: string;
  endOfLifeReport: string;
  // Guidelines
  assemblyGuidelineUrl: string;
  disassemblyGuidelineUrl: string;
  productManualUrl: string;
  storageGuidelineUrl: string;
  safetyInstructionUrl: string;
  maintenanceInstructionUrl: string;
  wasteSortingInstructionUrl: string;
  accessibility: string;
  utilizationCharacteristic: string;
  // Usage
  maintenanceLog: EventEntry[];
  usageHistory: EventEntry[];
  incidentsAndErrors: EventEntry[];
  productInfoCustomFields: CustomFieldEntry[];
  complianceCustomFields: CustomFieldEntry[];
  sustainabilityCustomFields: CustomFieldEntry[];
  endOfLifeCustomFields: CustomFieldEntry[];
  guidelinesCustomFields: CustomFieldEntry[];
}

export type FormState = BaseFormState &
  Partial<ExtensionStateByType[keyof ExtensionStateByType]>;

export interface ElectronicProductFormState
  extends BaseFormState,
    ElectronicExtensionFormState {}

export interface EventEntry {
  _key: string;
  actionName: string;
  actionType: string;
  time: string;
  locationName: string;
  actorName: string;
}

export interface ComponentEntry {
  _key: string;
  componentName: string;
  mode: "percentage" | "mass";
  componentPercentage: string;
  componentCountValue: string;
  componentCountUnit: string;
  componentCountCustomUnit: string;
  componentReference: string;
  componentURI: string;
  componentSupplierRef: string;
}

export interface SubstanceEntry {
  _key: string;
  substanceName: string;
  substanceDescription: string;
  iupacName: string;
  ecNumber: string;
  casNumber: string;
  concentrationLevel: string;
  locationWithinProduct: string;
  safeUsageInstruction: string;
  disassemblyInstruction: string;
}

export interface RegulationEntry {
  _key: string;
  name: string;
  identifier: string;
}

export interface NameDescEntry {
  _key: string;
  name: string;
  description: string;
}

export interface LabelEntry {
  _key: string;
  labelName: string;
  labelValue: string;
  labelDescription: string;
  labelDocumentation: string;
}

export interface EnvironmentalFootprintEntry {
  _key: string;
  environmentalFootprintType: string;
  environmentalFootprintMeasuringMethod: string;
  measurement: MeasurementValue;
}

export interface ResourceConsumptionEntry {
  _key: string;
  resource: string;
  measurement: MeasurementValue;
}

export interface EnvironmentalImpactEntry {
  _key: string;
  impactCategory: string;
  method: string;
  characterizationFactor: string;
  characterizationModel: string;
  impactIndicator: MeasurementValue;
}

export interface CustomFieldEntry {
  _key: string;
  key: string;
  value: string;
  sourcePath?: string;
}