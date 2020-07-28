import * as PIXI from "pixi.js";

export interface IRenderable {

	RenderBoundaries: PIXI.Rectangle;

	Translate(tx: number, ty: number);
	Render(worldToScreen: PIXI.Matrix);
}