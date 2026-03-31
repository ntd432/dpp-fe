import { ElectronicExtension } from "@/types";
import { ExtensionFieldCard, ValueTree } from "../CommonComponents";
import { Utils } from "@/lib/Utils";
import { ExtensionSectionKey } from "@/config/product-extension-fields";

type ElectronicsExtensionSectionProps = {
    field: ExtensionSectionKey;
    data?: ElectronicExtension;
};

function renderSectorRequiredInformation(data?: ElectronicExtension) {
    const assemblyProcessPairs = data?.assemblyProcess ? [
        { label: "Description", value: data.assemblyProcess.assemblyProcessDescription },
        { label: "Automation level", value: data.assemblyProcess.assemblyAutomationLevel },
        { label: "Location", value: data.assemblyProcess.assemblyLocation?.name },
    ] : [];
    const productionMethodPairs = data?.productionMethod ? [
        { label: "Description", value: data.productionMethod.productionMethodDescription },
        { label: "Manufacturing technology", value: data.productionMethod.manufacturingTechnology },
        { label: "Process certification", value: data.productionMethod.processCertification },
    ] : [];

    return (
        <>
        {data?.assemblyProcess && (
        <ExtensionFieldCard fieldName="Assembly Process" numberOfColumn={Utils.calculateNumberOfColumnsPairs(assemblyProcessPairs)}>
            {assemblyProcessPairs.map((pair) => (
            <ValueTree key={pair.label} label={pair.label} value={pair.value} />
            ))}
        </ExtensionFieldCard>
        )}
        {data?.productionMethod && (
            <ExtensionFieldCard fieldName="Production Method" numberOfColumn={Utils.calculateNumberOfColumnsPairs(productionMethodPairs)}>
                {productionMethodPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        </>
    )
}

function renderProductSpecification(data?: ElectronicExtension) {
    const physicalMeasurement = [
        { label: "Height", value: data?.height ? `${data.height.measurementValue} ${data.height.measurementUnit}` : undefined },
        { label: "Width", value: data?.width ? `${data.width.measurementValue} ${data.width.measurementUnit}` : undefined },
        { label: "Depth", value: data?.depth ? `${data.depth.measurementValue} ${data.depth.measurementUnit}` : undefined },
        { label: "Weight", value: data?.weight ? `${data.weight.measurementValue} ${data.weight.measurementUnit}` : undefined },
        { label: "Battery Capacity", value: data?.batteryCapacity ? `${data.batteryCapacity.measurementValue} ${data.batteryCapacity.measurementUnit}` : undefined },
        { label: "Volume", value: data?.volume ? `${data.volume.measurementValue} ${data.volume.measurementUnit}` : undefined },
    ]
    const physicalMeasurementExists = physicalMeasurement.some(measurement => measurement.value !== undefined);
    const technicalSpecification = [
        { label: "Ingress Protection", value: data?.ingressProtection },
        { label: "Network Connectivity", value: data?.networkConnectivity },
        { label: "Charging Interface", value: data?.chargingInterface },
    ]
    const technicalSpecificationExists = technicalSpecification.some(spec => spec.value !== undefined);

    const crossCompatibilityPairs = data?.crossCompatibility ? [
        { label: "Details", value: data.crossCompatibility.crossCompatibilityDetails },
        { label: "Compatible Interface Standard", value: data.crossCompatibility.compatibleInterfaceStandard },
        { label: "Compatibility Level", value: Utils.toCamelCase(data.crossCompatibility.compatibilityLevel || "") },
    ] : [];

    const installedSoftwarePairs = data?.installedSoftware ? [
        { label: "Name", value: data.installedSoftware.installedSoftwareName },
        { label: "Version", value: data.installedSoftware.installedSoftwareVersion },
        { label: "Support End Date", value: data.installedSoftware.softwareSupportEndDate },
    ] : [];

    return (
        <>
        {physicalMeasurementExists && (
            <ExtensionFieldCard fieldName="Physical Measurements" numberOfColumn={Utils.calculateNumberOfColumnsPairs(physicalMeasurement)}>
                {physicalMeasurement.map((measurement) => (
                    <ValueTree key={measurement.label} label={measurement.label} value={measurement.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {technicalSpecificationExists && (
            <ExtensionFieldCard fieldName="Technical Specifications" numberOfColumn={Utils.calculateNumberOfColumnsPairs(technicalSpecification)}>
                {technicalSpecification.map((spec) => (
                    <ValueTree key={spec.label} label={spec.label} value={spec.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.crossCompatibility && (
            <ExtensionFieldCard fieldName="Cross Compatibility" numberOfColumn={Utils.calculateNumberOfColumnsPairs(crossCompatibilityPairs)}>
                {crossCompatibilityPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.installedSoftware && (
            <ExtensionFieldCard fieldName="Installed Software" numberOfColumn={Utils.calculateNumberOfColumnsPairs(installedSoftwarePairs)}>
                {installedSoftwarePairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        </>
    )
}

function renderSectorNonRequiredInformation(data?: ElectronicExtension) {
    const expectedEndConditionPairs = data?.expectedEndConditionInfo ? [
        { label: "Expected End Condition", value: Utils.toCamelCase(data.expectedEndConditionInfo.expectedEndCondition || "") },
    ] : [];

    const renewableEnergyProductionPairs = data?.renewableEnergyProductionInfo ? [
        { label: "Renewable Energy Production", value: data.renewableEnergyProductionInfo.renewableEnergyProductionValue ? "Yes" : "No" },
        { label: "Renewable Energy Type", value: data.renewableEnergyProductionInfo.renewableEnergyType },
        { label: "Renewable Energy Output", value: data.renewableEnergyProductionInfo.renewableEnergyOutput ? `${data.renewableEnergyProductionInfo.renewableEnergyOutput} ${data.renewableEnergyProductionInfo.renewableEnergyOutputUnit}` : undefined },
    ] : [];

    const materialSeparabilityPairs = data?.materialSeparability ? [
        { label: "Separability Score", value: data.materialSeparability.separabilityScore },
        { label: "Separability Method", value: data.materialSeparability.separabilityMethod },
    ] : [];

    const componentModularityPairs = data?.componentModularity ? [
        { label: "Modularity Score", value: data.componentModularity.modularityScore },
        { label: "Replaceable Component", value: data.componentModularity.replaceableComponent },
    ] : [];

    const productDesignPairs = data?.productDesignInfo ? [
        { label: "Product Design", value: data.productDesignInfo.productDesign },
        { label: "Design for Disassembly", value: data.productDesignInfo.designForDisassembly ? "Yes" : "No" },
     ] : [];

     const appliedStandardsAndNormsPairs = data?.appliedStandardsAndNorms ? [
        { label: "Applied Standard", value: data.appliedStandardsAndNorms?.appliedStandard?.name },
        { label: "Standard Reference", value: data.appliedStandardsAndNorms?.standardReference },
     ] : [];

     return (
        <>
        {data?.expectedEndConditionInfo && (
            <ExtensionFieldCard fieldName="Expected End Condition" numberOfColumn={Utils.calculateNumberOfColumnsPairs(expectedEndConditionPairs)}>
                {expectedEndConditionPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.renewableEnergyProductionValue !== undefined && (
            <ExtensionFieldCard fieldName="Renewable Energy Production" numberOfColumn={Utils.calculateNumberOfColumnsPairs(renewableEnergyProductionPairs)}>
                {renewableEnergyProductionPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.separabilityScore !== undefined && (
            <ExtensionFieldCard fieldName="Material Separability" numberOfColumn={Utils.calculateNumberOfColumnsPairs(materialSeparabilityPairs)}>
                {materialSeparabilityPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.modularityScore !== undefined && (
            <ExtensionFieldCard fieldName="Component Modularity" numberOfColumn={Utils.calculateNumberOfColumnsPairs(componentModularityPairs)}>
                {componentModularityPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.productDesignInfo && (
            <ExtensionFieldCard fieldName="Product Design" numberOfColumn={Utils.calculateNumberOfColumnsPairs(productDesignPairs)}>
                {productDesignPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.appliedStandardsAndNorms && (
            <ExtensionFieldCard fieldName="Applied Standards and Norms" numberOfColumn={Utils.calculateNumberOfColumnsPairs(appliedStandardsAndNormsPairs)}>
                {appliedStandardsAndNormsPairs.map((pair) => (
                    <ValueTree key={pair.label} label={pair.label} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        </>
     )
}

export function ElectronicsExtensionSection({ field, data }: Readonly<ElectronicsExtensionSectionProps>) {
    return (
        <>
        {field == "sectorRequiredInformation" && (renderSectorRequiredInformation(data))}
        {field == "productSpecification" && (renderProductSpecification(data))}
        {field == "sectorNonRequiredInformation" && (renderSectorNonRequiredInformation(data))}
        </>
    )
}