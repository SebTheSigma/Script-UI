import { DimensionExpression, PositionExpression } from "../../general/types";
import { BaseElement } from "../base";

export class ScrollingPanel extends BaseElement {

    constructor(
        public size: DimensionExpression,
        public offset: PositionExpression
    ) {
        super(offset, size);
    }

    
}