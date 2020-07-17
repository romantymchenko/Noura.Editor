import * as PIXI from "pixi.js";

export class Grid {

	private graphics: PIXI.Graphics = null;

	private stageW: number = 640;
	private stageH: number = 480;

	private majorLineStep: number = 200;
	private subCellCount: number = 10;
	private visibleStep: number = 10;
	private globalScale: number = 1;

	private localScreenOffset: PIXI.Point = new PIXI.Point();

	constructor(stage: PIXI.Container, width: number, height: number, globalScale: number) {
		this.graphics = new PIXI.Graphics();
		stage.addChild(this.graphics);
		
		this.stageW = width;
		this.stageH = height;

		this.Zoom(globalScale);
	}

	Dispose() {
		this.graphics.destroy();
	}

	Zoom(globalScale: number) {
		this.globalScale = globalScale;
		this.DrawGrid();
	}

	Pan(xScreenOffset: number, yScreenOffset: number)
	{
		this.localScreenOffset.set(xScreenOffset, yScreenOffset);
		this.localScreenOffset.set(xScreenOffset % (this.majorLineStep * this.globalScale), yScreenOffset % (this.majorLineStep * this.globalScale));
		this.graphics.position = this.localScreenOffset;
	}

	Resize(width: number, height: number) {
		this.stageW = width;
		this.stageH = height;

		this.DrawGrid();
	}

	private DrawGrid() {
		this.graphics.clear();
		let cellSize = this.majorLineStep * this.globalScale;
		let linesCount = Math.ceil(this.stageW / cellSize);
		// drag grid 4 cells bigger in each direction to compensate pan drag
		for (let i = 0; i < linesCount + 4; i++) {
			this.graphics.lineStyle(1, 0xffffff)
				.moveTo(i * cellSize - 2 * cellSize, - 2 * cellSize)
				.lineTo(i * cellSize - 2 * cellSize, this.stageH + 2 * cellSize); 
			
			this.FillCellWithLines(
				new PIXI.Point(i * cellSize - 2 * cellSize, - 2 * cellSize),
				new PIXI.Point((i + 1) * cellSize - 2 * cellSize, - 2 * cellSize),
				new PIXI.Point(i * cellSize - 2 * cellSize, this.stageH + 2 * cellSize),
				new PIXI.Point((i + 1) * cellSize - 2 * cellSize, this.stageH + 2 * cellSize)
			);
		}

		linesCount = Math.ceil(this.stageH / cellSize);
		for (let i = 0; i < linesCount + 4; i++) {
			this.graphics.lineStyle(1, 0xffffff)
				.moveTo(- 2 * cellSize, i * cellSize - 2 * cellSize)
				.lineTo(this.stageW + 2 * cellSize, i * cellSize - 2 * cellSize);
			
				this.FillCellWithLines(
					new PIXI.Point(- 2 * cellSize, i * cellSize - 2 * cellSize),
					new PIXI.Point(- 2 * cellSize, (i + 1) * cellSize - 2 * cellSize),
					new PIXI.Point(this.stageW + 2 * cellSize, i * cellSize - 2 * cellSize),
					new PIXI.Point(this.stageW + 2 * cellSize, (i + 1) * cellSize - 2 * cellSize)
				);
		}
	}

	private FillCellWithLines(fromA: PIXI.Point, fromB: PIXI.Point, toA: PIXI.Point, toB: PIXI.Point)
	{
		let l = Math.hypot(fromA.x - fromB.x, fromA.y - fromB.y);
		let subCellSize = l / this.subCellCount;
		if (subCellSize < this.visibleStep) return;

		for (let i = 0; i < this.subCellCount; i++) {
			if (i > 0) {
				this.graphics.lineStyle(1, 0xffffff, Math.min((subCellSize - this.visibleStep) / (this.majorLineStep - this.visibleStep), 1))
					.moveTo(fromA.x + (fromB.x - fromA.x) * (i / this.subCellCount), fromA.y + (fromB.y - fromA.y) * (i / this.subCellCount))
					.lineTo(toA.x + (toB.x - toA.x) * (i / this.subCellCount), toA.y + (toB.y - toA.y) * (i / this.subCellCount));
			}

			this.FillCellWithLines(
				new PIXI.Point(fromA.x + (fromB.x - fromA.x) * (i / this.subCellCount), fromA.y + (fromB.y - fromA.y) * (i / this.subCellCount)),
				new PIXI.Point(fromA.x + (fromB.x - fromA.x) * ((i + 1) / this.subCellCount), fromA.y + (fromB.y - fromA.y) * ((i + 1) / this.subCellCount)),
				new PIXI.Point(toA.x + (toB.x - toA.x) * (i / this.subCellCount), toA.y + (toB.y - toA.y) * (i / this.subCellCount)),
				new PIXI.Point(toA.x + (toB.x - toA.x) * ((i + 1) / this.subCellCount), toA.y + (toB.y - toA.y) * ((i + 1) / this.subCellCount))
			);
		}
	}
}