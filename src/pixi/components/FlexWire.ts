import * as PIXI from "pixi.js";
import { IRenderable } from "./IRenderable";
import { IInteractionOperator } from "../../models/interaction/IInteractionOperator";

export class FlexWire implements IRenderable {

	private container: PIXI.Container = null;
	private graphics: PIXI.Graphics = null;

	get RenderBoundaries(): PIXI.Rectangle {
		return null;
	}

	constructor( stage: PIXI.Container ) {
		
		this.graphics = new PIXI.Graphics();
		this.container = new PIXI.Container();
		this.container.addChild(this.graphics);

		stage.addChild(this.container);
	}

	Translate(worldOffsetX: number, worldOffsetY: number) {
		
	}

	RenderBlock(worldToScreen: PIXI.Matrix) {

	}

	ConsumeCursor(cursorWorldX: number, cursorWorldY: number): IInteractionOperator {
		return null;
	}
}