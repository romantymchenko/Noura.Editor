import React, { Component } from "react";
import { Menu, Collapse, Typography } from "antd";

interface IProps {
	functionNames: Array<string>
}

export class OptionsPanel extends Component<IProps, {}> {

	render() {
		return (
			<div id="FuncListPanel" style={{ 
				position: "absolute", 
				left: 10, top: 100,
				backgroundColor: "white",
				borderRadius: 2,
				width: 250
			}}>
				<Typography style={{ margin: 10 }}>{"Properties"}</Typography>
				<Typography style={{ marginLeft: 10 }}>{"variableSample 1: integer"}</Typography>
				<Typography style={{ marginLeft: 10 }}>{"variableSample 1: string"}</Typography>
				<Typography style={{ margin: 10 }}>{"Events"}</Typography>
				<Typography style={{ margin: 10 }}>{"Functions"}</Typography>
			</div>
		);
	}
}