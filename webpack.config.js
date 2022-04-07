/** @type {import('webpack').Configuration} */
const path = require("path");
require('dotenv').config()
exports.default = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "p5.wasm.js",
    clean: true,
  },
  mode: process.env.MODE || "production",
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
  externals: {
    p5: "p5",
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
