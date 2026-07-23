import { DEFAULT_PANEL_TEX } from "../lib/data";
import { Player } from "@minecraft/server";
import { Button, ButtonOptions, ButtonPanel } from "../lib/elements/button";
import { DynamicActionUI } from "../lib/ui";
import { Label, LabelOptionWrapType } from "../lib/elements/label";
import { Image } from "../lib/elements/image";
import { Stacker } from "../lib/elements/stacker";
import { ScrollingPanel } from "../lib/elements/singles/scrollingPanel";
import { UIUtils } from "../lib/general/util";

export function ExampleMenu(player: Player): void {

    // Header constants to reduce magic numbers
    const width = 330;
    const headerHeight = 30;

    const ui = new DynamicActionUI(
        width,
        180,
        DEFAULT_PANEL_TEX,
        {
            width: width,
            height: headerHeight
        },
        {
            x: 0,
            y: 0
        },
        {
            autoCenter: true
        }
    );

    // Define custom scrolling content area
    ui.customScrollingContentPanel(new ScrollingPanel(
        { width: "100% - 2px", height: "100% - 2px" },
        { x: 0, y: 0 }
    ))

    ui.title(new Label(
        "quests",
        { x: 0, y: 8 },
        1,
        "center",
        undefined,
        {
            wrapType: LabelOptionWrapType.CharacterWrap
        }
    ));

    // Button options (think of it like css styling but without the class names)
    const bo: ButtonOptions = {
        localiseImage: true,
        localiseText: true,
        forceGlobalImageParent: false,
        forceGlobalTextParent: false,

        hoverText: "This could contain extra info"
    }

    // Example data
    const buttonData = [
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 0.5, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 1, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 0.5, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 0.5, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 0.5, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 1, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 0.5, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 0.5, "§r10/50", "$10M"],
        ["textures/items/diamond", "BECOME RICH", "Mine 10 diamonds", "30k", 0.5, "§r10/50", "$10M"]
    ];

    const oX = 6;
    const oY = 1;

    // Custom grid constants
    const gridWidth = 3;
    const buttonWidthString = "33% - 6px";

    // Pre parsing string
    const buttonWidth = UIUtils.processUnitString(buttonWidthString, width);
    const buttonHeight = 65;
    const buttonPadding = 2;

    let movingX = 0;
    let movingY = 0;

    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < Math.ceil(buttonData.length / 3); y++) {

            const index = (y * gridWidth) + x;

            if (index > buttonData.length) continue;
            const button = buttonData[index];

            ui.button(new Button(
                new ButtonPanel({ x: oX + movingX, y: oY + movingY }, { width: buttonWidth, height: buttonHeight }),
                new Image(button[0] as string, { x: "100% - 30px", y: "30%" }, { width: 22, height: 22 }),
                new Label(button[1] as string, { x: 5, y: 4 }, 1, "left", undefined),
                () => {
                    console.warn("hello:", index);
                },
                bo
            ));

            // Item background
            ui.image(new Image(
                "textures/ui/forms/navy_sleekUI/item_background",
                { x: oX + movingX + buttonWidth - 31, y: oY + movingY + (buttonHeight * 0.3) - 1 },
                { width: 26, height: 26 }
            ));

            // Desc
            ui.label(new Label(
                button[2] as string,
                { x: oX + movingX + 4, y: oY + movingY + 15 },
                0.8,
                "left",
                buttonWidth - 40
            ));

            // Bar
            ui.image(new Image(
                "textures/ui/forms/navy_sleekUI/bar_bg",
                { x: oX + movingX + 4, y: oY + movingY + buttonHeight - 11 },
                { width: buttonWidth - 8, height: 7 }
            ));

            const progress = button[4] as number;
            const barFillerTexture = (progress == 1) ? "textures/ui/forms/navy_sleekUI/bar_full" : "textures/ui/forms/navy_sleekUI/bar_filler"

            // Bar filler
            ui.image(new Image(
                barFillerTexture,
                { x: oX + movingX + 5, y: oY + movingY + buttonHeight - 10 },
                { width: (buttonWidth - 10) * progress, height: 5 }
            ));

            console.warn(1)

            // Progress label
            ui.label(new Label(
                button[5] as string,
                { x: oX + movingX + 4, y: oY + movingY + buttonHeight - 19 },
                0.8,
                "left"
            ));

            const colourStr = (progress == 1) ? "§a" : "";

            // Price label
            ui.label(new Label(
                colourStr + (button[6] as string),
                { x: oX + movingX + buttonWidth - 26, y: oY + movingY + buttonHeight - 19 },
                0.8,
                "left"
            ));

            // Move grid cursor along
            movingX += buttonWidth;
            movingX += buttonPadding;

            // After 3 buttons it moves back to the start
            if (movingX > 280) movingX = 0;

        }

        // Move grid cursor upwards
        movingY += buttonHeight;
        movingY += buttonPadding;
    }


    ui.show(player);
}
