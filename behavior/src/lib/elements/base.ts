import { DimensionExpression, Dimensions, Expression, PositionExpression } from "../general/types";
import { UIUtils } from "../general/util";
import { DynamicActionUI } from "../ui";

export class BaseElement {
    public parentalDimensions: Dimensions | undefined;
    public elementIndex: number | undefined;

    constructor(
        public offset: PositionExpression,
        public size: DimensionExpression
    ) {}

    setParentalDimensions(parentalDimensions: Dimensions) {
        this.parentalDimensions = parentalDimensions;
    }

    safeSetParentalDimensions(parentalDimensions: Dimensions) {
        if (this.hasParentalDimensions()) return;

        // Only set if no parental dimensions exist
        this.parentalDimensions = parentalDimensions;
    }

    hasParentalDimensions() {
        return this.parentalDimensions !== undefined;
    }

    getBoundingX() {
        console.warn('Warning: Cannot find bounding x parental dimensions');
        return UIUtils.processUnitString(this.offset.x, this.parentalDimensions?.width ?? 0);
    }

    getBoundingY() {
        console.warn('Warning: Cannot find bounding y parental dimensions');
        return UIUtils.processUnitString(this.offset.y, this.parentalDimensions?.height ?? 0);
    }

    getBoundingW() {
        console.warn('Warning: Cannot find bounding w parental dimensions');
        return UIUtils.processUnitString(this.size.width, this.parentalDimensions?.width ?? 0);
    }

    getBoundingH() {
        console.warn('Warning: Cannot find bounding h parental dimensions');
        return UIUtils.processUnitString(this.size.height, this.parentalDimensions?.height ?? 0);
    }

    setW(width: Expression) {
        this.size.width = width;
    }

    setH(height: Expression) {
        this.size.height = height;
    }

    setX(x: Expression) {
        this.offset.x = x;
    }

    setY(y: Expression) {
        this.offset.y = y;
    }
}
