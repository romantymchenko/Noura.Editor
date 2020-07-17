import * as PIXI from "pixi.js";
import { IInteractionOperator } from "./IInteractionOperator";
import { Grid } from "../../pixi/components/Grid";
import { NodeBlock } from "../../pixi/components/NodeBlock";

export class ElementDragOperator implements IInteractionOperator {

	screenMatrix: PIXI.Matrix = null;
	
	node: NodeBlock = null;
	grid: Grid = null;

	constructor(node: NodeBlock) {
		this.node = node;
	}

	AppendMouseMove(screenMoveX: number, screenMoveY: number, globalScale: number): boolean {
		this.node.Translate(screenMoveX / globalScale, screenMoveY / globalScale);
		this.node.RenderBlock(this.screenMatrix);
		return false;
	}

	Release(screenX: number, screenY: number) {}
}