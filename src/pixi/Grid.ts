import * as PIXI from "pixi.js";

export class Grid {

    graphics: PIXI.Graphics = null;
    majorLineStep: number = 100;

    systemScale: number = 600;
    scaleChangeStep: number = 20;

    constructor(stage: PIXI.Container) {
        this.graphics = new PIXI.Graphics();
        stage.addChild(this.graphics);
    }

    ZoomIn(width: number, height: number) {
        this.systemScale += this.scaleChangeStep;
        this.DrawGrid(width, height);
    }

    ZoomOut(width: number, height: number) {
        this.systemScale -= this.scaleChangeStep;
        if (this.systemScale < 100)
        {
            this.systemScale = 100;
        }
        this.DrawGrid(width, height);
    }

    DrawGrid (width: number, height: number) {
        this.graphics.clear();
        
        let scaleFactor = this.systemScale % 100;
        let linesDelta = scaleFactor > 0 ? 
            this.majorLineStep / 5 : 
            this.majorLineStep;

        let linesCount = Math.ceil(width / linesDelta);
        let lineDeltaScale = scaleFactor / 100;
        for (let i = 0; i < linesCount; i++)
        {
            this.graphics.lineStyle(1, 0xffffff)
                .moveTo(i * linesDelta * (1 + lineDeltaScale), 0)
                .lineTo(i * linesDelta * (1 + lineDeltaScale), height);       
        }

        linesCount = Math.ceil(height / linesDelta);
        for (let i = 0; i < linesCount; i++)
        {
            this.graphics.lineStyle(1, 0xffffff)
                .moveTo(0, i * linesDelta * (1 + lineDeltaScale))
                .lineTo(width, i * linesDelta * (1 + lineDeltaScale));       
        }
    }
}