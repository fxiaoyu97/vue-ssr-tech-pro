const path = require('path') // 使用绝对路径，防止出现问题
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin') // 使用html处理相关的组件
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将css模块和js模块分开打包，安装工具：npm i mini-css-extract-plugin
const baseConfig = require('./webpack.config.base')
const { merge } = require('webpack-merge') // 合并不同的webpack配置，根据所有的配置项，合理的合并

// 代码要用在正式环境和开发环境下，此时需要添加判断，添加依赖 cross-env(可以适配不同的平台),
// 启动命令上添加环境变量 cross-env NODE_ENV=production webpack --config webpack.config.js
// 添加环境变量判断的标志，启动脚本设置的变量存放在process.env中
const isDev = process.env.NODE_ENV === 'development'

// 服务器渲染不需要这些配置，所以写到client配置中
const defaultPlugins = [
  new webpack.DefinePlugin({
    // 在这里写了，在webpack编译过程中以及页面上写的js代码中判断环境，就可以直接引用 process.env.NODE_ENV
    // 现在vue根据不同的环境进行打包，开发环境包含很多错误信息提示，很多在正式环境不用的功能，降低代码效率，增加代码的大小，区分环境可以减少不需要的东西
    // 没有双引号会变成变量名称
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin(),
  new VueLoaderPlugin()
]

// webpack2之后新增加的配置
const devServer = {
  port: 8000, // 配置端口号
  host: '0.0.0.0', // 可以通过localhost访问，也可以通过局域网IP地址访问
  overlay: {
    // webpack有任何的编译错误都显示在网页上面
    errors: true
  },
  hot: true, // 修改组件代码，只会重新渲染组件代码
  open: true // 运行的时候自动打开浏览器，每次都会打开新的页面
}

let config

if (isDev) {
  config = merge(baseConfig, {
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.styl/, // 使用css预处理器
          use: [
            'style-loader', // 各模块自下往上处理，下面的处理完，会变成上面模块要处理的文件
            'css-loader', // 每个loader只处理它自己关心的那部分，不会管处理以后的文件
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true // stylus-loader可以生成sourceMap文件，此处配置让postcss-loader直接使用已生成的文件，不再自己生成
              }
            },
            'stylus-loader'
          ]
        },
        {
          test: /\.css$/i, //i表示大小写不敏感
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(), // 热替换模块
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js',
      publicPath: './', // 解决 Automatic publicPath is not supported in this browser 错误
      path: path.join(__dirname, '../dist')
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            { loader: 'stylus-loader' }
          ]
        },
        {
          test: /\.css$/i, //i表示大小写不敏感
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader'
          ]
        }
      ]
    },
    plugins: defaultPlugins.concat([
      new MiniCssExtractPlugin({
        filename: 'styles.[chunkhash].[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false // Enable to remove warnings about conflicting order
      })
    ]),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'vendor'
          }
        }
      },
      runtimeChunk: true
    }
  })
}
module.exports = config
