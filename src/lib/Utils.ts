
export class Utils {
    static toCamelCase(str: string): string {
        // Using replace method with regEx
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    static calculateNumberOfColumnsPairs(pairs: Readonly<{ label: string; value: unknown }>[]): number {
        // Implementation for calculating number of columns
        const count = pairs.filter(pair => pair.value !== undefined && pair.value !== null).length;
        if (count === 0) return 1;
        if (count === 1) return 1;
        if (count === 2 || count === 4) return 2;
        return 3; // For more than 2 pairs, use 3 columns
    }

    /** Remove empty strings, empty arrays, empty objects, and _key fields recursively. */
    static pruneEmpty(obj: Record<string, unknown>): Record<string, unknown> {
        const isEmptyObject = (value: unknown): boolean =>
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            Object.keys(value).length === 0;

        const pruneValue = (value: unknown): unknown => {
            if (value === "" || value === undefined || value === null) {
            return undefined;
            }

            if (Array.isArray(value)) {
            const filtered = value
                .map((item) =>
                typeof item === "object" && item !== null
                    ? Utils.pruneEmpty(item as Record<string, unknown>)
                    : item,
                )
                .filter(
                (item) => item !== "" && item !== undefined && !isEmptyObject(item),
                );
            return filtered.length > 0 ? filtered : undefined;
            }

            if (typeof value === "object") {
            const pruned = Utils.pruneEmpty(value as Record<string, unknown>);
            return Object.keys(pruned).length > 0 ? pruned : undefined;
            }

            return value;
        };

        const result: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj)) {
            if (k === "_key") continue;
            const prunedValue = pruneValue(v);
            if (prunedValue !== undefined) {
            result[k] = prunedValue;
            }
        }

        // Drop extension shells that carry no meaningful values beyond extensionType.
        if (Object.keys(result).length === 1 && result.extensionType !== undefined) {
            return {};
        }

        return result;
    }
}

