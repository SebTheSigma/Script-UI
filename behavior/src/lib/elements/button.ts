import { DimensionExpression, Expression, PositionExpression } from "../general/types";
import { BaseElement } from "./base";
import { Image } from "./image";
import { Label } from "./label";

export interface ButtonOptions {

    /**
     * Centers the image in the button
     * @default false
     */
    centerI?: boolean;

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

    buttonTextures?: {
        default_texture?: string;
        hover_texture?: string;
    };

    /**
     * Shows text at the point point when hover over a button, the texture cannot be changed as mojang have it hardcoded.
     * Useful for tooltips / extra info
     * @default EmptyString
     */
    hoverText?: string;

    /**
     * If true clicking this button will not count as a button click in terms of the `hardClose` parameter in onClose
     * @default false
     */
    isCloseButton?: boolean;
}

// Currently keeping button panel purely for the flowy typing
// when using the button class

export class ButtonPanel {
    constructor(
        public offset: PositionExpression,
        public size: DimensionExpression,
    ) {}

    public clone() {
        return new ButtonPanel({ ...this.offset }, { ...this.size });
    }
}

export class Button extends BaseElement {
    constructor(
        public ButtonPanel: ButtonPanel,
        public ButtonImage?: Image,
        public ButtonLabel?: Label,
        public onClick?: () => void,
        public options: ButtonOptions = {},
    ) {
        super(ButtonPanel.offset, ButtonPanel.size);
    }

    public clone() {
        return new Button(
            this.ButtonPanel.clone(),
            this.ButtonImage?.clone(),
            this.ButtonLabel?.clone(),
            this.onClick,
            { ...this.options }
        );
    }
}
