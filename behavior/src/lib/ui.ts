import { system, world, Player, ItemUseBeforeEvent } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, ModalFormData } from "@minecraft/server-ui";
import { BLANK_TEX, DEFAULT_BUTTON_TEX } from "./data";
import { charMap, DEFAULT_CHAR_WIDTH } from "./char";
import { Button } from "./elements/button";
import { Image } from "./elements/image";
import { Label, TextAlignment } from "./elements/label";
import { BodyTextures, Dimensions, DynamicPacketMap, Element, Position, SizedElement } from "./general/types";
import { Stacker } from "./elements/stacker";
import { UIUtils } from "./general/util";
import { HeaderOptions } from "./elements/singles/header";
import { Grid } from "./elements/grid";
import { PlayerRenderer } from "./elements/playerRenderer";
import { ScrollingPanel } from "./elements/singles/scrollingPanel";
import { utf8Bytes } from "./bytes";

type OnCloseCallback = (hardClose: boolean) => any;

export class DynamicActionUI {
    private f: ActionFormData;
    private hasTitle = false;
    private addTitle: (() => any) | undefined;

    public scrollHeight: number = 0;
    private scrollingPanel: ScrollingPanel;

    private PACKET_INDEXER_SIZE = 3;
    private NEGATIVE_OFFSET = 500;
    private onCloseCallback: OnCloseCallback | undefined;

    public buttons: Button[] = [];
    public images: Image[] = [];
    public labels: Label[] = [];

    // Max 1
    public playerRenderers: PlayerRenderer[] = [];

    constructor(
        private width: number,
        private height: number,
        private bodyTextures: BodyTextures,
        private headerSize: Dimensions = { width, height },
        private headerOffset: Position = { x: 0, y: 0 },
        private headerOptions: HeaderOptions = { autoCenter: false }
    ) {
        this.f = new ActionFormData();

        this.scrollingPanel = new ScrollingPanel({ width, height }, { x: 0, y: 0 });
    }

    customScrollingContentPanel(scrollingPanel: ScrollingPanel) {
        this.scrollingPanel = scrollingPanel;
    }

    title(title: Label): void {
        title.setParentalDimensions(this.headerSize);

        const {
            fontSize
        } = title;

        const packets: DynamicPacketMap = {
            title: title.getText(),
            body: this.bodyTextures.body_texure ?? BLANK_TEX,
            header: this.bodyTextures.header_texture ?? BLANK_TEX,
            font_scale: fontSize * 100,
        };

        const correctedHeaderY = this.headerOffset.y - this.headerSize.height;

        let correctedHeaderX = this.headerOffset.x;

        // Auto center logic
        if (this.headerOptions.autoCenter) {
            correctedHeaderX = (this.width - this.headerSize.width) / 2;
        }

        // Text alignment
        let titleOffset = title.getAlignmentOffset(this.headerSize.width);

        // Combines alignment with offset
        titleOffset += title.getBoundingX();
        

        const nums = [this.width, this.height, this.headerSize.width, this.headerSize.height, correctedHeaderX + this.NEGATIVE_OFFSET, correctedHeaderY + this.NEGATIVE_OFFSET, titleOffset + this.NEGATIVE_OFFSET, title.getBoundingY() + this.NEGATIVE_OFFSET].map(n => Math.floor(n));

        this.hasTitle = true;

        this.addTitle = () => {
            this.scrollingPanel.setParentalDimensions({ width: this.width, height: this.height });
            const w = this.scrollingPanel.getBoundingW();
            const h = this.scrollingPanel.getBoundingH();
            const x = this.scrollingPanel.getBoundingX();
            const y = this.scrollingPanel.getBoundingY();

            nums.push(w);
            nums.push(h);
            nums.push(x + 500);
            nums.push(y + 500);

            nums.push(this.scrollHeight);

            const string = this.buildDynamicString(packets, nums.map(n => Math.floor(n)), "dynamic:");

            this.f.title(string);
        }
    }

    button(button: Button): DynamicActionUI {
        const { ButtonImage: image, ButtonLabel: label, options } = button;

        const parentDim = {
            width: this.width,
            height: this.height
        };

        button.safeSetParentalDimensions(parentDim);

        const buttonOffset = {
            x: button.getBoundingX(),
            y: button.getBoundingY()
        };

        const buttonDimensions = {
            width: button.getBoundingW(),
            height: button.getBoundingH()
        };

        const {
            centerI = false,
            localiseText = false,
            localiseImage = false,
            forceGlobalImageParent = false,
            forceGlobalTextParent = false,
            buttonTextures = DEFAULT_BUTTON_TEX,
            hoverText,
            isCloseButton = false
        } = options ?? {};

        const {
            default_texture,
            hover_texture,
        } = buttonTextures;

        forceGlobalImageParent ? image?.setParentalDimensions(parentDim) : image?.safeSetParentalDimensions(buttonDimensions)
        let ix = image?.getBoundingX() ?? 0;
        let iy = image?.getBoundingY() ?? 0;
        let iw = image?.getBoundingW() ?? 0;
        let ih = image?.getBoundingH() ?? 0;

        forceGlobalTextParent ? label?.setParentalDimensions(parentDim) : label?.safeSetParentalDimensions(buttonDimensions);
        let tx = label?.getBoundingX() ?? 0;
        let ty = label?.getBoundingY() ?? 0;

        if (localiseImage && image) {
            ix! += buttonOffset.x;
            iy! += buttonOffset.y;
        }

        if (centerI && image) {
            ix = (buttonDimensions.width - iw!) / 2 + ix!;
            iy = (buttonDimensions.height - ih!) / 2 + iy!;
        }

        if (localiseText && label) {
            tx! += buttonOffset.x;
            ty! += buttonOffset.y;
        }

        const fontSize = label?.fontSize ?? 1;

        if (label) {
            const alignmentOffset = label?.getAlignmentOffset(button.getBoundingW()) ?? 0;
            tx! += alignmentOffset;
        }

        const packets: DynamicPacketMap = {
            font_scale: fontSize * 100,
            text: label?.getText() ?? "",
            default_tex: default_texture ?? "",
            hover_tex: hover_texture ?? "",
            hover_text: hoverText ?? ""
        };

        const nums = [buttonDimensions.width, buttonDimensions.height, buttonOffset.x + this.NEGATIVE_OFFSET, buttonOffset.y + this.NEGATIVE_OFFSET, iw, ih, ix + this.NEGATIVE_OFFSET, iy + this.NEGATIVE_OFFSET, tx + this.NEGATIVE_OFFSET, ty + this.NEGATIVE_OFFSET].map((n) => Math.floor(n));
        const string = this.buildDynamicString(packets, nums, `b${this.generateRandomString(9)}:`);

        button.elementIndex = this.buttons.length;

        this.buttons.push(button);
        this.f.button(string, image?.texture);

        this.tryUpdateScrollHeight(buttonDimensions.height + buttonOffset.y);

        return this;
    }

    grid(grid: Grid) {
        const { buttons, dimensions } = grid;
        const { width, height } = dimensions;

        grid.safeSetParentalDimensions({ width: this.width, height: this.height });
        const w = grid.getBoundingW();
        const h = grid.getBoundingH();
        const boundingX = grid.getBoundingX();
        const boundingY = grid.getBoundingY();

        if (buttons.length !== dimensions.width * dimensions.height) {
            throw new Error('Amount of buttons doesnt match grid dimensions');
        }

        const dx = (w ?? this.width) / width;
        const dy = (h ?? this.height) / height;

        for (let x = 0; x < width;x ++) {
            for (let y = 0; y < height;y ++) {
                const id = (y * width) + x;
                const button = buttons[id];

                button.setParentalDimensions({ width: w, height: h });

                button.setX((dx * x) + boundingX);
                button.setY((dy * y) + boundingY);

                this.button(button);
            }
        }
    }

    image(image: Image): DynamicActionUI {
        image.safeSetParentalDimensions({ width: this.width, height: this.height });
        let x = image.getBoundingX();
        let y = image.getBoundingY();
        let w = image.getBoundingW();
        let h = image.getBoundingH();

        const nums = [x + this.NEGATIVE_OFFSET, y + this.NEGATIVE_OFFSET, w, h].map((n) => Math.floor(n));
        const string = `i${this.generateRandomString(9)}:${nums.map((n) => this.formatNumber(n)).join(":")}`;

        this.f.header(`${string}:${image.texture}`); // No need for packets as only one packet, meaning i can just read the remaining string

        this.tryUpdateScrollHeight(h + y);

        this.images.push(image);
        return this;
    }

    label(label: Label): DynamicActionUI {
        let { fontSize, textAlignment } = label;
        const text = label.getText();

        label.safeSetParentalDimensions({ width: this.width, height: this.height });
        let x = label.getBoundingX();
        let y = label.getBoundingY();
        let h = label.getBoundingH();

        const alignmentOffset = label.getAlignmentOffset();

        x += alignmentOffset;

        const nums = [x + this.NEGATIVE_OFFSET, y + this.NEGATIVE_OFFSET, fontSize * 100].map((n) => Math.floor(n));
        const string = `l${this.generateRandomString(9)}:${nums.map((n) => this.formatNumber(n)).join(":")}`;

        this.f.label(`${string}:${text}`); // No need for packets as only one packet, meaning i can just read the remaining string

        this.tryUpdateScrollHeight(h + y);

        this.labels.push(label);
        return this;
    }

    playerRenderer(renderer: PlayerRenderer) {
        const {
            lookAtCursor = true,
            topPadding = 0
        } = renderer.options;

        if (this.playerRenderers.length > 0) {
            throw new Error("You can only have 1 player renderer per form");
        }

        renderer.safeSetParentalDimensions({ width: this.width, height: this.height });
        let w = renderer.getBoundingW();
        let h = renderer.getBoundingH();
        let x = renderer.getBoundingX();
        let y = renderer.getBoundingY();

        x -= this.countElements();
        y -= topPadding;

        const nums = [x + 500, y + 500, w, h, lookAtCursor ? 1 : 0].map((n) => Math.floor(n));
        const string = `p${this.generateRandomString(9)}:${nums.map((n) => this.formatNumber(n)).join(":")}`;

        this.tryUpdateScrollHeight(h + y);

        this.f.body(string);

        this.playerRenderers.push(renderer);
        return this;
    }

    private countElements(): number {
        return [ ...this.labels, this.images, ...this.buttons, ...this.playerRenderers ].length;
    }

    stack(stacker: Stacker): DynamicActionUI {
        const resolver = (
            parentStacker: Stacker,
            parentSize: Dimensions,
            carryingOffset: Position = { x: 0, y: 0 },
        ): Dimensions => {
            const isHorizontal = parentStacker.orientation === "horizontal";

            const stackerOffsetX = UIUtils.processUnitString(parentStacker.offset.x, parentSize.width);
            const stackerOffsetY = UIUtils.processUnitString(parentStacker.offset.y, parentSize.height);

            const spacing = UIUtils.processUnitString(parentStacker.spacing, isHorizontal ? parentSize.width : parentSize.height);

            let cursor = 0;
            let totalWidth = 0;
            let totalHeight = 0;

            const elementQueue: Element[] = [];

            // ---------- PASS 1 : Measure ----------
            let flexibleElements: SizedElement[] = [];
            let totalFixedSize = 0;

            const spacingCount = parentStacker.elements.length > 1 ? parentStacker.elements.length - 1 : 0;

            for (const element of parentStacker.elements) {
                // ---- Nested stacker ----
                if (element instanceof Stacker) {
                    const size = measure(element, parentSize);

                    if (isHorizontal) totalFixedSize += size.width;
                    else totalFixedSize += size.height;

                    continue;
                }

                // ---- Standard element ----
                element.setParentalDimensions(parentSize);

                const rawWidth = element.size.width;
                const rawHeight = element.size.height;

                if (isHorizontal) {
                    totalFixedSize += element.getBoundingW();
                } else {
                    totalFixedSize += element.getBoundingH();
                }
            }

            // spacing
            totalFixedSize += spacing * spacingCount;

            // ---------- PASS 2 : Calculate flexible space ----------

            let remainingSpace = isHorizontal ? Math.max(parentSize.width - totalFixedSize, 0) : Math.max(parentSize.height - totalFixedSize, 0);

            if (flexibleElements.length > 0) {
                const sizePerElement = Math.floor(remainingSpace / flexibleElements.length);

                for (const element of flexibleElements) {
                    if (isHorizontal) element.setW(sizePerElement);
                    else element.setH(sizePerElement);
                }
            }

            // ---------- PASS 3 : Layout ----------

            for (const element of parentStacker.elements) {
                if (cursor !== 0) cursor += spacing;

                const baseX = carryingOffset.x + stackerOffsetX;
                const baseY = carryingOffset.y + stackerOffsetY;

                // ---- Nested stacker ----
                if (element instanceof Stacker) {
                    const childOffset = {
                        x: isHorizontal ? baseX + cursor : baseX,
                        y: isHorizontal ? baseY : baseY + cursor,
                    };

                    const size = resolver(element, parentSize, childOffset);

                    if (isHorizontal) {
                        cursor += size.width;
                        totalWidth = cursor;
                        totalHeight = Math.max(totalHeight, size.height);
                    } else {
                        cursor += size.height;
                        totalHeight = cursor;
                        totalWidth = Math.max(totalWidth, size.width);
                    }

                    continue;
                }

                // ---- Standard element ----
                element.setParentalDimensions(parentSize);

                const parsedX = element.getBoundingX();
                const parsedY = element.getBoundingY();
                const parsedW = element.getBoundingW();
                const parsedH = element.getBoundingH();

                const x = isHorizontal ? baseX + cursor : baseX;

                const y = isHorizontal ? baseY : baseY + cursor;

                element.setX(Math.floor(x + parsedX));
                element.setY(Math.floor(y + parsedY));

                elementQueue.push(element);

                if (isHorizontal) {
                    cursor += parsedW;
                    totalWidth = cursor;
                    totalHeight = Math.max(totalHeight, parsedH);
                } else {
                    cursor += parsedH;
                    totalHeight = cursor;
                    totalWidth = Math.max(totalWidth, parsedW);
                }
            }

            // ---------- PASS 4 : Add to UI ----------

            for (const element of elementQueue) {
                if (element instanceof Button) this.button(element);
                else if (element instanceof Image) this.image(element);
                else if (element instanceof Label) this.label(element);
                else if (element instanceof Grid) this.grid(element);
            }

            return {
                width: totalWidth,
                height: totalHeight,
            };
        };

        const measure = (stacker: Stacker, parentSize: Dimensions): Dimensions => {
            const isHorizontal = stacker.orientation === "horizontal";

            const spacing = UIUtils.processUnitString(stacker.spacing, isHorizontal ? parentSize.width : parentSize.height);

            let totalWidth = 0;
            let totalHeight = 0;
            let cursor = 0;

            for (const element of stacker.elements) {
                if (cursor !== 0) cursor += spacing;

                let w = 0;
                let h = 0;

                if (element instanceof Stacker) {
                    const size = measure(element, parentSize);
                    w = size.width;
                    h = size.height;
                } else {
                    element.setParentalDimensions(parentSize);
                    w = element.getBoundingW();
                    h = element.getBoundingH();
                }

                if (isHorizontal) {
                    cursor += w;
                    totalWidth = cursor;
                    totalHeight = Math.max(totalHeight, h);
                } else {
                    cursor += h;
                    totalHeight = cursor;
                    totalWidth = Math.max(totalWidth, w);
                }
            }

            return {
                width: totalWidth,
                height: totalHeight,
            };
        };

        resolver(stacker.clone(), { width: this.width, height: this.height });

        return this;
    }

    setScrollHeight(height: number) {
        this.scrollHeight = height;
    }
    
    tryUpdateScrollHeight(height: number) {
        if (height > this.scrollHeight) this.setScrollHeight(height);
    }

    /**
     * 
     * @param callBack Hard close occurs when the form is closed without a button being clicked / the form being closed by clicking a close button
     */
    onClose(callBack: OnCloseCallback) {
        this.onCloseCallback = callBack;
    }

    show(player: Player): void {
        if (!this.hasTitle) throw new Error("DynamicActionUI Needs a title!");

        // This is done after calculating scroll height as scroll height is sent through the title
        if (this.addTitle) this.addTitle();

        this.f.show(player).then((response) => {
            if (response.canceled) {

                // Hard close
                if (this.onCloseCallback) this.onCloseCallback(true);
                return;
            }

            let hardClose = true;

            // Iterate through buttons to find matching elementIndex
            for (const button of this.buttons) {
                if (response.selection === button.elementIndex) {

                    // Makes sure clicking a close button is still considered a hard close
                    if (!button.options.isCloseButton) hardClose = false;

                    if (button.onClick) {
                        button.onClick();
                    }
                }
            }

            if (this.onCloseCallback) this.onCloseCallback(hardClose);
        });
    }

    private generateRandomString(length: number): string {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    private formatNumber(num: number): string {

        if (num < -99 || num > 999) {
            throw new Error("A value is either over 999 or less than -99")
        }

        // -99 to 999
        if (num < 0) {
            return `-${(-num).toString().padStart(this.PACKET_INDEXER_SIZE - 1, "0")}`;
        }
        if (num > 999) return "999";
        return num.toString().padStart(this.PACKET_INDEXER_SIZE, "0");
    }

    private buildDynamicString(packets: DynamicPacketMap, nums: number[], prefix: string): string {
        let result = `${prefix}${nums.map((n) => this.formatNumber(n)).join(":")}|`;

        let cumulativeLength = 0;
        const keys = Object.keys(packets);

        const packetHeaderLength = keys.length * 2 * (this.PACKET_INDEXER_SIZE + 1) + result.length;

        for (const key of keys) {
            const packet = packets[key];
            const packetStr = packet.toString();

            const utfByteLength = utf8Bytes(packetStr).length;

            result += `${this.formatNumber(cumulativeLength + packetHeaderLength)}:` + `${this.formatNumber(cumulativeLength + packetHeaderLength + utfByteLength)}:`;

            cumulativeLength += utfByteLength + 1;
        }

        result += Object.values(packets)
            .map((p) => p.toString())
            .join(":");

        // console.warn(result);

        return result;
    }
}
