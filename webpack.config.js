const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const ImageminMozjpeg = require('imagemin-mozjpeg')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const mode = process.env.NODE_ENV
const enabledSourceMap =  mode !== 'production'

const config = {
  mode: mode,
  target: 'web',
  entry: {
    app: [
      path.resolve(__dirname, 'src/assets/scripts/app.js'),
      path.resolve(__dirname, 'src/assets/stylesheets/app.scss'),
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: 'dist',
      files: 'dist',
      injectChanges: true,
    }),
    new ESLintPlugin({
      extensions: ['.js'],
      exclude: 'node_modules'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/images'),
          to: 'images/[name][ext]',
          noErrorOnMissing: true,
        }
      ]
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        ImageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
      pngquant: {
        quality: '70-85',
      },
      gifsicle: {
        interlaced: false,
        optimizationLevel: 10,
        colors: 256,
      },
      svgo: {}
    }),
    new MiniCssExtractPlugin({
      filename: './stylesheets/[name].css',
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        page: 'top',
      },
      template: './src/index.html',
      filename: '../index.html',
      chunks: ['app'],
      hash: true,
      inject: 'body',
    }),
  ],
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist/assets'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: enabledSourceMap,
              importLoaders: 2,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer', { grid: true }],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap
            },
          },
        ]
      },
      {
        test: /\.(gif|png|jpg|svg)$/,
        type: 'asset/inline',
      },
    ]
  },
}

if (mode === 'development') config.devtool = 'source-map'

module.exports = config
