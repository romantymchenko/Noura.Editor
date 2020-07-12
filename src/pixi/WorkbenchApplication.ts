import * as PIXI from "pixi.js";
import { Grid } from "./Grid";

export class WorkbenchApplication {
	
	private pixiApp: PIXI.Application = null;
	private grid: Grid = null;

	private drag: boolean = false;
	private globalScale: number = 1.5;
	private globalPosition: PIXI.Point = new PIXI.Point();
	private scaleIndex: number = 5;
	private scaleValues: Array<number> = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
	
	InitWithPixi(pixiApp: PIXI.Application) {
		this.pixiApp = pixiApp;
		this.grid = new Grid(pixiApp.stage, window.innerWidth, window.innerHeight, this.globalScale);
	}

	onWindowResize(event: UIEvent) {
		this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
		this.grid.Resize(window.innerWidth, window.innerHeight);
	}

	onContextMenu(event: MouseEvent) {
		
	}

	onMouseWheel(event: WheelEvent) {
		if (event.deltaY < 0)
		{
			this.scaleIndex++;
			if (this.scaleIndex >= this.scaleValues.length)
			{
				this.scaleIndex = 0;
				this.globalScale = Math.floor(this.globalScale) + 1 + this.scaleValues[this.scaleIndex];
			}
			else
			{
				this.globalScale = Math.floor(this.globalScale) + this.scaleValues[this.scaleIndex];
			}
			this.grid.Zoom(this.globalScale, event.offsetX, event.offsetY);
		}
		else
		{
			if (this.globalScale <= 1) return;

			this.scaleIndex--;
			if (this.scaleIndex < 0)
			{
				this.scaleIndex = this.scaleValues.length - 1;
				this.globalScale = Math.floor(this.globalScale) - 1 + this.scaleValues[this.scaleIndex];
			}
			else
			{
				this.globalScale = Math.floor(this.globalScale) + this.scaleValues[this.scaleIndex];
			}
			this.grid.Zoom(this.globalScale, event.offsetX, event.offsetY);
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
		{
			// movement in screen coords
			this.globalPosition.set(this.globalPosition.x + event.movementX, this.globalPosition.y + event.movementY);
			this.grid.Pan(this.globalPosition.x, this.globalPosition.y);
		}
	}
}