import * as PIXI from "pixi.js";
import { IInteractionOperator } from "./IInteractionOperator";
import { Grid } from "../components/Grid";
import { NodeBlock } from "../components/NodeBlock";

export class ElementDragOperator implements IInteractionOperator {

	private node: NodeBlock = null;
	private screenMatrix: PIXI.Matrix = null;

	constructor(node: NodeBlock, screenMatrix: PIXI.Matrix) {
		this.node = node;
		this.screenMatrix = screenMatrix;
	}

	AppendMouseMove(screenMoveX: number, screenMoveY: number, globalScale: number) {
		this.node.Translate(screenMoveX / globalScale, screenMoveY / globalScale);
		this.node.Render(this.screenMatrix);
	}

	Release(screenX: number, screenY: number) {}
}