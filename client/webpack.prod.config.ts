import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config: Configuration = {
  entry: path.resolve(__dirname, 'index.tsx'),
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    modules: [__dirname, "src", "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
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
  }
}

export default config