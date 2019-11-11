const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const output = path.resolve(__dirname, '../', 'public')
const root = path.resolve(__dirname)
const sources = path.resolve(root, 'src')
const context = path.resolve(sources, 'main')
const tsconfig = path.resolve(root, 'tsconfig.json')

module.exports = {
  context: context,
  mode: 'development',
  entry: [
    'app.ts'
  ],
  output: {
    path: output,
    filename: 'app.js'
  },
  module: {
    rules: [
      {test: /\.ts(x?)$/, use: `awesome-typescript-loader?configFileName=${tsconfig}`},
      {test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader']},
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            }
          },
          'postcss-loader',
          'stylus-loader'
        ]
      },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader',] }
    ]
  },
  resolve: {
    modules: [context, sources, 'node_modules'],
    extensions: ['.js', '.ts', '.tsx']
  },
  plugins: [
   new MiniCssExtractPlugin({filename: 'app.css'})
  ],
  devtool: 'source-map'
}
