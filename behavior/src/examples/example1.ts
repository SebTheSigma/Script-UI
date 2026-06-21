import { DEFAULT_PANEL_TEX } from "../lib/data";
import { Player } from "@minecraft/server";
import { Button, ButtonOptions, ButtonPanel } from "../lib/elements/button";
import { DynamicActionUI } from "../lib/ui";
import { Label } from "../lib/elements/label";
import { Image } from "../lib/elements/image";
import { Stacker } from "../lib/elements/stacker";

export function ExampleMenu(player: Player): void {
    const ui = new DynamicActionUI(250, 211, DEFAULT_PANEL_TEX);

    ui.title("Action Menu");

    const buttonOptions1: ButtonOptions = {
        centerI: true,
        centerTextX: true,
        localiseText: true,
        localiseImage: true,
        forceGlobalImageParent: false,
        button_textures: {
            default_texture: "textures/ui/default_button",
            hover_texture: "textures/ui/hover_button",
        },
        onClick() {
            console.log("Button 1 clicked");
        },
    };

    const buttonOptions2: ButtonOptions = {
        centerI: false,
        centerTextX: false,
        localiseText: true,
        localiseImage: true,
        forceGlobalImageParent: false,
        button_textures: {
            default_texture: "textures/ui/default_button",
            hover_texture: "textures/ui/hover_button",
        }
    };

    const button1 = new Button(
        new ButtonPanel(0, 0, "100% - 10px", "50%"),
        new Image("textures/items/compass_item", 0, -6, 30, 30),
        new Label("Hello World!", 1, "100% - 20px", 1),
        buttonOptions1
    );

    const button2 = new Button(
        new ButtonPanel(0, 0, "50%", 31),
        new Image("textures/items/compass_item", "100% - 30px", 1, 25, 25),
        new Label("Hello World!", 5, "100% - 17px", 1),
        buttonOptions2
    );

    const button3 = new Button(
        new ButtonPanel(0, 0, 100, 31),
        new Image("textures/items/compass_item", "100% - 30px", 1, 25, 25),
        new Label("Hello World!", 5, "100% - 17px", 1),
        buttonOptions2
    );

    ui.stack(new Stacker(
        button1,
        new Stacker(
            button2,
            new Image("textures/items/compass_item", 0, 0, 45, 45),
        ).gap(5).orientate("horizontal"),
        button1
    ).gap(0).setOffset(5, 5));
    

    ui.show(player);
}
