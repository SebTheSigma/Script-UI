import { Button } from "../elements/button";
import { Grid } from "../elements/grid";
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

export type Expression = string | number;

export type Dimensions = {
    width: number;
    height: number;
};

export type DimensionExpression = {
    width: Expression;
    height: Expression;
};

export type Position = {
    x: number;
    y: number;
};

export type PositionExpression = {
    x: Expression;
    y: Expression;
};



export type Element = Image | Label | Button | Grid | Stacker;
export type SizedElement = Image | Label | Button | Grid;
