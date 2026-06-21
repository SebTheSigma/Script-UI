import { BaseElement } from "./base";
import { Image } from "./image";
import { Label } from "./label";

export interface ButtonOptions {

    /**
     * Calls the callback function when the button has been clicked
     */
    onClick?: () => void;

    /**
     * Centers the image in the button
     * @default false
     */
    centerI?: boolean;

    /**
     * Centers the text width-wise (across the x axis)
     * @default false
     */
    centerTextX?: boolean;

    /**
     * Positions the text local to the button, so an increase in button position means an increase in text position,
     * almost always needed to be `true` otherwise text anchors to the form instead of the button
     * @default false
     */
    localiseText?: boolean;

    /**
     * Positions the image local to the button, so an increase in button position means an increase in image position,
     * almost always needed to be `true` otherwise image anchors to the form instead of the button
     * @default false
     */
    localiseImage?: boolean;

    /**
     * Force the image to inherit the parent size from the form panel instead of the button panel,
     * meaning expressions involving percentages, e.g. `50% + 5px` inherit size from the form
     * @default false
     */
    forceGlobalImageParent?: boolean;

    /**
     * Force the text to inherit the parent size from the form panel instead of the button panel,
     * meaning expressions involving percentages, e.g. `50% + 5px` inherit size from the form
     * @default false
     */
    forceGlobalTextParent?: boolean;

    button_textures?: {
        default_texture?: string;
        hover_texture?: string;
    };
}

// Currently keeping button panel purely for the flowy typing
// when using the button class

export class ButtonPanel {
    constructor(
        public x: number | string,
        public y: number | string,
        public w: number | string,
        public h: number | string,
    ) {}

    public clone() {
        return new ButtonPanel(this.x, this.y, this.w, this.h);
    }
}

export class Button extends BaseElement {
    constructor(
        public ButtonPanel: ButtonPanel,
        public ButtonImage?: Image,
        public ButtonLabel?: Label,
        public options: ButtonOptions = {},
    ) {
        super(ButtonPanel.x, ButtonPanel.y, ButtonPanel.w, ButtonPanel.h);
    }

    setX(x: number | string) {
        super.setX(x);            // update Button
        this.ButtonPanel.x = x;   // also update panel
    }

    setY(y: number | string) {
        super.setY(y);
        this.ButtonPanel.y = y;
    }

    setW(w: number | string) {
        super.setW(w);
        this.ButtonPanel.w = w;
    }

    setH(h: number | string) {
        super.setH(h);
        this.ButtonPanel.h = h;
    }

    public clone() {
        return new Button(this.ButtonPanel.clone(), this.ButtonImage?.clone(), this.ButtonLabel?.clone(), { ...this.options });
    }
}
