import { Dimensions } from "../general/types";
import { UIUtils } from "../general/util";
import { DynamicActionUI } from "../ui";

export class BaseElement {
    public parentalDimensions: Dimensions = { width: 0, height: 0 };
    public elementIndex: number | undefined;

    constructor(
        public x: number | string = 0,
        public y: number | string = 0,
        public w: number | string = 0,
        public h: number | string = 0,
    ) {}

    setParentalDimensions(parentalDimensions: Dimensions) {
        this.parentalDimensions = parentalDimensions;
    }

    getBoundingX() {
        return UIUtils.processUnitString(this.x, this.parentalDimensions.width);
    }

    getBoundingY() {
        return UIUtils.processUnitString(this.y, this.parentalDimensions.height);
    }

    getBoundingW() {
        return UIUtils.processUnitString(this.w, this.parentalDimensions.width);
    }

    getBoundingH() {
        return UIUtils.processUnitString(this.h, this.parentalDimensions.height);
    }

    setW(width: number | string) {
        this.w = width;
    }

    setH(height: number | string) {
        this.h = height;
    }

    setX(x: number | string) {
        this.x = x;
    }

    setY(y: number | string) {
        this.y = y;
    }
}
