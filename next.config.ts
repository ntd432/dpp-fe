import type { NextConfig } from "next";

export const PRODUCT_INFO_PREFIX = process.env.PRODUCT_INFO_PREFIX || "https://ntd432.github.io/dpp/models/dpp-product-info.ttl#";
export const SUSTAINABILITY_PREFIX = process.env.SUSTAINABILITY_PREFIX || "https://ntd432.github.io/dpp/models/dpp-sustainability.ttl#";
export const EOL_PREFIX = process.env.EOL_PREFIX || "https://ntd432.github.io/dpp/models/dpp-eol.ttl#";
export const GUIDELINES_PREFIX = process.env.GUIDELINES_PREFIX || "https://ntd432.github.io/dpp/models/dpp-guidelines.ttl#";
export const COMPLIANCE_PREFIX = process.env.COMPLIANCE_PREFIX || "https://ntd432.github.io/dpp/models/dpp-compliance.ttl#";
export const SUPPLY_CHAIN_PREFIX = process.env.SUPPLY_CHAIN_PREFIX || "https://ntd432.github.io/dpp/models/dpp-supply-chain.ttl#";
export const USAGE_PREFIX = process.env.USAGE_PREFIX || "https://ntd432.github.io/dpp/models/dpp-usage.ttl#";
export const DATA_GROUP_PREDICATE = process.env.CORE_PREFIX ? `${process.env.CORE_PREFIX}dataGroup` : "https://ntd432.github.io/dpp/models/dpp-core.ttl#dataGroup";
export const EXTENSION_TYPES = new Set([
    "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#ElectronicExtension",
]);

export const ARRAY_TYPES = new Set([
    "endOfLifeHistory",
    "hazardousSubstances",
    "substancesOfConcern",
    "relatedObjects",
    "criticalRawMaterial",
    "renewableNonRenewableContent",
    "regulation", "productLabel", "certification",
    "environmentalImpact", "environmentalFootprint", "resourceConsumption", "resourceConsumptionWhenUsing", "resourceConsumptionWhenRecovering",
    "incidentsAndErrors", "maintenanceLog", "usageHistory",
    "recyclingPartner", "customerReturnChannel",
]);

export const TEST_DPP = {
    "dataCarrier": "dpp/f9d15150-50c8-4ae3-b1f6-3c283e1d89fa",
    "dataCarrierFormat": "QR code",
    "supplyChain": {
        "customerReturnChannel": [{
            "type": "https://schema.org/Organization",
            "name": "Apple Trade In"
        }],
        "productTraceability": {
            "traceabilityEvent": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Event",
                    "actionName": "Final assembly and QA",
                    "actionType": "Assembly",
                    "location": {
                        "type": "https://schema.org/Place",
                        "name": "Assembly facility, Zhengzhou, China"
                    },
                    "time": "2025-09-12T14:30:00Z"
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Event",
                    "actionName": "Chip packaging and validation",
                    "actionType": "Production",
                    "location": {
                        "type": "https://schema.org/Place",
                        "name": "Supplier facility, Taiwan"
                    },
                    "time": "2025-08-20T08:00:00Z"
                }
            ]
        },
        "recyclingPartner": [{
            "type": "https://schema.org/Organization",
            "name": "TES-AMM",
            "url": "https://tes-amm.com"
        },
    {
            "type": "https://schema.org/Organization",
            "name": "TES-AMM-2"
        }],
        
    },
    "usage": {
        "incidentsAndErrors": [{
            "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Event",
            "actionName": "No incidents recorded",
            "time": "2026-03-01T00:00:00Z"
        }],
        "maintenanceLog": [{
            "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Event",
            "actionName": "Battery health diagnostic",
            "time": "2026-02-10T09:00:00Z"
        }],
        "usageHistory": [{
            "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Event",
            "actionName": "First activation",
            "time": "2025-09-22T10:15:00Z"
        }]
    },
    "dppRegistrationNumber": "f9d15150-50c8-4ae3-b1f6-3c283e1d89fa",
    "granularity": "item",
    "issuer": {
        "type": "https://schema.org/Organization",
        "identifier": "APPLE-001",
        "name": "Apple Inc.",
        "url": "https://www.apple.com"
    },
    "product": {
        "compliance": {
            "certification": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-compliance.ttl#Certification",
                    "description": "Conforms to applicable EU safety, EMC, and environmental requirements.",
                    "name": "CE Marking"
                }
            ],
            "dataManagementMethod": {
                "type": "https://schema.org/Legislation",
                "identifier": "APPLE-DMM-001",
                "name": "Apple Secure Product Data Ledger"
            },
            "productLabel": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-compliance.ttl#Label",
                    "labelDescription": "Declared energy efficiency class.",
                    "labelDocumentation": "https://example.com/eu-energy-label/iphone-17-pro",
                    "labelName": "EU Energy Label",
                    "labelValue": "Class A"
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-compliance.ttl#Label",
                    "labelDescription": "2- Declared energy efficiency class.",
                    "labelDocumentation": "https://example.com/eu-energy-label/iphone-17-pro",
                    "labelName": "EU Energy Label 2",
                    "labelValue": "Class A"
                }
            ],
            "productStatusAssessment": "https://apple.com/assessment/iphone-17",
            "regulation": [
                {
                    "type": "https://schema.org/Legislation",
                    "identifier": "EU 2024/1781",
                    "name": "EU Ecodesign for Sustainable Products Regulation (ESPR)"
                },
                {
                    "type": "https://schema.org/Legislation",
                    "identifier": "EU 2024/1781",
                    "name": "2- EU Ecodesign for Sustainable Products Regulation (ESPR)"
                }
            ]
        },
        "endOfLife": {
            "disposalOptions": "Return via Apple Trade In, authorized collection points, or local WEEE channels.",
            "endOfLifeInformation": {
                "collectionInformation": "Collection via Apple channels and approved electronics recyclers.",
                "endOfLifeReport": "https://www.apple.com/environment/pdf/products/iphone-17-pro-eol-report.pdf",
                "separateCollection": "Separate electronic waste collection required; disposal with household waste prohibited.",
                "wastePrevention": "Trade-in incentives promote return and reuse."
            },
            "expectedWaste": "Minor non-recoverable waste from mixed adhesives and laminated composite fractions.",
            "numberOfLifecycles": "1",
            "recyclingReusePotential": "High recoverability for aluminum, cobalt, and rare earth elements through approved recycling streams.",
            "refurbishability": "Certified refurbishment available with full diagnostic and component replacement workflow.",
            "repairability": "Battery and display service supported through authorized channels and self-service repair program in eligible regions.",
            "reusability": "Suitable for refurbishment and second-life deployment when core modules pass diagnostics.",
            "upgradeOptions": "Long-term iOS software updates; hardware upgrades are limited.",
            "endOfLifeHistory": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Event",
                    "actionName": "Moved to recycling facility",
                    "time": "2026-03-01T00:00:00Z"
                }
            ]
        },
        "guidelines": {
            "accessibility": "VoiceOver, AssistiveTouch, Live Captions, Sound Recognition, and hearing device compatibility.",
            "assemblyGuideline": {
                "type": "https://schema.org/Guide",
                "url": "https://support.apple.com/repair"
            },
            "commercialInstruction": {
                "maintenanceInstruction": {
                    "type": "https://schema.org/Guide",
                    "url": "https://support.apple.com/iphone/repair/service"
                },
                "safetyInstruction": {
                    "type": "https://schema.org/Guide",
                    "url": "https://support.apple.com/en-us/HT208076"
                },
                "wasteSortingInstruction": {
                    "type": "https://schema.org/Guide",
                    "url": "https://www.apple.com/recycling/"
                }
            },
            "nonDestructiveDisassemblyGuideline": {
                "type": "https://schema.org/Guide",
                "url": "https://support.apple.com/self-service-repair"
            },
            "productManual": {
                "type": "https://schema.org/Guide",
                "url": "https://support.apple.com/guide/iphone"
            },
            "storageAndTransportGuideline": {
                "type": "https://schema.org/Guide",
                "url": "https://support.apple.com/en-us/HT208862"
            },
            "utilizationCharacteristic": "Designed for daily personal/mobile use; recommended operating temperature 0-35C."
        },
        "productInfo": {
            "commercialInformation": {
                "image": {
                    "type": "https://schema.org/ImageObject",
                    "caption": "Apple iPhone 17 Pro",
                    "url": "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-model-unselect-gallery-2-202509_GEO_US?wid=5120&hei=2880&fmt=webp&qlt=90&.v=dU9qRExIQUlQTzVKeDd1V1dtUE1MUWFRQXQ2R0JQTk5udUZxTkR3ZVlpTEJBSVhDREVhQVF4eThVb2E3Y2VibUlYUWYrQkRLNitCbE9QRVRqNHErMkE3b3pFWnhZZ2g0M0pRR0pEdHVSRUVtYkFqYmVJbENIK1gycDVvVjJtTEZkWHlyQUZHM0VoZTBZR3diWjJXVERn&traceId=1"
                },
                "lifetimeExpectancy": "P5Y"
            },
            "component": {
                "componentBills": "https://www.apple.com/environment/pdf/products/iphone-17-pro-components.pdf",
                "componentComposition": [
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "Titanium alloy frame",
                        "componentPercentage": "35"
                    },
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "Recycled plastics and adhesives",
                        "componentPercentage": "10"
                    },
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "PCB and electronics",
                        "componentPercentage": "19"
                    },
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "Lithium-ion battery",
                        "componentPercentage": "14"
                    },
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "Ceramic Shield glass",
                        "componentPercentage": "22"
                    }
                ],
                "recycledReusedContent": [
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "Recycled rare earth elements"
                    },
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "Recycled cobalt"
                    },
                    {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                        "componentName": "Recycled aluminum"
                    }
                ]
            },
            "hazardousSubstances": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Substance",
                    "substanceDescription": "Contained in lithium-ion battery and managed under applicable safety standards.",
                    "substanceName": "Cobalt (in battery cathode)"
                }
            ],
            "identifiedRisk": "Lithium-ion battery thermal event risk in extreme misuse conditions; mitigated by battery management and hardware protections.",
            "manufacturer": {
                "type": "https://schema.org/Organization",
                "identifier": "APPLE-001",
                "name": "Apple Inc.",
                "url": "https://www.apple.com"
            },
            "identification": {
                "countryOfOrigin": {
                    "type": "https://schema.org/Country",
                    "name": "China"
                },
                "documentation": "https://www.apple.com/iphone-17-pro/specs/",
                "gtin": "09506000984732",
                "productName": "0323_Apple iPhone 17 Pro 512GB",
                "productionDate": "2025-09-18",
                "taricCode": "123456",
                "description": "description"
            },
            "qualityAssessment": "Passed internal reliability, drop, vibration, and ingress-protection verification programs.",
            "sparePartsAvailability": "Display, battery, camera module, speaker module, charging port module. Available for 7 years from production date.",
            "substancesOfConcern": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Substance",
                    "substanceDescription": "RoHS-compliant lead-free assembly.",
                    "substanceName": "Battery-related cobalt and lithium compounds"
                }
            ],
            "testReport": "https://www.apple.com/environment/pdf/products/iphone-17-pro-test-report.pdf",
            "productSpecification": {
                "crossCompatibility": {
                    "crossCompatibilityDetails": "Compatible with USB-C chargers and accessories; supports Qi wireless charging.",
                    "compatibleInterfaceStandard": "USB Power Delivery (USB-PD) 3.1",
                    "compatibilityLevel": "full"
                },
                "installedSoftware": {
                    "installedSoftwareName": "iOS 17",
                    "installedSoftwareVersion": "17.0",
                    "softwareSupportEndDate": "2030-09-30"
                },
                "batteryCapacity": {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#MeasurementEntry",
                    "measurementUnit": "mAh",
                    "measurementValue": "3.274E3"
                },
                "chargingInterface": "USB-C",
                "depth": {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#MeasurementEntry",
                    "measurementUnit": "mm",
                    "measurementValue": "8.2E0"
                },
                "height": {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#MeasurementEntry",
                    "measurementUnit": "mm",
                    "measurementValue": "1.496E2"
                },
                "ingressProtection": "IP68",
                "networkConnectivity": "5G",
                "weight": {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#MeasurementEntry",
                    "measurementUnit": "g",
                    "measurementValue": "1.99E2"
                },
                "width": {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#MeasurementEntry",
                    "measurementUnit": "mm",
                    "measurementValue": "7.15E1"
                }
            },
            "sectorRequiredInformation": {
                "assemblyProcess": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#AssemblyProcess",
                    "assemblyProcessDescription": "Automated SMT PCB assembly, precision robotic enclosure assembly, optical and functional quality control."
                },
                "productionMethod": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#ProductionMethod",
                    "productionMethodDescription": "ISO 14001-aligned manufacturing with automated inspection and energy-efficiency controls."
                }
            },
            "sectorNonRequiredInformation": {
                "expectedEndConditionInfo": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#ExpectedEndCondition",
                    "expectedEndCondition": "reusable"
                },
                "renewableEnergyProductionInfo": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#RenewableEnergyProduction",
                    "renewableEnergyProductionValue": true,
                    "renewableEnergyType": "On-site solar",
                    "renewableEnergyOutput": 5000,
                    "renewableEnergyOutputUnit": "kWh"
                },
                "materialSeparability": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#MaterialSeparability",
                    "separabilityScore": 8,
                    "separabilityMethod": "Apple Material Recovery Lab assessment"
                },
                "componentModularity": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#ComponentModularity",
                    "modularityScore": 7,
                    "replaceableComponent": "Battery, display, camera module, speaker module, charging port module"
                },
                "productDesignInfo": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#ProductDesign",
                    "productDesign": "Designed for durability, repairability, and recyclability with high-quality materials and modular components.",
                    "designForDisassembly": true
                },
                "appliedStandardsAndNorms": {
                    "type": "https://ntd432.github.io/dpp/models/extensions/dpp-electronics.ttl#AppliedStandardsAndNorms",
                    "appliedStandard": {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#DefinedTerm",
                        "identifier": "IEC 62474:2012",
                        "name": "Material declaration for products of and for the electrotechnical industry"
                    },
                    "standardReference": "https://webstore.iec.ch/publication/6021"
                },
            }
        },
        "sustainability": {
            "sustainabilityPerformance": {
                "environmentalFootprint": [
                    {
                        "environmentalFootprintType": "Carbon footprint",
                        "environmentalFootprintMeasuringMethod": "Life Cycle Assessment",
                        "environmentalFootprintUnit": "kg CO2eq",
                        "environmentalFootprintValue": 150
                    }
                ],
                "resourceConsumption": [
                    {
                        "resource": "Energy",
                        "resourceConsumptionUnit": "kWh",
                        "resourceConsumptionValue": 50
                    }
                ],
                "plasticsRelease": "Approximately 5 grams of microplastics released over the product lifecycle, primarily from wear of plastic components and packaging materials."
            },
            "criticalRawMaterial": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Rare earth elements",
                    "componentPercentage": 10
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Lithium"
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Indium"
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Cobalt"
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Nickel"
                }
            ],
            "decomposability": "Key modules (battery, display, camera) are removable with specialized service tools and documented procedures.",
            "environmentDeclaration": "https://www.apple.com/environment/pdf/products/iphone/iPhone_17_Pro_and_iPhone_17_Pro_Max_PER_Sept2025.pdf",
            "lifeCycleAssessment": {
                "environmentalImpact": [{
                    "type": "https://ntd432.github.io/dpp/models/dpp-sustainability.ttl#EnvironmentalImpact",
                    "characterizationFactor": "Global warming potential (GWP) over a 100-year time horizon",
                    "characterizationModel": "Based on USEtox2.1 model",
                    "impactCategory": "Climate change",
                    "impactIndicator": {
                        "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#MeasurementEntry",
                        "measurementUnit": "Co2eq",
                        "measurementValue": "1.5E2"
                    },
                    "method": "CML 2002 method, v.4.8"
                }],
                "lifeCycleAssessmentReport": "https://www.apple.com/environment/pdf/products/iphone-17-pro-lca.pdf"
            },
            "renewableNonRenewableContent": [
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Recycled rare earth content"
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Virgin mined components"
                },
                {
                    "type": "https://ntd432.github.io/dpp/models/dpp-core.ttl#Component",
                    "componentName": "Recycled metals"
                }
            ],
            "socialIndicator": {
                "labourConditions": "Supplier responsibility audits and corrective action plans under Apple Supplier Code of Conduct."
            }
        },
        "productSector": "Electronics"
    },
    "productBatchNumber": "BATCH-006",
    "productSerialNumber": "SN-006"
};

const nextConfig: NextConfig = {
  /* config options here */
  
};

export default nextConfig;
