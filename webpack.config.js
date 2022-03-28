/** @type {import('webpack').Configuration} */
const path = require("path");
exports.default = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "p5.wasm.js",
    clean: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  externals:{
      p5: 'p5'
  }
};
