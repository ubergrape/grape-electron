const path = require('path')

module.exports = {
  entry: './src/pages/index.js',
  output: {
    path: path.resolve(__dirname, 'lib/pages'),
    filename: 'index.js',
  },
  target: 'electron-renderer',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        type: 'javascript/auto',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
