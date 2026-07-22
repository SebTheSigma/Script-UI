import { DimensionExpression, Dimensions, Position, PositionExpression } from "../general/types";
import { BaseElement } from "./base";
import { Button } from "./button";

export class Grid extends BaseElement {

    constructor(
        public buttons: Button[],
        public dimensions: Dimensions,
        public size: DimensionExpression,
        public offset: PositionExpression
    ) {
        super(offset, size);
    }

    public clone() {
        return new Grid([ ...this.buttons.map(b => b.clone()) ], { ...this.dimensions }, { ...this.size }, { ...this.offset });
    }
}


