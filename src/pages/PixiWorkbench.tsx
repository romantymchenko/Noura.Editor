import React, { Component } from "react";
import * as PIXI from "pixi.js";
import { WorkbenchApplication } from "../pixi/WorkbenchApplication";

interface State {
	pixiApp: PIXI.Application,
	workbenchApp: WorkbenchApplication
}

export class PixiWorkbench extends Component<{}, State> {
	
	state = {
		pixiApp: new PIXI.Application({ width: window.innerWidth, height: innerHeight }),
		workbenchApp: new WorkbenchApplication()
	};

	workbench = React.createRef<HTMLDivElement>();

	componentDidMount() {
		this.workbench.current.appendChild(this.state.pixiApp.view);
		this.state.workbenchApp.InitWithPixi(this.state.pixiApp);

		this.addEventListeners();
	}

	componentWillUnmount() {
		this.removeEventListeners();
	}

	addEventListeners() {
		window.addEventListener("resize", this.onWindowResize.bind(this));
		window.oncontextmenu = this.onContextMenu.bind(this);

		this.workbench.current.addEventListener("wheel", this.onMouseWheel.bind(this));
		this.workbench.current.addEventListener("mousedown", this.onMouseDown.bind(this));
		this.workbench.current.addEventListener("mouseup", this.onMouseUp.bind(this));
		this.workbench.current.addEventListener("mousemove", this.onMouseMove.bind(this));
	}

	removeEventListeners() {
		window.removeEventListener("resize", this.onWindowResize.bind(this));
		window.oncontextmenu = () => {};

		this.workbench.current.removeEventListener("wheel", this.onMouseWheel.bind(this));
		this.workbench.current.removeEventListener("mousedown", this.onMouseDown.bind(this));
		this.workbench.current.removeEventListener("mouseup", this.onMouseUp.bind(this));
		this.workbench.current.removeEventListener("mousemove", this.onMouseMove.bind(this));
	}

	onWindowResize(event: UIEvent) {
		this.state.workbenchApp.onWindowResize(event);
	}

	onContextMenu(event: MouseEvent) {
		this.state.workbenchApp.onContextMenu(event);
		return false;
	}

	onMouseWheel(event: WheelEvent) {
		this.state.workbenchApp.onMouseWheel(event);
		event.preventDefault();
	}

	onMouseDown(event: MouseEvent) {
		this.state.workbenchApp.onMouseDown(event);
	}

	onMouseUp(event: MouseEvent) {
		this.state.workbenchApp.onMouseUp(event);
	}

	onMouseMove(event: MouseEvent) {
		this.state.workbenchApp.onMouseMove(event);
	}
  
	render() {
		return (
			<div id="PixiWorkbench" ref={this.workbench}/>
		);
	}
}