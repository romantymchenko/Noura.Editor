import * as PIXI from "pixi.js";

export interface IBlocksHost {

	WorldToScreen: PIXI.Matrix;

	RenderAll(): void;
}