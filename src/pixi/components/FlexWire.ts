import * as PIXI from "pixi.js";
import { IRenderable } from "./IRenderable";
import { IInteractionHost } from "../interaction/IInteractionHost";
import { AllHTMLAttributes } from "react";

export class FlexWire implements IRenderable {

	private container: PIXI.Container = null;
	private graphics: PIXI.Graphics = null;

	private fromPoint: PIXI.Point = new PIXI.Point();
	private toPoint: PIXI.Point = new PIXI.Point();

	private screenFromPoint: PIXI.Point = new PIXI.Point();
	private screenToPoint: PIXI.Point = new PIXI.Point();

	get RenderBoundaries(): PIXI.Rectangle {
		return null;
	}

	constructor(stage: PIXI.Container, fromPoint: PIXI.Point, toPoint: PIXI.Point) {
		
		this.graphics = new PIXI.Graphics();
		this.container = new PIXI.Container();
		this.container.addChild(this.graphics);

		stage.addChild(this.container);

		this.fromPoint = fromPoint;
		this.toPoint = toPoint;
	}

	PointDrag(isLeft: boolean, newPos: PIXI.Point) {

	}

	Translate(worldOffsetX: number, worldOffsetY: number) {
		
	}

	Render(worldToScreen: PIXI.Matrix) {
		let screenFromPoint = new PIXI.Point(this.fromPoint.x, this.fromPoint.y);
		worldToScreen.apply(screenFromPoint, screenFromPoint);

		let screenToPoint = new PIXI.Point(this.toPoint.x, this.toPoint.y);
		worldToScreen.apply(screenToPoint, screenToPoint);

		if (screenFromPoint == this.screenFromPoint && screenToPoint == this.screenToPoint) return;

		if (screenFromPoint.x - this.screenFromPoint.x == screenToPoint.x - this.screenToPoint.x &&
			screenFromPoint.y - this.screenFromPoint.y == screenToPoint.y - this.screenToPoint.y) {
			
			this.container.position.set(screenFromPoint.x, screenFromPoint.y);
			this.screenFromPoint = screenFromPoint;
			this.screenToPoint = screenToPoint;
		}
		else {
			this.screenFromPoint = screenFromPoint;
			this.screenToPoint = screenToPoint;
			this.DrawCurve();
		}
	}

	private DrawCurve() {
		this.container.position.set(this.screenFromPoint.x, this.screenFromPoint.y);
		let localTo = new PIXI.Point(this.screenToPoint.x - this.screenFromPoint.x, this.screenToPoint.y - this.screenFromPoint.y);

		console.log(this.screenFromPoint);
		console.log(Math.max(15, localTo.x / 2), 0);
		console.log(Math.min(localTo.x - 15, localTo.x / 2), localTo.y);
		console.log(localTo.x, localTo.y);

		this.graphics.clear().lineStyle(2, 0xff0000)
			.bezierCurveTo(Math.max(15, localTo.x / 2), 0, Math.min(localTo.x - 15, localTo.x / 2), localTo.y, localTo.x, localTo.y);
	}

	ApplyInteraction(cursorWorld: PIXI.Point, appHostRefs: IInteractionHost): boolean {
		return false;
	}
}