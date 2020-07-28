import * as PIXI from "pixi.js";
import { IInteractionOperator } from "./IInteractionOperator";

export interface IInteractionHost {

	interactionOperator: IInteractionOperator;
	stageContainer: PIXI.Container;
	screenMatrix: PIXI.Matrix;
	globalScale: number;
}