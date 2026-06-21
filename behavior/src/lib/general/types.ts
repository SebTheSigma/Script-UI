import { Button } from "../elements/button";
import { Image } from "../elements/image";
import { Label } from "../elements/label";
import { Stacker } from "../elements/stacker";

export type BodyTextures = {
    body_texure: string;
    header_texture: string;
};

export interface DynamicPacketMap {
    [key: string]: string | number;
}

export type Dimensions = {
    width: number;
    height: number;
};


export type Element = Image | Label | Button | Stacker;
export type SizedElement = Image | Label | Button;
