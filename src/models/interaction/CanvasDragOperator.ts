import * as PIXI from "pixi.js";
import { IInteractionOperator } from "./IInteractionOperator";
import { Grid } from "../../pixi/components/Grid";

export class CanvasDragOperator implements IInteractionOperator {

	screenMatrix: PIXI.Matrix = null;
	grid: Grid = null;

	constructor(screenMatrix: PIXI.Matrix, grid: Grid) {
		this.screenMatrix = screenMatrix;
		this.grid = grid;
	}

	AppendMouseMove(screenMoveX: number, screenMoveY: number, globalScale: number): boolean {
		this.screenMatrix.translate(screenMoveX, screenMoveY);
		let screenOrigin = new PIXI.Point();
		this.screenMatrix.apply(screenOrigin, screenOrigin);
		this.grid.Pan(screenOrigin.x, screenOrigin.y);

		return true;
	}

	Release(screenX: number, screenY: number) {}
}