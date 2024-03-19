import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import type { Configuration as DevServerConfiguration } from "webpack-dev-server"

const devServer: DevServerConfiguration = {
  static: {
    directory: path.join(__dirname, 'dist', 'js'),
  },
  compress: true,
  port: 9000,
  historyApiFallback: true
  // devMiddleware: {
  //   index: true,
  //   mimeTypes: { phtml: 'text/javascript' },
  //   publicPath: path.join(__dirname, 'dist'),
  //   serverSideRender: true,
  //   writeToDisk: true,
  // }
} 

const config: Configuration = {
  mode: 'development',
  entry: path.resolve(__dirname, 'index.tsx'),
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    scriptType: "text/javascript",
    filename: 'bundle.[contenthash].js',
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    modules: [__dirname, "src", "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: ["file-loader"]
      }
    ],
  },
  devServer
}

export default config