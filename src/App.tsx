import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./app.css";
import "antd/dist/antd.less";
import { PixiWorkbench } from "./pages/PixiWorkbench";

class App extends Component<any, any> {
    
    render() {
        return (
            <section id="App">
                <PixiWorkbench />
            </section>
        );
    }
}

var rootDiv = document.body.appendChild(document.createElement("div"));
rootDiv.id = "appRoot";
ReactDOM.render(<App />, rootDiv);