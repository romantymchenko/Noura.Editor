import * as PIXI from "pixi.js";
import { Grid } from "./components/Grid";
import { ApplicationFunction } from "../models/ApplicationFunction";
import { NodeBlock } from "./components/NodeBlock";

export class WorkbenchApplication {
	
	private pixiApp: PIXI.Application = null;
	private grid: Grid = null;

	private drag: boolean = false;
	private globalScale: number = 1;
	private scaleStep: number = 0.2;
	// private screenOffset: PIXI.Point = new PIXI.Point();
	private screenMatrix: PIXI.Matrix = new PIXI.Matrix();

	private blocks: Array<NodeBlock> = [];
	
	InitWithPixi(pixiApp: PIXI.Application) {
		this.pixiApp = pixiApp;
		this.grid = new Grid(pixiApp.stage, window.innerWidth, window.innerHeight, this.globalScale);
	}

	onWindowResize(event: UIEvent) {
		this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
		this.grid.Resize(window.innerWidth, window.innerHeight);
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

		for (let bIndex = 0; bIndex < this.blocks.length; bIndex++) {
			this.blocks[bIndex].DrawBlock(this.screenMatrix);
		}
	}

	onMouseDown(event: MouseEvent) {
		this.drag = true;
	}

	onMouseUp(event: MouseEvent) {
		this.drag = false;
	}

	onMouseMove(event: MouseEvent) {
		if (this.drag) {
			// movement in screen coords
			this.screenMatrix.translate(event.movementX, event.movementY);

			let screenOrigin = new PIXI.Point();
			this.screenMatrix.apply(screenOrigin, screenOrigin);
			this.grid.Pan(screenOrigin.x, screenOrigin.y);

			for (let bIndex = 0; bIndex < this.blocks.length; bIndex++) {
				this.blocks[bIndex].DrawBlock(this.screenMatrix);
			}
		}
	}

	createFunctionBlock(model: ApplicationFunction, screenPos: PIXI.Point) {
		let worldCursorPos = this.screenMatrix.applyInverse(screenPos);
		let block = new NodeBlock(this.pixiApp.stage, new PIXI.Rectangle(worldCursorPos.x, worldCursorPos.y, 200, 100));
		block.DrawBlock(this.screenMatrix);
		this.blocks.push(block);
	}
}