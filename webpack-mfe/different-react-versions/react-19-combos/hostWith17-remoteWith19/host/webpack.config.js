const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;

// Command flags override config options
module.exports = {
  // mode is set to development by default if not specified
  mode: 'development',
  entry: path.resolve(__dirname, './src/index'),
  output: {
    // [name] is replaced with the name of the entry point, in this case 'main' which is the default name for the entry point
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto', // This allows the app to be served from any path, which is useful for micro-frontends
  },
  resolve: {
    // Resolve TypeScript files
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    port: 3000,
    open: true,
    // hot: true, // hot module replacement, it will update the changes in the browser without reloading the page. Since we are using webpack-dev-server, it is automatically enabled.
  },
  module: {
    rules: [
      // TypeScript loader to transpile TypeScript code into JavaScript
      {
        test: /\.[t]sx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // css loader to transpile CSS code into JavaScript
      {
        test: /\.css$/i,
        // style-loader is used to inject the CSS into the DOM
        // css-loader is used to resolve the CSS imports
        use: ['style-loader', 'css-loader'],
      },
      // asset/resource will copy the file to the output directory and will give it a unique name
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      // asset/inline will inline the file as a data URI, it is useful for small files like images, fonts, etc.
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remote: 'remote@http://localhost:3001/remoteEntry.js',
      },
      shared: {},
    }),
    // HTML Webpack Plugin to generate HTML file, it will automatically inject the script tag for the generated bundle
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
