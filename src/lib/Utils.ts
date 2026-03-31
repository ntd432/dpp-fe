
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
}

