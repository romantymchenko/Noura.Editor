
export interface IInteractionOperator {

	screenMatrix: PIXI.Matrix;

	AppendMouseMove(screenX: number, screenY: number, globalScale: number);
	Release(screenX: number, screenY: number);
}