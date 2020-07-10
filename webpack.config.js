const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var FaviconsWebpackPlugin = require("favicons-webpack-plugin");
var tsImportPluginFactory = require('ts-import-plugin');

module.exports = {
    entry: "./src/App.tsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    module:{
        rules:[
        {
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            // options: {
            //     transpileOnly: true,
            //     getCustomTransformers: () => ({
            //         before: [ 
            //             tsImportPluginFactory({
            //                 libraryName: 'antd',
            //                 libraryDirectory: 'lib',
            //                 style: true
            //             }) 
            //         ]
            //     }),
            //     compilerOptions: {
            //         module: 'es2015'
            //     }
            // },
            exclude: /node_modules/
        },
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        },
        {
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader",
            ],
        },
        {
            test: /\.less$/,
            use: [
                { loader: "style-loader" }, 
                { loader: "css-loader" }, 
                { loader: "less-loader",
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        },
                    },
                }]
        }],
    },
    // by default webpack doesn't look for .ts or .tsx files to resolve import section
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true
    },
    plugins: [
        new FaviconsWebpackPlugin(path.resolve(__dirname, "icon.png")),  
        new HtmlWebpackPlugin({ 
            title: "Noura",
            meta: {
				"viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, shrink-to-fit=no",
				"theme-color": "#000000"
			}
        })
    ]
};