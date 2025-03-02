const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/scripts/index.js', // Точка входа
    output: {
      path: path.resolve(__dirname, 'dist'), // Выходная директория
      filename: 'bundle.[contenthash].js', // Имя выходного файла
      publicPath: isProduction ? './' : '/', // Разные пути для dev и prod
      clean: true, // Очистка директории dist перед сборкой
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'), // Директория для dev-server
      },
      watchFiles: ['src/**/*.html'], // Слежение за изменениями в HTML
      hot: true, // Горячая замена модулей
      open: true, // Автоматическое открытие браузера
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext]',
          },
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            esModule: false,
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(), // Очистка директории dist перед сборкой
      new HtmlWebpackPlugin({
        template: './src/index.html', // Шаблон HTML
        filename: 'index.html', // Имя выходного файла
        inject: 'body', // Подключение скриптов в <body>
        scriptLoading: 'blocking', // Режим загрузки скриптов
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css', // Имя выходного CSS-файла
      }),
    ],
    optimization: {
      minimizer: [new CssMinimizerPlugin()], // Минификация CSS
    },
    devtool: isProduction ? false : 'source-map', // Source maps только в режиме разработки
  };
};