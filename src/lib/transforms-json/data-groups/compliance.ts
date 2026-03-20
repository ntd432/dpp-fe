const PRODUCT_INFO_PREFIX = "https://ntd432.github.io/dpp/models/dpp-product-info.ttl#";
const SUSTAINABILITY_PREFIX = "https://ntd432.github.io/dpp/models/dpp-sustainability.ttl#";
const EOL_PREFIX = "https://ntd432.github.io/dpp/models/dpp-eol.ttl#";
const GUIDELINES_PREFIX = "https://ntd432.github.io/dpp/models/dpp-guidelines.ttl#";
const COMPLIANCE_PREFIX = "https://ntd432.github.io/dpp/models/dpp-compliance.ttl#";

const TYPES_TO_FIELDNAMES: Record<string, string> = {
    [`${PRODUCT_INFO_PREFIX}ProductIdentificationInformation`]: "identification",
    [`${PRODUCT_INFO_PREFIX}Manufacturer`]: "manufacturer",
    [`${PRODUCT_INFO_PREFIX}ComponentInformation`]: "component",
    [`${PRODUCT_INFO_PREFIX}SparePartsAvailability`]: "sparePartsAvailability",
    [`${PRODUCT_INFO_PREFIX}HazardousSubstances`]: "hazardousSubstances",
    [`${PRODUCT_INFO_PREFIX}SubstancesOfConcern`]: "substancesOfConcern",
    [`${PRODUCT_INFO_PREFIX}SectorRequiredInformation`]: "sectorRequiredInformation",
    [`${PRODUCT_INFO_PREFIX}ProductSpecification`]: "productSpecification",
    [`${PRODUCT_INFO_PREFIX}SectorNonRequiredInformation`]: "sectorNonRequiredInformation",
    [`${PRODUCT_INFO_PREFIX}RelatedObjects`]: "relatedObjects",
    [`${PRODUCT_INFO_PREFIX}TestReport`]: "testReport",
    [`${PRODUCT_INFO_PREFIX}ProductCommercialInformation`]: "commercialInformation",
    [`${PRODUCT_INFO_PREFIX}QualityAssessment`]: "qualityAssessment",
    [`${PRODUCT_INFO_PREFIX}IdentifiedRisk`]: "identifiedRisk",
    [`${SUSTAINABILITY_PREFIX}SustainabilityPerformance`]: "sustainabilityPerformance",
    [`${SUSTAINABILITY_PREFIX}Decomposability`]: "decomposability",
    [`${SUSTAINABILITY_PREFIX}SectorSustainabilityIndicators`]: "sectorSustainabilityIndicators",
    [`${SUSTAINABILITY_PREFIX}CriticalRawMaterial`]: "criticalRawMaterial",
    [`${SUSTAINABILITY_PREFIX}LifeCycleAssessment`]: "lifeCycleAssessment",
    [`${SUSTAINABILITY_PREFIX}RenewableNonRenewableContent`]: "renewableNonRenewableContent",
    [`${SUSTAINABILITY_PREFIX}CircularEconomyIndicator`]: "circularEconomyIndicator",
    [`${SUSTAINABILITY_PREFIX}SocialIndicator`]: "socialIndicator",
    [`${SUSTAINABILITY_PREFIX}SustainabilityAttributes`]: "sustainabilityAttributes",
    [`${SUSTAINABILITY_PREFIX}EnvironmentDeclaration`]: "environmentDeclaration",
    [`${EOL_PREFIX}RecyclingReusePotential`]: "recyclingReusePotential",
    [`${EOL_PREFIX}DisposalOptions`]: "disposalOptions",
    [`${EOL_PREFIX}UnsoldProductsInformation`]: "unsoldProductsInformation",
    [`${EOL_PREFIX}ExpectedWaste`]: "expectedWaste",
    [`${EOL_PREFIX}Reusability`]: "reusability",
    [`${EOL_PREFIX}Repairability`]: "repairability",
    [`${EOL_PREFIX}Refurbishability`]: "refurbishability",
    [`${EOL_PREFIX}UpgradeOptions`]: "upgradeOptions",
    [`${EOL_PREFIX}EndOfLifeHistory`]: "endOfLifeHistory",
    [`${EOL_PREFIX}NumberOfLifecycles`]: "numberOfLifecycles",
    [`${EOL_PREFIX}EndOfLifeInformation`]: "endOfLifeInformation",
    [`${COMPLIANCE_PREFIX}Regulation`]: "regulation",
    [`${COMPLIANCE_PREFIX}ProductLabel`]: "productLabel",
    [`${COMPLIANCE_PREFIX}ProductStatusAssessment`]: "productStatusAssessment",
    [`${COMPLIANCE_PREFIX}Certification`]: "certification",
    [`${COMPLIANCE_PREFIX}DataManagementMethod`]: "dataManagementMethod",
    [`${GUIDELINES_PREFIX}AssemblyGuideline`]: "assemblyGuideline",
    [`${GUIDELINES_PREFIX}NonDestructiveDisassemblyGuideline`]: "nonDestructiveDisassemblyGuideline",
    [`${GUIDELINES_PREFIX}ProductManual`]: "productManual",
    [`${GUIDELINES_PREFIX}StorageAndTransportGuideline`]: "storageAndTransportGuideline",
    [`${GUIDELINES_PREFIX}CommercialInstruction`]: "commercialInstruction",
    [`${GUIDELINES_PREFIX}Accessibility`]: "accessibility",
    [`${GUIDELINES_PREFIX}UtilizationCharacteristic`]: "utilizationCharacteristic",
};

const ARRAY_TYPES = new Set([
    "endOfLifeHistory",
    "hazardousSubstances",
    "substancesOfConcern",
    "relatedObjects",
    "criticalRawMaterial",
    "renewableNonRenewableContent",
    "regulation", "productLabel", "certification"
]);

export async function transformDataGroupJson(describeResult: Record<string, any>): Promise<Record<string, any>> {
    let result: Record<string, any> = {};
    const dataPoints = describeResult.dataPoint || [];
    for (const dataPoint of dataPoints) {
        const type = dataPoint.type;
        const fieldName = TYPES_TO_FIELDNAMES[type];
        if (!fieldName) {
            console.warn(`Unknown data point type: ${type}. Skipping transformation for this data point.`);
            continue;
        } 
        if (dataPoint[fieldName] === undefined) {
            if (typeof dataPoint === "object" && dataPoint !== null) {
                delete dataPoint["type"];
                delete dataPoint["dataLayer"];
            }
            result[fieldName] = dataPoint;
            continue;
        }
        if (ARRAY_TYPES.has(fieldName) && !Array.isArray(dataPoint[fieldName])) {
            result[fieldName] = [dataPoint[fieldName]];
        } else {
            result[fieldName] = dataPoint[fieldName];
        }
    }
    
    return result;
}