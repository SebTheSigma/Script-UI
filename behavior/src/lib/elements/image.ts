import { DimensionExpression, Expression, PositionExpression } from "../general/types";
import { BaseElement } from "./base";

export class Image extends BaseElement {

    constructor(
        public texture: string,
        public offset: PositionExpression,
        public size: DimensionExpression
    ) {
        super(offset, size);
    }

    public clone() {
        return new Image(this.texture, { ...this.offset }, { ...this.size });
    }
}


