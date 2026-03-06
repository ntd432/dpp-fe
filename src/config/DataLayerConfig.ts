const DATA_LAYER: Record<string, string[]> = {
  "Regulatory": [
    // Product Information group
    "ProductIdentificationInformation",
    "Manufacturer",
    "MaterialInformation",
    "SparePartsAvailability",
    "HazardousSubstances",
    "SubstancesOfConcern",
    "SectorRequiredInformation",
    // Sustainability Information group
    "SustainabilityPerformance",
    // End-of-life group 
    "RecyclingReusePotential",
    "DisposalOptions",
    "UnsoldProductsInformation",
    // Supply chain group
    "ProductTraceability",
    // Guidelines group
    "AssemblyGuideline",
    "NonDestructiveDisassemblyGuideline",
    "ProductManual",
    // Compliance group
    "Regulation",
    "ComplianceLabel",
  ],
  "Sectoral": [
    // Product Information group
    "ProductSpecification",
    "SectorNonRequiredInformation",
    "RelatedObjects",
    "TestReports",
    // Sustainability Information group
    "Decomposability",
    "SectorSustainabilityIndicators",
    "CriticalRawMaterial",
    "LifeCycleAssessment",
    // End-of-life group 
    "ExpectedWaste",
    // Guidelines group
    "StorageAndTransportGuideline",
    // Compliance group
    "ProductStatusAssessment",
  ],
  "Commercial": [
    // Product Information group
    "ProductCommercialInformation",
    "QualityAssessment",
    "IdentifiedRisk",
    // Sustainability Information group
    "RenewableNonRenewableContent",
    "CommercialSustainableIndicators",
    "SocialIndicator",
    "SustainabilityAttributes",
    "EnvironmentDeclaration",
    // End-of-life group 
    "Reusability",
    "Repairability",
    "Refurbrishability",
    "UpgradeOptions",
    // Supply chain group
     "RecyclingPartner",
    "CustomerReturnChannel",
    "ComponentSupplier",
    // Guidelines group
    "CommercialInstruction",
    "Accessibility",
    "UtilizationCharacteristic",
    // Compliance group
    "Certification",
    "DataManagementMethod",
  ],
  "Downstream Data": [
    // Usage and Maintenance group
    "MaintenanceLog",
    "UsageHistory",
    "IncidentsAndErrors",
    // End-of-life group 
    "EndOfLifeHistory",
    "NumberOfLifecycles",
    "EndOfLifeInformation",
  ],
};

export function getDataLayer(dataPoint: string): string | null {
  for (const [layer, dataPoints] of Object.entries(DATA_LAYER)) {
    if (dataPoints.includes(dataPoint)) {
      return layer;
    }
  }
  return null;
}