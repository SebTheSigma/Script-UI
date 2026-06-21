import { Element } from "../general/types";

export class Stacker {
    public elements: Element[];
    public spacing: number | string = 0;
    public orientation: "horizontal" | "vertical" = "vertical";
    public x: number | string = 0;
    public y: number | string = 0;

    constructor(...elements: Element[]) {
        this.elements = elements;
    }

    public setOffset(x: number | string, y: number | string) {
        this.x = x;
        this.y = y;

        return this;
    }

    public gap(spacing: number | string) {
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
        clone.x = this.x;
        clone.y = this.y;

        return clone;
    }
}
