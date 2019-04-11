//plugins
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

//node
const path = require('path');
const fs = require("fs");

const mode = process.argv[process.argv.indexOf("--mode") + 1] || "development";

const clientConfig = {
    name: 'app',
    target: 'web',
    entry: {
        app: path.resolve("src/App.tsx"),
    },
    output: {
        filename: '[name].js', // output file
        path: path.resolve("build")
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true
                },
            }
        }
    },
    devtool: mode === "development" ? 'source-map' : 'none',
    resolve: {
        // Add in `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js', ".css", ".json"],
        alias: {
            '@app': path.resolve('./src/')
        }
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/, loader: "ts-loader",

                options: {
                    instance: "app",
                    configFile: path.resolve("tsconfig.json")
                },
            },

            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },

            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {

                            modules: true,
                            namedExport: true,
                            localIdentName: "[name]__[local]__[hash:4]"
                        }
                    }

                ]
            }

        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({ mode }),
        // Clean
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" }),

        new CopyWebpackPlugin([
            { from: path.resolve('src/favicon.ico') },
            { from: path.resolve('src/app.webmanifest') },
            { from: path.resolve('src/service.worker.js') },
            { from: path.resolve('src/assets'), to: "assets" },
        ]),

        new HtmlWebpackPlugin({  // Also generate a test.html        
            template: path.resolve("src/index.html")
        })

    ],
    stats: { children: false }
};


const serverConfig = {
    name: 'server',
    target: 'node',
    entry: {
        server: path.resolve("src/server.ts")
    },
    output: {
        filename: '[name].js', // output file
        path: path.resolve("build")
    },
    devtool: mode === "development" ? 'source-map' : 'none',
    resolve: {
        // Add in `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js', ".css", ".json"],
        alias: {
            '@server': path.resolve('./src/')
        }
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/, loader: "ts-loader",

                options: {
                    instance: "app",
                    configFile: path.resolve("tsconfig.json")
                },
            },
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({ mode }),
        // Clean
        // new CopyWebpackPlugin([
        //     { from: path.resolve('src/.env') },
        //     { from: path.resolve('docker-compose.yml') }
        // ]),

    ],
    stats: { children: false }
};

module.exports = [clientConfig, serverConfig];