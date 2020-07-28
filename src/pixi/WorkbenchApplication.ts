import * as PIXI from "pixi.js";
import { Grid } from "./components/Grid";
import { ApplicationFunction } from "../models/ApplicationFunction";
import { NodeBlock } from "./components/NodeBlock";
import { IInteractionOperator } from "./interaction/IInteractionOperator";
import { CanvasDragOperator } from "./interaction/CanvasDragOperator";
import { IBlocksHost } from "./components/IBlocksHost";

export class WorkbenchApplication implements IBlocksHost{
	
	WorldToScreen: PIXI.Matrix = new PIXI.Matrix();


	private pixiApp: PIXI.Application = null;
	private grid: Grid = null;

	private globalScale: number = 1;
	private scaleStep: number = 0.2;

	private blocks: Array<NodeBlock> = [];
	private interactionOperator: IInteractionOperator = null;
	private hoveredBlock: NodeBlock = null;
	
	InitWithPixi(pixiApp: PIXI.Application) {
		this.pixiApp = pixiApp;
		this.grid = new Grid(pixiApp.stage, window.innerWidth, window.innerHeight, this.globalScale);
	}

	onWindowResize(event: UIEvent) {
		this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
		this.grid.Resize(window.innerWidth, window.innerHeight);
		this.RenderAll();
	}

	onMouseWheel(event: WheelEvent) {

		if (event.deltaY < 0)
			this.globalScale += this.scaleStep;
		else
			this.globalScale = Math.max(this.globalScale - this.scaleStep, 1);

		// get wp before scale change in matrix
		let worldCursorPos = this.WorldToScreen.applyInverse(new PIXI.Point(event.offsetX, event.offsetY));
		this.WorldToScreen.setTransform(this.WorldToScreen.tx, this.WorldToScreen.ty, 0, 0, this.globalScale, this.globalScale, 0, 0, 0);
		let newScreenCursonPos = this.WorldToScreen.apply(worldCursorPos);
		this.WorldToScreen.translate(event.offsetX - newScreenCursonPos.x, event.offsetY - newScreenCursonPos.y);
		let screenOrigin = new PIXI.Point();
		this.WorldToScreen.apply(screenOrigin, screenOrigin);

		this.grid.Zoom(this.globalScale);
		this.grid.Pan(screenOrigin.x, screenOrigin.y);

		this.RenderAll();
	}

	onMouseDown(event: MouseEvent) {

		let cursorWorldPos = new PIXI.Point(event.offsetX, event.offsetY);
		this.WorldToScreen.applyInverse(cursorWorldPos, cursorWorldPos);

		if (this.hoveredBlock != null) {
			this.interactionOperator = this.hoveredBlock.ApplyInteraction(cursorWorldPos, this);
		}
		else {
			this.interactionOperator = new CanvasDragOperator(this, this.grid);
		}
	}

	onMouseRightDown(event: MouseEvent): Array<{ name: string, key: string }> {
		
		// broadcast to hovered object
		if (this.hoveredBlock != null) {
			return this.hoveredBlock.GetContextMenuOptions();
		}

		return [];
	}

	onMouseUp(event: MouseEvent) {
		if (this.interactionOperator != null) {
			this.interactionOperator.Release(event.offsetX, event.offsetY);
			this.interactionOperator = null;
		}
	}

	onMouseMove(event: MouseEvent) {
		// get underlaying block
		let cursorWorldPos = new PIXI.Point(event.offsetX, event.offsetY);
		let cursorCollided = false;
		this.WorldToScreen.applyInverse(cursorWorldPos, cursorWorldPos);
		for (let bIndex = 0; bIndex < this.blocks.length; bIndex++) {
			if (this.blocks[bIndex].RenderBoundaries.contains(cursorWorldPos.x, cursorWorldPos.y)) {
				if (this.hoveredBlock != this.blocks[bIndex]) {
					this.blocks[bIndex].OnCursorHower(cursorWorldPos);
					if (this.hoveredBlock != null)
						this.hoveredBlock.OnCursorLeave();
					this.hoveredBlock = this.blocks[bIndex];
				}
				cursorCollided = true;
			}
		}
		// release hovered item
		if (!cursorCollided && this.hoveredBlock != null) {
			this.hoveredBlock.OnCursorLeave();
			this.hoveredBlock = null;
		}

		if (this.interactionOperator != null) {
			this.interactionOperator.AppendMouseMove(event.movementX, event.movementY, this.globalScale);
		}
	}

	onContextMenuClick(info: any, screenPos: PIXI.Point) {
		switch(info.key) {
			case "newFunc":
				this.createFunctionBlock(new ApplicationFunction(), screenPos);
				break;
			case "removeFunc":
				this.hoveredBlock.Dispose();
				let removingIndex = this.blocks.indexOf(this.hoveredBlock);
				this.blocks.splice(removingIndex, 1);
				this.hoveredBlock = null;
				break;
		}
	}

	createFunctionBlock(model: ApplicationFunction, screenPos: PIXI.Point) {
		let worldCursorPos = this.WorldToScreen.applyInverse(screenPos);
		let block = new NodeBlock(model, this.pixiApp.stage, 230, 100);
		block.Translate(worldCursorPos.x, worldCursorPos.y);
		block.Render(this.WorldToScreen);
		this.blocks.push(block);
	}

	RenderAll() {
		for (let bIndex = 0; bIndex < this.blocks.length; bIndex++) {
			// render check
			let b = this.blocks[bIndex].RenderBoundaries;
			let leftTop = this.WorldToScreen.apply(new PIXI.Point(b.x, b.y));
			let rightBottom = this.WorldToScreen.apply(new PIXI.Point(b.x + b.width, b.y + b.height));

			//skip for out of screen area
			if ( leftTop.x > window.innerWidth + 20 || leftTop.y > window.innerHeight + 20 ||
				rightBottom.x < -20 || rightBottom.y < -20 ) continue;
			
			this.blocks[bIndex].Render(this.WorldToScreen);
		}
	}
}