var webpack = require('webpack')
var path = require('path')
var CopyFilesPlugin = require('copy-webpack-plugin')


module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  plugins: [
    new CopyFilesPlugin([
      {
        from: './src/images',
        to: './images'
      },
      {
        context: './src',
        from: '**/*.html',
        to: './'
      },
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'testing'
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    fallback: path.join(__dirname, 'node_modules')
  }
}
