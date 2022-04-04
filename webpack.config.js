/** @type {import('webpack').Configuration} */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

exports.default = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "p5.wasm.js",
    clean: true,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  externals: {
    p5: "p5",
  },
  experiments: {
    asyncWebAssembly: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/index.html", to: "" },
      ],
    }),
  ],
};
