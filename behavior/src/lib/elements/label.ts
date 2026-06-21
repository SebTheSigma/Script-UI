import { charMap, DEFAULT_CHAR_WIDTH } from "../char";
import { BaseElement } from "./base";

type TextAlignment = "left" | "center" | "right";

export class Label extends BaseElement {
    public size = { width: 0, height: 0 };
    constructor(
        public text: string,
        public x: number | string,
        public y: number | string,
        public fontSize: number,
        public textAlignment: TextAlignment = "left",
    ) {
        super(x, y, 0, 0);
        this.size.width = this.getTextWidth();
        this.size.height = this.getTextHeight();

        super.setW(this.size.width);
        super.setH(this.size.height);
    }

    public getTextWidth(): number {
        return this.text.split("").reduce((acc, char) => acc + (charMap.get(char) || DEFAULT_CHAR_WIDTH), 0);
    }

    public getTextHeight(): number {
        return this.fontSize * 8; // Rough estimate
    }

    public clone() {
        return new Label(this.text, this.x, this.y, this.fontSize, this.textAlignment);
    }
}
