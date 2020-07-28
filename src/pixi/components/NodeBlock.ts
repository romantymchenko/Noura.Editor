import * as PIXI from "pixi.js";
import { IRenderable } from "./IRenderable";
import { ApplicationFunction } from "../../models/ApplicationFunction";
import { IInteractionOperator } from "../interaction/IInteractionOperator";
import { ElementDragOperator } from "../interaction/ElementDragOperator";
import { IInteractionHost } from "../interaction/IInteractionHost";
import { WireConnectOperator } from "../interaction/WireConnectOperator";
import { IBlocksHost } from "./IBlocksHost";

export class NodeBlock implements IRenderable {

	blockModel: ApplicationFunction = null;

	private container: PIXI.Container = null;
	private graphics: PIXI.Graphics = null;
	private headerText: PIXI.Text = null;

	private hovered: boolean = false;
	private connectedFromLeft: boolean = false;
	private connectedFromRight: boolean = false;

	private worldBoundaries: PIXI.Rectangle = null;
	//track prev. screen position to do not render on same spot twice
	private screenPos: PIXI.Point = new PIXI.Point();
	private screenBlockSize: PIXI.Point = new PIXI.Point();

	get RenderBoundaries(): PIXI.Rectangle {
		return this.worldBoundaries;
	}

	constructor(model: ApplicationFunction, stage: PIXI.Container, width: number, height: number) {
		
		this.blockModel = model;

		this.graphics = new PIXI.Graphics();
		this.headerText = new PIXI.Text('');
		this.container = new PIXI.Container();
		this.container.addChild(this.graphics);
		this.container.addChild(this.headerText);

		stage.addChild(this.container);

		this.worldBoundaries = new PIXI.Rectangle(0, 0, width, height);
	}

	Translate(tx: number, ty: number) {
		this.worldBoundaries.x += tx;
		this.worldBoundaries.y += ty;
	}

	Render(worldToScreen: PIXI.Matrix) {

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
		this.container.position.set(this.screenPos.x, this.screenPos.y);
		
		this.graphics.clear().beginFill(0x000000, 0.9).lineStyle(this.hovered ? 3 : 2, 0xffffff)
			.drawRoundedRect(0, 0, this.screenBlockSize.x, this. screenBlockSize.y, this.hovered ? 4 : 3).endFill();
		
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

	ApplyInteraction(cursorWorld: PIXI.Point, appHost: IBlocksHost): IInteractionOperator {
		
		let headerHeigth = this.worldBoundaries.height / 5;
		let cursorObjectPoint = new PIXI.Point(cursorWorld.x - this.worldBoundaries.x, cursorWorld.y - this.worldBoundaries.y);

		if (Math.hypot(headerHeigth / 2 - cursorObjectPoint.x, headerHeigth / 2 - cursorObjectPoint.y) < headerHeigth / 3) {
			// left socket
			//appHostRefs.interactionOperator = new WireConnectOperator(appHostRefs.stageContainer, appHostRefs.screenMatrix, cursorWorld, false);
		}
		else if (Math.hypot(this.worldBoundaries.width - headerHeigth / 2 - cursorObjectPoint.x, headerHeigth / 2 - cursorObjectPoint.y) < headerHeigth / 3) {
			// right socket
			//appHostRefs.interactionOperator = new WireConnectOperator(appHostRefs.stageContainer, appHostRefs.screenMatrix, cursorWorld, true);
		}
		else {
			return new ElementDragOperator(this, appHost.WorldToScreen);
		}
	}

	GetContextMenuOptions(): Array<{ name: string, key: string }> {
		let options = new Array<{ name: string, key: string }>();
		options.push({ name: "Delete " + this.blockModel.displayName, key: "removeFunc" });
		
		if (this.connectedFromLeft)
			options.push({ name: "Disconnect from left", key: "removeLConn" });
		
		if (this.connectedFromRight)
			options.push({ name: "Disconnect from right", key: "removeRConn" });
		
		return options;
	}

	OnCursorHower(cursorWorld: PIXI.Point) {
		this.hovered = true;
		this.DrawBlock();
	}

	OnCursorLeave() {
		this.hovered = false;
		this.DrawBlock();
	}

	Dispose() 
	{
		this.headerText.destroy();
		this.graphics.destroy();
		this.container.destroy();
	}
}