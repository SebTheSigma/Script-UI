import { charMap, DEFAULT_CHAR_WIDTH } from "../char";
import { Expression, PositionExpression } from "../general/types";
import { BaseElement } from "./base";

export type TextAlignment = "left" | "center" | "right";

export enum LabelOptionWrapType {
    CharacterWrap = 'characterWrap',
    WordWrap = 'wordWrap'
}

export interface LabelOptions {

    /**
     * CharacterWrap: cuts the string where the character would leave the designated wrapWidth
     * WordWrap: cuts the string where the word would leave the designated wrapWidth
     * @default LabelOptionWrapType.WordWrap
     */
    wrapType?: LabelOptionWrapType
}

export class Label extends BaseElement {
    public size = { width: 0, height: 0 };
    public wrappedText: string | undefined;

    constructor(
        public text: string,
        public offset: PositionExpression,
        public fontSize: number,
        public textAlignment: TextAlignment = "left",
        public wrapWidth?: number,
        public labelOptions: LabelOptions = {
            wrapType: LabelOptionWrapType.WordWrap
        }
    ) {
        super(offset, { width: 0, height: 0 });
        this.size.width = wrapWidth ?? this.getTextWidth();
        this.size.height = this.getTextHeight();

        // Caches
        if (wrapWidth !== undefined) this.wrappedText = this.wrapText();

        super.setW(this.size.width);
        super.setH(this.size.height);
    }

    public getText(): string {
        return this.wrappedText ?? this.text;
    }

    public wrapText(): string {
        let wrappedText: string = '';

        if (this.labelOptions.wrapType === LabelOptionWrapType.CharacterWrap) {
            const lines = [];

            let currLine: string = '';
            let currCharCount = 0;

            for (let i = 0; i < this.text.length; i++) {
                const char = this.text[i];

                const charWidth = Label.getTextWidth(currLine + char, this.fontSize);

                if (charWidth > this.wrapWidth!) {
                    if (currCharCount === 0) {
                        lines.push(char);
                        currLine = '';
                        currCharCount = 0;
                        continue;
                    }

                    lines.push(currLine);
                    currLine = ''
                    currCharCount = 0;
                }

                currLine += char;
                currCharCount++;

                // If string is ending
                if (i === this.text.length - 1) {
                    lines.push(currLine);
                }
            }

            this.size.height = this.getTextHeight() * lines.length;

            wrappedText = lines.join('\n');
        }

        else if (this.labelOptions.wrapType === LabelOptionWrapType.WordWrap) {
            const tokens = this.text.split(' ');

            const lines = [];
            let currLine: string = '';
            let currCharCount = 0;

            for (let i = 0; i < tokens.length; i++) {
                const chars = tokens[i];
                const charWidth = Label.getTextWidth(currLine + chars, this.fontSize);

                if (charWidth > this.wrapWidth!) {
                    if (currCharCount === 0) {
                        lines.push(chars);
                        currLine = '';
                        currCharCount = 0;
                        continue;
                    }

                    lines.push(currLine);

                    currLine = '';
                    currCharCount = 0;
                }

                if (currLine !== '') currLine += " ";
                currLine += chars;
                currCharCount++;

                // If string is ending
                if (i === tokens.length - 1) {
                    lines.push(currLine);
                }
            }

            this.size.height = this.getTextHeight() * lines.length;

            wrappedText = lines.join('\n');
        }

        return wrappedText;
    }

    public getTextWidth(): number {
        let length = 0;

        for (let i = 0;i < this.text.length;i ++) {
            const char = this.text[i];
            const nextChar: string | undefined = (i === this.text.length - 1) ? undefined : this.text[i + 1];
            const charWidth = charMap.get(char) ?? DEFAULT_CHAR_WIDTH;

            if (char === "§" && nextChar !== "§") {
                i += 1;
                continue; // Overall i goes up by 2
            }

            else if (char === "§" && nextChar === "§") {
                i += 1;
                length += charWidth; // Overall length goes up
                continue; // Overall i goes up by 2
            }

            else if (char === "§" && !nextChar) {
                continue;
            }

            length += charWidth;
        }

        return length * this.fontSize;
    }

    public static getTextWidth(text: string, fontScale: number): number {
        let length = 0;

        for (let i = 0;i < text.length;i ++) {
            const char = text[i];
            const nextChar: string | undefined = (i === text.length - 1) ? undefined : text[i + 1];
            const charWidth = charMap.get(char) ?? DEFAULT_CHAR_WIDTH;

            if (char === "§" && nextChar !== "§") {
                i += 1;
                continue; // Overall i goes up by 2
            }

            else if (char === "\\" && nextChar === "§") {
                i += 1;
                length += charWidth + (charMap.get(nextChar) ?? DEFAULT_CHAR_WIDTH); // Overall length goes up
                continue; // Overall i goes up by 2
            }

            else if (char === "§" && !nextChar) {
                continue;
            }

            length += charWidth;
        }

        return length * fontScale;
    }

    public getTextHeight(): number {
        return this.fontSize * 8; // Rough estimate
    }

    public getAlignmentOffset(parentWidth?: number) {
        let correctedTitleX = 0;

        // Width chain
        let width = parentWidth ?? this.parentalDimensions?.width;

        if (!width) {
            console.warn('Warning: Parent width cant be found while derriving alignment offset');
            width = 0;
        }

        let textWidth = this.getTextWidth();
        
        if (this.wrappedText) {
            let longestLineWidth = 0;
            
            // Get longest line
            for (let line of this.wrappedText.split('\n')) {
                const textWidth = Label.getTextWidth(line, this.fontSize);

                if (textWidth > longestLineWidth) longestLineWidth = textWidth;
            }

            textWidth = longestLineWidth;
        }

        
        if (this.textAlignment === "left") {
            correctedTitleX = 0;
        }

        else if (this.textAlignment === "center") {
            correctedTitleX = (width - textWidth) / 2;
        }

        else if (this.textAlignment === "right") {
            correctedTitleX = width - textWidth;
        }

        return correctedTitleX;
    }

    public clone() {
        return new Label(this.text, { ...this.offset }, this.fontSize, this.textAlignment, this.wrapWidth, { ...this.labelOptions });
    }
}
