import * as PIXI from "pixi.js";
import { IInteractionOperator } from "./IInteractionOperator";
import { FlexWire } from "../components/FlexWire";
import { IBlocksHost } from "../components/IBlocksHost";

export class WireConnectOperator implements IInteractionOperator {

	private screenMatrix: PIXI.Matrix = null;
	private wire: FlexWire = null;
	private isLeftBased: boolean;

	constructor(host: IBlocksHost, cursorWorld: PIXI.Point, isLeftBased: boolean) {
		// this.screenMatrix = screenMatrix;
		// this.wire = new FlexWire(stageContainer, cursorWorld, cursorWorld);
		// this.wire.Render(screenMatrix);
		// this.isLeftBased = isLeftBased;
	}

	AppendMouseMove(screenMoveX: number, screenMoveY: number, globalScale: number) {
		
	}

	Release(screenX: number, screenY: number) {}
}