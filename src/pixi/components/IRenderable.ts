import * as PIXI from "pixi.js";
import { IInteractionOperator } from "../../models/interaction/IInteractionOperator";

export interface IRenderable {

	RenderBoundaries: PIXI.Rectangle;

	Translate(worldOffsetX: number, worldOffsetY: number);
	RenderBlock(worldToScreen: PIXI.Matrix);
	ConsumeCursor(cursorWorldX: number, cursorWorldY: number): IInteractionOperator;
}