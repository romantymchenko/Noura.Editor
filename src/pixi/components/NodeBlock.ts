import * as PIXI from "pixi.js";
import { IRenderable } from "./IRenderable";
import { ApplicationFunction } from "../../models/ApplicationFunction";
import { IInteractionOperator } from "../../models/interaction/IInteractionOperator";
import { ElementDragOperator } from "../../models/interaction/ElementDragOperator";

export class NodeBlock implements IRenderable {

	blockModel: ApplicationFunction = null;

	private container: PIXI.Container = null;
	private graphics: PIXI.Graphics = null;
	private headerText: PIXI.Text = null;
	private connectedFromLeft: boolean = false;
	private connectedFromRight: boolean = false;

	private worldBoundaries: PIXI.Rectangle = null;

	private screenPos: PIXI.Point = new PIXI.Point();
	private screenBlockSize: PIXI.Point = new PIXI.Point();

	constructor(model: ApplicationFunction, stage: PIXI.Container, worldBoundaries: PIXI.Rectangle) {
		
		this.blockModel = model;

		this.graphics = new PIXI.Graphics();
		this.headerText = new PIXI.Text('');
		this.container = new PIXI.Container();
		this.container.addChild(this.graphics);
		this.container.addChild(this.headerText);

		stage.addChild(this.container);
		this.worldBoundaries = worldBoundaries;
	}

	get RenderBoundaries(): PIXI.Rectangle {
		return this.worldBoundaries;
	}

	Translate(worldOffsetX: number, worldOffsetY: number) {
		this.worldBoundaries.x += worldOffsetX;
		this.worldBoundaries.y += worldOffsetY;
	}

	RenderBlock(worldToScreen: PIXI.Matrix) {

		let screenPos = new PIXI.Point(this.worldBoundaries.x, this.worldBoundaries.y);
		worldToScreen.apply(screenPos, screenPos);
		let screenBoundaryFarPoint = new PIXI.Point(this.worldBoundaries.x + this.worldBoundaries.width, this.worldBoundaries.y + this.worldBoundaries.height);
		worldToScreen.apply(screenBoundaryFarPoint, screenBoundaryFarPoint);
		let screenBlockSize = new PIXI.Point(screenBoundaryFarPoint.x - screenPos.x, screenBoundaryFarPoint.y - screenPos.y);

		if (this.screenPos == screenPos && this.screenBlockSize == screenBlockSize) return;
		
		if (this.screenBlockSize == screenBlockSize) {
			// move graphics only
			this.container.position.set(screenPos.x, screenPos.y);
			this.screenPos.copyFrom(screenPos);
		}
		else {
			this.screenPos.copyFrom(screenPos);
			this.screenBlockSize.copyFrom(screenBlockSize);
			this.DrawBlock();
		}
	}

	private DrawBlock() {
		// redraw
		this.graphics.clear();
		this.container.position.set(this.screenPos.x, this.screenPos.y);
		
		this.graphics.beginFill(0x000000, 0.9).lineStyle(2, 0xffffff)
			.drawRoundedRect(0, 0, this.screenBlockSize.x, this. screenBlockSize.y, 2).endFill();
		
		let headerHeigth = this.screenBlockSize.y / 5;

		// sockets
		this.graphics.beginFill(PIXI.utils.rgb2hex([0, 0, 0])).lineStyle(1, 0xffffff)
			.drawCircle(headerHeigth / 2, headerHeigth / 2, headerHeigth / 3).endFill();
		this.graphics.beginFill(PIXI.utils.rgb2hex([0, 0, 0])).lineStyle(1, 0xffffff)
			.drawCircle(this.screenBlockSize.x - headerHeigth / 2, headerHeigth / 2, headerHeigth / 3).endFill();
		
		this.headerText.text = this.blockModel.displayName;
		this.headerText.style = {fontFamily : 'Arial', fontSize: headerHeigth / 2, fill : 0xffffff};
		this.headerText.position.set(headerHeigth, headerHeigth / 4);
	}

	ConsumeCursor(cursorWorldX: number, cursorWorldY: number): IInteractionOperator {
		// check for collision
		if (!this.worldBoundaries.contains(cursorWorldX, cursorWorldY)) 
			return null;
		
		let headerHeigth = this.worldBoundaries.height / 5;
		let cursorPoint = new PIXI.Point(cursorWorldX - this.worldBoundaries.x, cursorWorldY - this.worldBoundaries.y);

		// if (Math.hypot(headerHeigth / 2 - cursorPoint.x, headerHeigth / 2 - cursorPoint.y) < headerHeigth / 3) {
		// 	return CursorFeedbackType.LEFTSOCKETHIT;
		// }

		// if (Math.hypot(this.worldBoundaries.width - headerHeigth / 2 - cursorPoint.x, headerHeigth / 2 - cursorPoint.y) < headerHeigth / 3) {
		// 	return CursorFeedbackType.RIGHTSOCKETHIT;
		// }

		return new ElementDragOperator(this);
	}

	Dispose() 
	{
		this.headerText.destroy();
		this.graphics.destroy();
		this.container.destroy();
	}
}