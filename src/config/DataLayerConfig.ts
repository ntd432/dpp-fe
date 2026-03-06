const DATA_LAYER : Record<string, string[]> = {
    "Regulatory": [ "ProductIdentificationInformation", "Manufacturer", ],
}

export function getDataLayer(dataPoint: string): string {
    for (const [layer, dataPoints] of Object.entries(DATA_LAYER)) {
        if (dataPoints.includes(dataPoint)) {
            return layer;
        }
    }
    return "Unknown";
}