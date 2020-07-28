
export interface IInteractionOperator {
	
	AppendMouseMove(screenX: number, screenY: number, globalScale: number);
	Release(screenX: number, screenY: number);
}