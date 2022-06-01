const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const WebpackBundleAnalyzer =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const loadEnv = require("./loadEnv");
loadEnv();

module.exports = function (server = process.env.API_SERVER_URL) {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: "main.[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        title: "ephemori",
        template: "indexTemplate.html"
      }),
      new webpack.DefinePlugin({
        "process.env.API_SERVER_URL": JSON.stringify(process.env.API_SERVER_URL)
      })
      // process.env.NODE_ENV !== "production" && new WebpackBundleAnalyzer()
    ],
    devtool:
      process.env.NODE_ENV === "production"
        ? "source-map"
        : "eval-cheap-module-source-map",
    watchOptions: {
      ignored: /node_modules/,
      poll: true
    },
    entry: {
      main: path.resolve(__dirname, "./src/index.js")
    },
    module: {
      rules: [
        {
          test: [/\.js$/],
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"],
              plugins: ["@babel/plugin-transform-runtime"]
            }
          }
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          test: /\.(woff(2)?|ttf|eot)$/,
          type: "asset/resource",
          generator: {
            filename: "./fonts/[name][ext]"
          }
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader"
            }
          ]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, "./public"),
      filename: "bundle.[contenthash].js",
      clean: true,
      publicPath: "/"
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, "public")
      },
      compress: true,
      port: 9000,
      proxy: {
        "/api": {
          target: server
        }
      }
    }
  };
};
