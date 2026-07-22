# Script-UI
Dynamic, script side json ui forms, every property listed below can be changed without reloading a resource pack.

## What you can do:

**General editing:**
- Edit header texture
- Edit header text
- Edit header size
- Edit header offset
- Edit title (see label editing) with extra arguments
```typescript
export interface TitleHeaderOptions {

    /**
     * Auto-matically centers the title horizontally in respect to the form
     * @default false
     */
    autoCenter?: boolean;

    /**
     * When true, the titleX offset combines with the calculated text alignment offset,
     * otherwise the titleX offset is overrided
     * @default false
     */
    alignmentShouldCombine?: boolean;
}
```
  
- Edit form body texture
- Edit form body size

**Complete control over buttons:**
- Edit button x offset and y offset
- Edit button width and height
- Edit button default and hover textures
- Edit button image (see image editing)
- Edit button label (see label editing)
- Edit button hover text
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
```

**Complete control over images:**
- Edit image texture
- Edit image x offset and y offset
- Edit image width and height

**Complete control over labels:**
- Edit label text
- Edit label x offset and y offset
- Edit fontscale
- Edit text alignment:
```typescript
type TextAlignment = "left" | "center" | "right";
```
- Text wrapping system (charcter and word wrap)
```typescript
export interface LabelOptions {

    /**
     * CharacterWrap: cuts the string where the character would leave the designated wrapWidth
     * WordWrap: cuts the string where the word would leave the designated wrapWidth
     * @default LabelOptionWrapType.WordWrap
     */
    wrapType?: LabelOptionWrapType
}
```

**Grids**
- Take an input of buttons and order them in a grid
- Uses grid dimensions and size dimensions to allow for more complex layouts

**Player Renderer**
- Renders the player opening the form
- Edit player size
- Edit player offset
- Edit extra properties
```typescript
export interface PlayerRendererOptions {

    /**
     * Automatically makes the player renderer look at the cursors position
     * @default true
     */
    lookAtCursor: boolean
}
```

**Dynamic flow-like UI with stackers:**
- Edit stacker gap (the gap used between stacked elements)
- Add a fixed offset for the stacker that influences all stacker elements
- Control the orientation of the stacker, deciding which direction elements generate in

## Examples:
See ```behavior/src/examples```
