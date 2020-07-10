import * as PIXI from "pixi.js";
import { Grid } from "./Grid";

export class WorkbenchApplication {
    
    grid: Grid = null;

    InitWithPixi(pixiApp: PIXI.Application) {
        this.grid = new Grid(pixiApp.stage);
        this.grid.DrawGrid(window.innerWidth, window.innerHeight);

        this.AddWindowListeners();
    }

    AddWindowListeners() {
        window.addEventListener("wheel", this.onWheel.bind(this));
    }

    onWheel(event: WheelEvent) {
        if (event.deltaY < 0)
            this.grid.ZoomIn(window.innerWidth, window.innerHeight);
        else
            this.grid.ZoomOut(window.innerWidth, window.innerHeight);
    }
}