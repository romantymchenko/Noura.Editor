import React, { Component } from "react";
import { PageHeader, Breadcrumb, Collapse } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
const { Panel } = Collapse;

export class TopPanel extends Component<{}, {}> {

	render() {
		return (
			<div id="TopPanel" style={{ 
				position: "absolute", 
				left: 10, 
				right: 10,
				top: 10, 
				backgroundColor: "white",
				borderRadius: 2,
				padding: 15 
			}}>
				<Breadcrumb>
					<Breadcrumb.Item>
						<HomeOutlined />
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						{"Untitled App"}
					</Breadcrumb.Item>
				</Breadcrumb>
			</div>
		);
	}
}