import React, { Component } from "react";
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;

interface IProps {
	contextMenuPosition: { x: number, y: number }
	onMenuClick: (info) => void;
}

export class ContextMenu extends Component<IProps, {}> {

	render() {
		return (
			<div id="ContextMenu" style={{ 
				position: "absolute", 
				left: this.props.contextMenuPosition.x, 
				top: this.props.contextMenuPosition.y 
			}}>
				<Menu onClick={this.props.onMenuClick} style={{ width: 256 }} mode="vertical">
					<Menu.Item key="1">Insert Function</Menu.Item>
					<SubMenu key="sub1" title="Insert Variable">
						<Menu.Item key="1">String</Menu.Item>
						<Menu.Item key="2">Number</Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		);
	}
}