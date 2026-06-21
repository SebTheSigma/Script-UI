export class UIUtils {
    public static processUnitString(unitString: string | number, size: number): number {
        if (typeof unitString === "number") return unitString;
        if (!unitString) return 0;

        // Remove spaces
        const expression = unitString.replace(/\s+/g, "");

        // Split into tokens: 100%, -10px, +5%
        const tokens = expression.match(/([+-]?[^+-]+)/g);
        if (!tokens) return 0;

        let result = 0;

        for (let token of tokens) {
            let value = 0;

            if (token.endsWith("px")) {
                value = parseFloat(token.replace("px", ""));
            } else if (token.endsWith("%")) {
                const percent = parseFloat(token.replace("%", ""));
                value = (percent / 100) * size;
            } else {
                // plain number fallback
                value = parseFloat(token);
            }

            result += value;
        }

        return result;
    }
}
