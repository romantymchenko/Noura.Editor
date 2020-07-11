import * as PIXI from "pixi.js";
import { Grid } from "./Grid";

export class WorkbenchApplication {
	
	private grid: Grid = null;

	private drag: boolean = false;
	
	InitWithPixi(pixiApp: PIXI.Application) {
		this.grid = new Grid(pixiApp.stage, window.innerWidth, window.innerHeight);
		this.AddWindowListeners();
	}

	AddWindowListeners() {
		window.addEventListener("wheel", this.onWheel.bind(this));
		window.addEventListener("mousedown", this.onMouseDown.bind(this));
		window.addEventListener("mouseup", this.onMouseUp.bind(this));
		window.addEventListener("mousemove", this.onMouseMove.bind(this));
	}

	onWheel(event: WheelEvent) {
		if (event.deltaY < 0)
		{
			this.grid.ZoomIn(event.offsetX, event.offsetY);
		}
		else
		{
			this.grid.ZoomOut(event.offsetX, event.offsetY);
		}
	}

	onMouseDown(event: MouseEvent) {
		this.drag = true;
	}

	onMouseUp(event: MouseEvent) {
		this.drag = false;
	}

	onMouseMove(event: MouseEvent) {
		if (this.drag) 
			this.grid.Pan(event.movementX, event.movementY);
	}
}