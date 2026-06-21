# Script-UI
Dynamic, script side json ui forms.

## What you can do:

**General editing:**
- Edit header texture
- Edit header text
- Edit body texture
- Edit body size

**Complete control over buttons:**
- Edit button x offset and y offset
- Edit button width and height
- Edit button default and hover textures
- Edit button image (see image editing)
- Edit button label (see label editing)
- Several complex and useful button arguments:
```typescript
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
     * Almost always needed to be `true` otherwise text anchors to the form instead of the button
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
```

**Complete control over images:**
- Edit image texture
- Edit image x offset and y offset
- Edit image width and height

**Complete control over labels:**
- Edit label text
- Edit label x offset and y offset
- Edit fontsize / font scale
- Edit text alignment:
```typescript
type TextAlignment = "left" | "center" | "right";
```

**Dynamic flow-like UI with stackers:**
- Edit stacker gap (the gap used between stacked elements)
- Add a fixed offset for the stacker that influences all stacker elements
- Control the orientation of the stacker, deciding which direction elements generate in

## Examples:
See ```behavior/src/examples```
