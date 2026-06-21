import { Element } from "../general/types";

export class Stacker {
    public elements: Element[];
    private padding: { top: number | string; bottom: number | string; left: number | string; right: number | string } = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };
    public spacing: number | string = 0;
    public shouldOccupySpace = true;
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

    public pad(padding: number | string) {
        this.padding.top = padding;
        this.padding.bottom = padding;
        this.padding.left = padding;
        this.padding.right = padding;

        return this;
    }
    public padB(padding: number | string) {
        this.padding.bottom = padding;

        return this;
    }
    public padT(padding: number | string) {
        this.padding.top = padding;

        return this;
    }
    public padL(padding: number | string) {
        this.padding.left = padding;

        return this;
    }
    public padR(padding: number | string) {
        this.padding.right = padding;

        return this;
    }

    public orientate(orientation: "horizontal" | "vertical") {
        this.orientation = orientation;

        return this;
    }

    public occupy(occupy: boolean = true) {
        this.shouldOccupySpace = occupy;
    }

    public clone(): Stacker {
        const clone = new Stacker(...this.elements.map((element) => element.clone()));

        clone.padding = { ...this.padding };
        clone.spacing = this.spacing;
        clone.orientation = this.orientation;
        clone.x = this.x;
        clone.y = this.y;

        return clone;
    }
}
