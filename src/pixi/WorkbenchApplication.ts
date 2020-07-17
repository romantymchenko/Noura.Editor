import * as PIXI from "pixi.js";
import { Grid } from "./components/Grid";
import { ApplicationFunction } from "../models/ApplicationFunction";
import { NodeBlock } from "./components/NodeBlock";
import { IRenderable } from "./components/IRenderable";
import { CursorFeedbackType } from "../models/CursorFeedbackType";
import { CursorManipulationType } from "../models/CursorManipulationType";

export class WorkbenchApplication {
	
	private pixiApp: PIXI.Application = null;
	private grid: Grid = null;

	private manipulationType: CursorManipulationType = CursorManipulationType.NONE;
	private blockDragIndex: number = -1;
	private globalScale: number = 1;
	private scaleStep: number = 0.2;
	private screenMatrix: PIXI.Matrix = new PIXI.Matrix();

	private blocks: Array<IRenderable> = [];
	
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
			switch(this.blocks[bIndex].ConsumeCursor(cursorWorldPos.x, cursorWorldPos.y)) {
				case CursorFeedbackType.DRAGHIT:
					this.manipulationType = CursorManipulationType.BLOCKDRAG;
					this.blockDragIndex = bIndex;
					break;
				case CursorFeedbackType.LEFTSOCKETHIT:
					console.log("leftSocket");
					break;
				case CursorFeedbackType.RIGHTSOCKETHIT:
					console.log("rightSocket");
					break;
				case CursorFeedbackType.NONE:
					this.manipulationType = CursorManipulationType.CANVASDRAG;
					break;
			}
		}
	}

	onMouseUp(event: MouseEvent) {
		this.manipulationType = CursorManipulationType.NONE;
	}

	onMouseMove(event: MouseEvent) {
		switch(this.manipulationType) {
			case CursorManipulationType.CANVASDRAG:
				// movement in screen coords
				this.screenMatrix.translate(event.movementX, event.movementY);

				let screenOrigin = new PIXI.Point();
				this.screenMatrix.apply(screenOrigin, screenOrigin);
				this.grid.Pan(screenOrigin.x, screenOrigin.y);

				this.renderBlocks();
				break;
			case CursorManipulationType.BLOCKDRAG:
				let b = this.blocks[this.blockDragIndex].Boundaries;
				this.blocks[this.blockDragIndex].Boundaries = new PIXI.Rectangle(
					b.x + event.movementX / this.globalScale, 
					b.y + event.movementY / this.globalScale, 
					b.width, b.height
				);
				this.blocks[this.blockDragIndex].RenderBlock(this.screenMatrix);
				break;
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
			let b = this.blocks[bIndex].Boundaries;
			let leftTop = this.screenMatrix.apply(new PIXI.Point(b.x, b.y));
			let rightBottom = this.screenMatrix.apply(new PIXI.Point(b.x + b.width, b.y + b.height));

			//skip for out of screen area
			if ( leftTop.x > window.innerWidth + 20 || leftTop.y > window.innerHeight + 20 ||
				rightBottom.x < -20 || rightBottom.y < -20 ) continue;
			
			this.blocks[bIndex].RenderBlock(this.screenMatrix);
		}
	}
}