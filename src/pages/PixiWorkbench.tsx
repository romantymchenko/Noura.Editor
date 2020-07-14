import React, { Component } from "react";
import * as PIXI from "pixi.js";
import { WorkbenchApplication } from "../pixi/WorkbenchApplication";
import { OptionsPanel } from "../panels/OptionsPanel";
import { ContextMenu } from "../panels/ContextMenu";
import { TopPanel } from "../panels/TopPanel";

interface IState {
	pixiApp: PIXI.Application,
	workbenchApp: WorkbenchApplication,
	screenDimensions: { width: number, height: number },
	contextMenuActive: boolean,
	contextMenuPosition: { x: number, y: number }
}

export class PixiWorkbench extends Component<{}, IState> {
	
	state = {
		pixiApp: new PIXI.Application({ width: window.innerWidth, height: innerHeight }),
		workbenchApp: new WorkbenchApplication(),
		screenDimensions: {
			width: window.innerWidth,
			height: window.innerHeight
		},
		contextMenuActive: false,
		contextMenuPosition: { x: 0, y: 0 }
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
		this.setState({ 
			screenDimensions: {
				width: window.innerWidth,
				height: window.innerHeight
			} 
		});
		this.state.workbenchApp.onWindowResize(event);
	}

	onContextMenu(event: MouseEvent) {
		this.state.workbenchApp.onContextMenu(event);
		return false;
	}

	onContextMenuClick(info) {
		this.setState({ contextMenuActive: false });
	}

	onMouseWheel(event: WheelEvent) {
		this.state.workbenchApp.onMouseWheel(event);
		event.preventDefault();
	}

	onMouseDown(event: MouseEvent) {
		if (this.state.contextMenuActive) {
			this.setState({ contextMenuActive: false });
			return;
		}
		
		//rbc
		if (event.button == 2) {
			this.setState({
				contextMenuActive: true,
				contextMenuPosition: { x: event.clientX, y: event.clientY }
			});
			return;
		}

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
			<section id="PixiWorkbench">
				<div id="CanvasHolder" ref={this.workbench}/>
				<TopPanel />
				<OptionsPanel functionNames={["asdasdas"]}/>
				{ this.state.contextMenuActive && (
					<ContextMenu 
						onMenuClick={this.onContextMenuClick.bind(this)}
						contextMenuPosition={this.state.contextMenuPosition}
					/>
				)}
			</section>
		);
	}
}