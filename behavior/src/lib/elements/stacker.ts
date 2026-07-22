import { Element, Expression, PositionExpression } from "../general/types";

export class Stacker {
    public elements: Element[];
    public spacing: Expression = 0;
    public orientation: "horizontal" | "vertical" = "vertical";
    public offset: PositionExpression = { x: 0, y: 0 };

    constructor(...elements: Element[]) {
        this.elements = elements;
    }

    public setOffset(offset: PositionExpression) {
        this.offset = offset;

        return this;
    }

    public gap(spacing: Expression) {
        this.spacing = spacing;

        return this;
    }


    public orientate(orientation: "horizontal" | "vertical") {
        this.orientation = orientation;

        return this;
    }

    public clone(): Stacker {
        const clone = new Stacker(...this.elements.map((element) => element.clone()));

        clone.spacing = this.spacing;
        clone.orientation = this.orientation;
        clone.offset = { ...this.offset };

        return clone;
    }
}
