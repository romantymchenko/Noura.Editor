import * as PIXI from "pixi.js";
import { IRenderable } from "./IRenderable";
import { CursorFeedbackType } from "../../models/CursorFeedbackType";

export class FlexWire implements IRenderable {

	private container: PIXI.Container = null;
	private graphics: PIXI.Graphics = null;

	Boundaries: PIXI.Rectangle = null;

	constructor( stage: PIXI.Container, worldBoundaries: PIXI.Rectangle) {
		
		this.graphics = new PIXI.Graphics();
		this.container = new PIXI.Container();
		this.container.addChild(this.graphics);

		stage.addChild(this.container);
		this.Boundaries = worldBoundaries;
	}

	RenderBlock(worldToScreen: PIXI.Matrix) {

	}

	ConsumeCursor(cursorWorldX: number, cursorWorldY: number): CursorFeedbackType {
		return CursorFeedbackType.NONE;
	}
}