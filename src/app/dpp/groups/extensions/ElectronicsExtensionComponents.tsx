"use client";

import { ElectronicExtension } from "@/types";
import { ExtensionFieldCard, ValueTree } from "../CommonComponents";
import { Utils } from "@/lib/Utils";
import { ExtensionSectionKey } from "@/config/product-extension-fields";
import { useLanguage } from "@/contexts/LanguageContext";

type ElectronicsExtensionSectionProps = {
    field: ExtensionSectionKey;
    data?: ElectronicExtension;
};

function renderSectorRequiredInformation(data?: ElectronicExtension) {
    const { t } = useLanguage();
    const assemblyProcessPairs = data?.assemblyProcess ? [
        { label: "extensions.electronic.fields.assemblyProcessDescription", value: data.assemblyProcess.assemblyProcessDescription },
        { label: "extensions.electronic.fields.assemblyAutomationLevel", value: data.assemblyProcess.assemblyAutomationLevel },
        { label: "extensions.electronic.fields.assemblyLocationName", value: data.assemblyProcess.assemblyLocation?.name },
    ] : [];
    const productionMethodPairs = data?.productionMethod ? [
        { label: "extensions.electronic.fields.productionMethodDescription", value: data.productionMethod.productionMethodDescription },
        { label: "extensions.electronic.fields.manufacturingTechnology", value: data.productionMethod.manufacturingTechnology },
        { label: "extensions.electronic.fields.processCertification", value: data.productionMethod.processCertification },
    ] : [];

    return (
        <>
        {data?.assemblyProcess && (
        <ExtensionFieldCard fieldName={t("extensions.electronic.groups.assemblyProcess")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(assemblyProcessPairs)}>
            {assemblyProcessPairs.map((pair) => (
            <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
            ))}
        </ExtensionFieldCard>
        )}
        {data?.productionMethod && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.productionMethod")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(productionMethodPairs)}>
                {productionMethodPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        </>
    )
}

function renderProductSpecification(data?: ElectronicExtension) {
    const { t } = useLanguage();
    const physicalMeasurement = [
        { label: "extensions.electronic.fields.height", value: data?.height ? `${data.height.measurementValue} ${data.height.measurementUnit}` : undefined },
        { label: "extensions.electronic.fields.width", value: data?.width ? `${data.width.measurementValue} ${data.width.measurementUnit}` : undefined },
        { label: "extensions.electronic.fields.depth", value: data?.depth ? `${data.depth.measurementValue} ${data.depth.measurementUnit}` : undefined },
        { label: "extensions.electronic.fields.weight", value: data?.weight ? `${data.weight.measurementValue} ${data.weight.measurementUnit}` : undefined },
        { label: "extensions.electronic.fields.batteryCapacity", value: data?.batteryCapacity ? `${data.batteryCapacity.measurementValue} ${data.batteryCapacity.measurementUnit}` : undefined },
        { label: "extensions.electronic.fields.volume", value: data?.volume ? `${data.volume.measurementValue} ${data.volume.measurementUnit}` : undefined },
    ]
    const physicalMeasurementExists = physicalMeasurement.some(measurement => measurement.value !== undefined);
    const technicalSpecification = [
        { label: "extensions.electronic.fields.ingressProtection", value: data?.ingressProtection },
        { label: "extensions.electronic.fields.networkConnectivity", value: data?.networkConnectivity },
        { label: "extensions.electronic.fields.chargingInterface", value: data?.chargingInterface },
    ]
    const technicalSpecificationExists = technicalSpecification.some(spec => spec.value !== undefined);

    const crossCompatibilityPairs = data?.crossCompatibility ? [
        { label: "extensions.electronic.fields.details", value: data.crossCompatibility.crossCompatibilityDetails },
        { label: "extensions.electronic.fields.compatibleInterfaceStandard", value: data.crossCompatibility.compatibleInterfaceStandard },
        { label: "extensions.electronic.fields.compatibilityLevel", value: Utils.toCamelCase(data.crossCompatibility.compatibilityLevel || "") },
    ] : [];

    const installedSoftwarePairs = data?.installedSoftware ? [
        { label: "extensions.electronic.fields.name", value: data.installedSoftware.installedSoftwareName },
        { label: "extensions.electronic.fields.version", value: data.installedSoftware.installedSoftwareVersion },
        { label: "extensions.electronic.fields.supportEndDate", value: data.installedSoftware.softwareSupportEndDate },
    ] : [];

    return (
        <>
        {physicalMeasurementExists && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.physicalMeasurements")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(physicalMeasurement)}>
                {physicalMeasurement.map((measurement) => (
                    <ValueTree key={measurement.label} label={t(measurement.label)} value={measurement.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {technicalSpecificationExists && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.technicalSpecifications")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(technicalSpecification)}>
                {technicalSpecification.map((spec) => (
                    <ValueTree key={spec.label} label={t(spec.label)} value={spec.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.crossCompatibility && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.crossCompatibility")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(crossCompatibilityPairs)}>
                {crossCompatibilityPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.installedSoftware && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.installedSoftware")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(installedSoftwarePairs)}>
                {installedSoftwarePairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        </>
    )
}

function renderSectorNonRequiredInformation(data?: ElectronicExtension) {
    const { t } = useLanguage();
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
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.expectedEndCondition")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(expectedEndConditionPairs)}>
                {expectedEndConditionPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.renewableEnergyProductionValue !== undefined && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.renewableEnergyProduction")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(renewableEnergyProductionPairs)}>
                {renewableEnergyProductionPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.separabilityScore !== undefined && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.materialSeparability")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(materialSeparabilityPairs)}>
                {materialSeparabilityPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.modularityScore !== undefined && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.componentModularity")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(componentModularityPairs)}>
                {componentModularityPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.productDesignInfo && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.productDesign")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(productDesignPairs)}>
                {productDesignPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
                ))}
            </ExtensionFieldCard>
        )}
        {data?.appliedStandardsAndNorms && (
            <ExtensionFieldCard fieldName={t("extensions.electronic.groups.appliedStandardsAndNorms")} numberOfColumn={Utils.calculateNumberOfColumnsPairs(appliedStandardsAndNormsPairs)}>
                {appliedStandardsAndNormsPairs.map((pair) => (
                    <ValueTree key={pair.label} label={t(pair.label)} value={pair.value} />
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