import * as PIXI from "pixi.js";

export class Grid {

	private graphics: PIXI.Graphics = null;

	private stageW: number = 10;
	private stageH: number = 10;

	private majorLineStep: number = 50;
	private gridSize: number = 50;
	// Indicates emulated scale by grid
	private scaleFactor: number = 1;
	private scaleValues: Array<number> = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
	private scaleIndex: number = 1;
	private maxSubSectors: number = 10;

	private localOffset: PIXI.Point = new PIXI.Point();

	get MajorLineStep() {
		return this.majorLineStep;
	}

	set MajorLineStep(newValue: number) {
		if (newValue > 0)
			this.majorLineStep = newValue;
	}

	constructor(stage: PIXI.Container, width: number, height: number) {
		this.graphics = new PIXI.Graphics();
		stage.addChild(this.graphics);
		this.stageW = width;
		this.stageH = height;
		this.DrawGrid();
	}

	ZoomIn(anchorX: number, anchorY: number) {
		let localAnchX = (anchorX - this.localOffset.x) / this.scaleFactor;
		let localAnchY = (anchorY - this.localOffset.y) / this.scaleFactor;
		this.scaleIndex++;
		if (this.scaleIndex >= this.scaleValues.length)
		{
			this.scaleIndex = 0;
		}
		this.scaleFactor = this.scaleValues[this.scaleIndex];
		this.gridSize = (this.majorLineStep * this.maxSubSectors) * this.scaleFactor;

		let screenAnchX = localAnchX * this.scaleFactor + this.localOffset.x;
		let screenAnchY = localAnchY * this.scaleFactor + this.localOffset.y;

		this.Pan(anchorX - screenAnchX, anchorY - screenAnchY);
		this.DrawGrid();
	}

	ZoomOut(anchorX: number, anchorY: number) {
		let localAnchX = (anchorX - this.localOffset.x) / this.scaleFactor;
		let localAnchY = (anchorY - this.localOffset.y) / this.scaleFactor;
		this.scaleIndex--;
		if (this.scaleIndex < 0)
		{
			this.scaleIndex = this.scaleValues.length - 1;
		}
		this.scaleFactor = this.scaleValues[this.scaleIndex];
		this.gridSize = (this.majorLineStep * this.maxSubSectors) * this.scaleFactor;

		let screenAnchX = localAnchX * this.scaleFactor + this.localOffset.x;
		let screenAnchY = localAnchY * this.scaleFactor + this.localOffset.y;

		this.Pan(anchorX - screenAnchX, anchorY - screenAnchY);
		this.DrawGrid();
	}

	Pan(xOffset: number, yOffset: number)
	{
		this.localOffset.set(
			(this.localOffset.x + xOffset) % this.gridSize, 
			(this.localOffset.y + yOffset) % this.gridSize);
		
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
				this.graphics.lineStyle(1, 0xffffff, (this.scaleFactor - 0.5) * 2)
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
				this.graphics.lineStyle(1, 0xffffff, (this.scaleFactor - 0.5) * 2)
					.moveTo(- 2 * this.gridSize, i * this.gridSize + j * subGridSize - 2 * this.gridSize)
					.lineTo(this.stageW + 2 * this.gridSize, i * this.gridSize + j * subGridSize - 2 * this.gridSize);
			}
		}
	}
}