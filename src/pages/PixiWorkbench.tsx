import React, { Component } from "react";
import * as PIXI from "pixi.js";
import { WorkbenchApplication } from "../pixi/WorkbenchApplication";

interface State {
	pixiApp: PIXI.Application,
	workbenchApp: WorkbenchApplication
}

export class PixiWorkbench extends Component<{}, State> {
	
	state = {
		pixiApp: new PIXI.Application({ resizeTo: window }),
		workbenchApp: new WorkbenchApplication()
	};

	workbench = React.createRef<HTMLDivElement>();

	componentDidMount() {
		this.workbench.current.appendChild(this.state.pixiApp.view);
		this.state.workbenchApp.InitWithPixi(this.state.pixiApp);
	}
  
	render() {
		return (
			<div id="PixiWorkbench" ref={this.workbench}/>
		);
	}
}