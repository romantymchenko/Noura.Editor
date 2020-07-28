import * as PIXI from "pixi.js";
import { IInteractionOperator } from "./IInteractionOperator";
import { Grid } from "../components/Grid";
import { IBlocksHost } from "../components/IBlocksHost";

export class CanvasDragOperator implements IInteractionOperator {

	private host: IBlocksHost = null;
	private grid: Grid = null;

	constructor(host: IBlocksHost, grid: Grid) {
		this.host = host;
		this.grid = grid;
	}

	AppendMouseMove(screenMoveX: number, screenMoveY: number, globalScale: number) {
		this.host.WorldToScreen.translate(screenMoveX, screenMoveY);
		let screenOrigin = new PIXI.Point();
		this.host.WorldToScreen.apply(screenOrigin, screenOrigin);
		this.grid.Pan(screenOrigin.x, screenOrigin.y);

		this.host.RenderAll();
	}

	Release(screenX: number, screenY: number) {}
}