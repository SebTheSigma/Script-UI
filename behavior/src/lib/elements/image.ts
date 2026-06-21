import { BaseElement } from "./base";

export class Image extends BaseElement {

    constructor(
        public texture: string,
        public x: number | string,
        public y: number | string,
        public w: number | string,
        public h: number | string,
    ) {
        super(x, y, w, h);
    }

    public clone() {
        return new Image(this.texture, this.x, this.y, this.w, this.h);
    }
}


