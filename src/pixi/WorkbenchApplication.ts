import * as PIXI from "pixi.js";
import { Grid } from "./components/Grid";
import { ApplicationFunction } from "../models/ApplicationFunction";
import { NodeBlock } from "./components/NodeBlock";
import { IInteractionOperator } from "../models/interaction/IInteractionOperator";
import { CanvasDragOperator } from "../models/interaction/CanvasDragOperator";

export class WorkbenchApplication {
	
	private pixiApp: PIXI.Application = null;
	private grid: Grid = null;

	private interactionOperator: IInteractionOperator = null;
	private blockDragIndex: number = -1;
	private globalScale: number = 1;
	private scaleStep: number = 0.2;
	private screenMatrix: PIXI.Matrix = new PIXI.Matrix();

	private blocks: Array<NodeBlock> = [];
	
	InitWithPixi(pixiApp: PIXI.Application) {
		this.pixiApp = pixiApp;
		this.grid = new Grid(pixiApp.stage, window.innerWidth, window.innerHeight, this.globalScale);
	}

	onWindowResize(event: UIEvent) {
		this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
		this.grid.Resize(window.innerWidth, window.innerHeight);
		this.renderBlocks();
	}

	onMouseWheel(event: WheelEvent) {

		if (event.deltaY < 0)
			this.globalScale += this.scaleStep;
		else
			this.globalScale = Math.max(this.globalScale - this.scaleStep, 1);

		// get wp before scale change in matrix
		let worldCursorPos = this.screenMatrix.applyInverse(new PIXI.Point(event.offsetX, event.offsetY));
		this.screenMatrix.setTransform(this.screenMatrix.tx, this.screenMatrix.ty, 0, 0, this.globalScale, this.globalScale, 0, 0, 0);
		let newScreenCursonPos = this.screenMatrix.apply(worldCursorPos);
		this.screenMatrix.translate(event.offsetX - newScreenCursonPos.x, event.offsetY - newScreenCursonPos.y);
		let screenOrigin = new PIXI.Point();
		this.screenMatrix.apply(screenOrigin, screenOrigin);

		this.grid.Zoom(this.globalScale);
		this.grid.Pan(screenOrigin.x, screenOrigin.y);

		this.renderBlocks();
	}

	onMouseDown(event: MouseEvent) {
		let cursorWorldPos = new PIXI.Point(event.offsetX, event.offsetY);
		this.screenMatrix.applyInverse(cursorWorldPos, cursorWorldPos);
		
		for (let bIndex = 0; bIndex < this.blocks.length; bIndex++) {
			this.interactionOperator = this.blocks[bIndex].ConsumeCursor(cursorWorldPos.x, cursorWorldPos.y);
			if (this.interactionOperator != null) {
				this.interactionOperator.screenMatrix = this.screenMatrix;
				break;
			}
		}

		if (this.interactionOperator == null) {
			this.interactionOperator = new CanvasDragOperator(this.screenMatrix, this.grid);
		}
	}

	onMouseRightDown(event: MouseEvent): Array<{ name: string, key: string }> {
		return [];
	}

	onMouseUp(event: MouseEvent) {
		if (this.interactionOperator != null) {
			this.interactionOperator.Release(event.offsetX, event.offsetY);
			this.interactionOperator = null;
		}
	}

	onMouseMove(event: MouseEvent) {
		if (this.interactionOperator != null) {
			if (this.interactionOperator.AppendMouseMove(event.movementX, event.movementY, this.globalScale)) {
				this.renderBlocks();
			}
		}
	}

	createFunctionBlock(model: ApplicationFunction, screenPos: PIXI.Point) {
		let worldCursorPos = this.screenMatrix.applyInverse(screenPos);
		let block = new NodeBlock(model, this.pixiApp.stage, new PIXI.Rectangle(worldCursorPos.x, worldCursorPos.y, 230, 100));
		block.RenderBlock(this.screenMatrix);
		this.blocks.push(block);
	}

	renderBlocks() {
		for (let bIndex = 0; bIndex < this.blocks.length; bIndex++) {
			// render check
			let b = this.blocks[bIndex].RenderBoundaries;
			let leftTop = this.screenMatrix.apply(new PIXI.Point(b.x, b.y));
			let rightBottom = this.screenMatrix.apply(new PIXI.Point(b.x + b.width, b.y + b.height));

			//skip for out of screen area
			if ( leftTop.x > window.innerWidth + 20 || leftTop.y > window.innerHeight + 20 ||
				rightBottom.x < -20 || rightBottom.y < -20 ) continue;
			
			this.blocks[bIndex].RenderBlock(this.screenMatrix);
		}
	}
}