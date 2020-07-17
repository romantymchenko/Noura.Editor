import * as PIXI from "pixi.js";
import { CursorFeedbackType } from "../../models/CursorFeedbackType";

export interface IRenderable {

	Boundaries: PIXI.Rectangle;

	RenderBlock(worldToScreen: PIXI.Matrix);
	ConsumeCursor(cursorWorldX: number, cursorWorldY: number): CursorFeedbackType;
}