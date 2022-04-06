/** @type {import('webpack').Configuration} */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const generalConfig = {
  entry: "./src/index.ts",
  externals: {
    p5: "p5",
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "asset/resource",
        generator:{
          filename: "[name][ext]"
        }
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  experiments: {
    asyncWebAssembly: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: "./src/index.html", to: "" }],
    }),
  ],
}

const nodeConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, "dist", "node"),
    filename: "p5.wasm.js",
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
}

const browserConfig = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, "dist", "web"),
    filename: "p5.wasm.js",
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
}

module.exports = (env, argv) => {
  if(argv.mode === 'development') {
    generalConfig.devtool = 'cheap-module-source-map';
  } else if (argv.mode === 'production') {

  } else {
    throw new Error('please specify "env" flag')
  }

  Object.assign(nodeConfig, generalConfig)
  Object.assign(browserConfig, generalConfig)

  return [nodeConfig, browserConfig]
}