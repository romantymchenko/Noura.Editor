import * as PIXI from "pixi.js";

export class Grid {

	private graphics: PIXI.Graphics = null;

	private stageW: number = 10;
	private stageH: number = 10;

	private majorLineStep: number = 50;
	private gridSize: number = 50;
	// Indicates emulated scale by grid
	private scaleFactor: number = 0.5;
	private maxSubSectors: number = 10;

	private localOffset: PIXI.Point = new PIXI.Point();

	get MajorLineStep() {
		return this.majorLineStep;
	}

	set MajorLineStep(newValue: number) {
		if (newValue > 0)
			this.majorLineStep = newValue;
	}

	constructor(stage: PIXI.Container, width: number, height: number, globalScale: number) {
		this.graphics = new PIXI.Graphics();
		stage.addChild(this.graphics);
		
		this.stageW = width;
		this.stageH = height;

		this.Zoom(globalScale, 0, 0);
	}

	Zoom(globalScale: number, screenX: number, screenY: number) {
		let localAnchX = (screenX - this.localOffset.x) / this.scaleFactor;
		let localAnchY = (screenY - this.localOffset.y) / this.scaleFactor;

		this.scaleFactor = globalScale % 1;
		this.gridSize = (this.majorLineStep * this.maxSubSectors) * this.scaleFactor;

		let screenAnchX = localAnchX * this.scaleFactor + this.localOffset.x;
		let screenAnchY = localAnchY * this.scaleFactor + this.localOffset.y;

		this.Pan(this.localOffset.x - (screenAnchX - screenX), this.localOffset.y - (screenAnchY - screenY));
		this.DrawGrid();
	}

	Pan(xOffset: number, yOffset: number)
	{
		this.localOffset.set(xOffset % this.gridSize, yOffset % this.gridSize);
		this.graphics.position = this.localOffset;
	}

	Resize(width: number, height: number) {
		this.stageW = width;
		this.stageH = height;

		this.DrawGrid();
	}

	private DrawGrid() {
		this.graphics.clear();
		let subGridSize = this.gridSize / this.maxSubSectors;
		let linesCount = Math.ceil(this.stageW / this.gridSize);
		// drag grid 4 cells bigger in each direction to compensate pan drag
		for (let i = 0; i < linesCount + 4; i++)
		{
			this.graphics.lineStyle(1, 0xffffff)
				.moveTo(i * this.gridSize - 2 * this.gridSize, - 2 * this.gridSize)
				.lineTo(i * this.gridSize - 2 * this.gridSize, this.stageH + 2 * this.gridSize); 
			
			for (let j = 1; j < this.maxSubSectors; j++)
			{
				this.graphics.lineStyle(1, 0xffffff, (this.scaleFactor - 0.4) * 2)
					.moveTo(i * this.gridSize + j * subGridSize - 2 * this.gridSize, - 2 * this.gridSize)
					.lineTo(i * this.gridSize + j * subGridSize - 2 * this.gridSize, this.stageH + 2 * this.gridSize);
			}
		}

		linesCount = Math.ceil(this.stageH / this.gridSize);
		for (let i = 0; i < linesCount + 4; i++)
		{
			this.graphics.lineStyle(1, 0xffffff)
				.moveTo(- 2 * this.gridSize, i * this.gridSize - 2 * this.gridSize)
				.lineTo(this.stageW + 2 * this.gridSize, i * this.gridSize - 2 * this.gridSize);
				
			for (let j = 1; j <= this.maxSubSectors; j++)
			{
				this.graphics.lineStyle(1, 0xffffff, (this.scaleFactor - 0.4) * 2)
					.moveTo(- 2 * this.gridSize, i * this.gridSize + j * subGridSize - 2 * this.gridSize)
					.lineTo(this.stageW + 2 * this.gridSize, i * this.gridSize + j * subGridSize - 2 * this.gridSize);
			}
		}
	}
}