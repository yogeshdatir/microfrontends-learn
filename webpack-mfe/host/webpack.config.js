import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = path.resolve();

export default {
  entry: "./src/index.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    // Resolve TypeScript files
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // TypeScript loader to transpile TypeScript code into JavaScript
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // HTML Webpack Plugin to generate HTML file
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
};