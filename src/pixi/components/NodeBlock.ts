import * as PIXI from "pixi.js";

export class NodeBlock {

	private graphics: PIXI.Graphics = null;
	private worldBoundaries: PIXI.Rectangle = null;

	private screenPos: PIXI.Point = new PIXI.Point();
	private screenBlockSize: PIXI.Point = new PIXI.Point();

	constructor(stage: PIXI.Container, worldBoundaries: PIXI.Rectangle) {
		this.graphics = new PIXI.Graphics();
		stage.addChild(this.graphics);
		this.worldBoundaries = worldBoundaries;
	}

	get Boundaries() {
		return this.worldBoundaries.clone();
	}

	set Boundaries(val: PIXI.Rectangle) {
		this.worldBoundaries.copyFrom(val);
	}

	DrawBlock(worldToScreen: PIXI.Matrix) {
		let screenPos = new PIXI.Point(this.worldBoundaries.x, this.worldBoundaries.y);
		let screenBoundaryFarPoint = new PIXI.Point(this.worldBoundaries.x + this.worldBoundaries.width, this.worldBoundaries.y + this.worldBoundaries.height);

		worldToScreen.apply(screenPos, screenPos);
		worldToScreen.apply(screenBoundaryFarPoint, screenBoundaryFarPoint);

		let screenBlockSize = new PIXI.Point(screenBoundaryFarPoint.x - screenPos.x, screenBoundaryFarPoint.y - screenPos.y);

		if (this.screenPos == screenPos && this.screenBlockSize == screenBlockSize) return;
		

		if (this.screenBlockSize == screenBlockSize) {
			//move graphics only
			this.graphics.position.set(screenPos.x, screenPos.y);
			this.screenPos.copyFrom(screenPos);
		}
		else {
			//redraw
			this.graphics.clear();
			this.graphics.position.set(screenPos.x, screenPos.y);
			this.graphics.beginFill(0x000000, 0.9).lineStyle(2, 0xffffff)
				.drawRoundedRect(0, 0, screenBlockSize.x, screenBlockSize.y, 2).endFill();

			this.screenPos.copyFrom(screenPos);
			this.screenBlockSize.copyFrom(screenBlockSize);
		}
	}

	Dispose() 
	{
		this.graphics.destroy();
	}
}