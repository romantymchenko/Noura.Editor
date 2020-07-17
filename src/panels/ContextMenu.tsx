import React, { Component } from "react";
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;

interface IProps {
	contextMenuPosition: { x: number, y: number }
	onMenuClick: (info: any) => void;
}

export class ContextMenu extends Component<IProps, {}> {

	render() {
		return (
			<div id="ContextMenu" style={{ 
				position: "absolute", 
				left: this.props.contextMenuPosition.x, 
				top: this.props.contextMenuPosition.y 
			}}>
				<Menu onClick={this.props.onMenuClick} style={{ width: 150 }} mode="vertical">
					<SubMenu key="create" title="Create">
						<Menu.Item key="newFunc">New Function</Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		);
	}
}