import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";

export default {
  entry: "./src/js/main.js",
  devtool: process.env.WEBPACK_SERVE ? "eval-cheap-source-map" : false,
  output: {
    filename: "[name].[contenthash].mjs",
    chunkFilename: "[name].[chunkhash].chunk.mjs",
    clean: true,
  },
  devServer: {
    hot: true,
    port: 8080,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          parse: {
            ecma: 8,
          },
          mangle: { safari10: true },
          output: {
            ecma: 5,
            safari10: true,
            comments: false,
            /* eslint-disable-next-line camelcase */
            ascii_only: true,
          },
        },
        parallel: true,
      }),
    ],
    runtimeChunk: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader?cacheDirectory=true"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeScriptTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin(),
    new ESLintWebpackPlugin(),
  ],
};
