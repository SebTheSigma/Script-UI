import { system, world, Player, ItemUseBeforeEvent } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, ModalFormData } from "@minecraft/server-ui";
import { BLANK_TEX, DEFAULT_BUTTON_TEX } from "./data";
import { charMap, DEFAULT_CHAR_WIDTH } from "./char";
import { Button } from "./elements/button";
import { Image } from "./elements/image";
import { Label } from "./elements/label";
import { BodyTextures, DynamicPacketMap, Element, SizedElement } from "./general/types";
import { Stacker } from "./elements/stacker";
import { UIUtils } from "./general/util";

export class DynamicActionUI {
    private f: ActionFormData;
    private hasTitle = false;
    private PACKET_INDEXER_SIZE = 3;

    public buttons: Button[] = [];
    public images: Image[] = [];
    public labels: Label[] = [];

    constructor(
        private width: number,
        private height: number,
        private bodyTextures: BodyTextures,
    ) {
        this.f = new ActionFormData();
    }

    title(text: string): void {
        const packets: DynamicPacketMap = {
            title: text,
            body: this.bodyTextures.body_texure ?? BLANK_TEX,
            header: this.bodyTextures.header_texture ?? BLANK_TEX,
        };

        const nums = [this.width, this.height];
        const string = this.buildDynamicString(packets, nums, "dynamic:");

        this.f.title(string);
        this.hasTitle = true;
    }

    button(button: Button): DynamicActionUI {
        const { ButtonPanel, ButtonImage: image, ButtonLabel: label, options } = button;
        let { x, y, w, h } = ButtonPanel;

        const {
            centerI = false,
            centerTextX = false,
            localiseText = false,
            localiseImage = false,
            forceGlobalImageParent = false,
            forceGlobalTextParent = false,
            button_textures = DEFAULT_BUTTON_TEX,
        } = options ?? {};

        const { default_texture = DEFAULT_BUTTON_TEX.default_texture, hover_texture = DEFAULT_BUTTON_TEX.hover_texture } = button_textures;

        const parentDim = { width: this.width, height: this.height };
        x = UIUtils.processUnitString(x, parentDim.width);
        y = UIUtils.processUnitString(y, parentDim.height);
        w = UIUtils.processUnitString(w, parentDim.width);
        h = UIUtils.processUnitString(h, parentDim.height);

        let ix = image?.x ?? 0;
        let iy = image?.y ?? 0;
        let iw = image?.w ?? 0;
        let ih = image?.h ?? 0;

        const imageParentDim = forceGlobalImageParent ? parentDim : { width: w, height: h };
        ix = UIUtils.processUnitString(ix, imageParentDim.width);
        iy = UIUtils.processUnitString(iy, imageParentDim.height);
        iw = UIUtils.processUnitString(iw, imageParentDim.width);
        ih = UIUtils.processUnitString(ih, imageParentDim.height);

        let tx = label?.x ?? 0;
        let ty = label?.y ?? 0;

        const labelParentDim = forceGlobalTextParent ? parentDim : { width: w, height: h };
        tx = UIUtils.processUnitString(tx, labelParentDim.width);
        ty = UIUtils.processUnitString(ty, labelParentDim.height);

        if (localiseImage) {
            ix += x;
            iy += y;
        }

        ix = centerI ? (w - iw) / 2 + ix : ix;
        iy = centerI ? (h - ih) / 2 + iy : iy;

        if (localiseText) {
            tx += x;
            ty += y;
        }

        const fontSize = label?.fontSize ?? 1;

        const textWidth = label?.size.width;

        if (textWidth && textWidth < w && centerTextX) {
            tx += (w - textWidth) / 2;
        }

        const packets: DynamicPacketMap = {
            font_scale: fontSize * 100,
            text: label?.text ?? "",
            default_tex: default_texture,
            hover_tex: hover_texture,
        };

        // Account for stack panel width stacking by removing 1 px based on index
        const elements = this.countElements();
        x -= elements;
        ix -= elements;
        tx -= elements;

        const nums = [w, h, x, y, iw, ih, ix, iy, tx, ty].map((n) => Math.floor(n));
        const string = this.buildDynamicString(packets, nums, `b${this.generateRandomString(9)}:`);

        button.elementIndex = this.countElements();

        this.buttons.push(button);
        this.f.button(string, image?.texture);

        return this;
    }

    image(image: Image): DynamicActionUI {
        let { x, y, w, h } = image;
        const parentDim = { width: this.width, height: this.height };
        x = UIUtils.processUnitString(x, parentDim.width);
        y = UIUtils.processUnitString(y, parentDim.height);
        w = UIUtils.processUnitString(w, parentDim.width);
        h = UIUtils.processUnitString(h, parentDim.height);

        x -= this.countElements();

        const nums = [x, y, w, h].map((n) => Math.floor(n));
        const string = `i${this.generateRandomString(9)}:${nums.map((n) => this.formatNumber(n)).join(":")}`;

        this.f.header(`${string}:${image.texture}`); // No need for packets as only one packet, meaning i can just read the remaining string

        image.elementIndex = this.countElements();

        this.images.push(image);
        return this;
    }

    label(label: Label): DynamicActionUI {
        let { x, y, text, fontSize, textAlignment } = label;
        const parentDim = { width: this.width, height: this.height };
        x = UIUtils.processUnitString(x, parentDim.width);
        y = UIUtils.processUnitString(y, parentDim.height);

        if (textAlignment === "center") {
            const textWidth = label.size.width;

            if (textWidth < this.width) {
                x += (this.width - textWidth) / 2;
            }
        } else if (textAlignment === "right") {
            let textWidth = 0;
            for (const char of text ?? "") {
                textWidth += (charMap.get(char) ?? DEFAULT_CHAR_WIDTH) * fontSize;
            }

            if (textWidth < this.width) {
                x += this.width - textWidth;
            }
        }

        x -= this.countElements();

        const nums = [x, y, fontSize * 100].map((n) => Math.floor(n));
        const string = `l${this.generateRandomString(9)}:${nums.map((n) => this.formatNumber(n)).join(":")}`;

        this.f.label(`${string}:${text}`); // No need for packets as only one packet, meaning i can just read the remaining string

        label.elementIndex = this.countElements();

        this.labels.push(label);
        return this;
    }

    private countElements(): number {
        return [...this.buttons, ...this.images, ...this.labels].length;
    }

    stack(stacker: Stacker): DynamicActionUI {
        const resolver = (
            parentStacker: Stacker,
            parentSize: { width: number; height: number },
            carryingOffset: { x: number; y: number } = { x: 0, y: 0 },
        ): { width: number; height: number } => {
            const isHorizontal = parentStacker.orientation === "horizontal";

            const stackerOffsetX = UIUtils.processUnitString(parentStacker.x, parentSize.width);
            const stackerOffsetY = UIUtils.processUnitString(parentStacker.y, parentSize.height);

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

                const rawWidth = element.w;
                const rawHeight = element.h;

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
                if (element instanceof Image) this.image(element);
                if (element instanceof Label) this.label(element);
            }

            return {
                width: totalWidth,
                height: totalHeight,
            };
        };

        const measure = (stacker: Stacker, parentSize: { width: number; height: number }): { width: number; height: number } => {
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

    show(player: Player): void {
        if (!this.hasTitle) throw new Error("DynamicActionUI Needs a title!");

        this.f.show(player).then((response) => {
            if (response.canceled) return;
            // Iterate through buttons to find matching elementIndex[cite: 8]
            for (const button of this.buttons) {
                if (response.selection === button.elementIndex) {
                    if (button.options?.onClick) {
                        button.options.onClick();
                    }
                }
            }
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
            const length = packet.toString().length;

            result += `${this.formatNumber(cumulativeLength + packetHeaderLength)}:` + `${this.formatNumber(cumulativeLength + packetHeaderLength + length)}:`;

            cumulativeLength += length + 1;
        }

        result += Object.values(packets)
            .map((p) => p.toString())
            .join(":");

        return result;
    }
}
