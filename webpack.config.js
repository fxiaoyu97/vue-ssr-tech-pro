const path = require('path') // 使用绝对路径，防止出现问题
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin') // 使用html处理相关的组件
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将css模块和js模块分开打包，安装工具：npm i mini-css-extract-plugin

// 代码要用在正式环境和开发环境下，此时需要添加判断，添加依赖 cross-env(可以适配不同的平台),
// 启动命令上添加环境变量 cross-env NODE_ENV=production webpack --config webpack.config.js
// 添加环境变量判断的标志，启动脚本设置的变量存放在process.env中
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web', // 添加一个编译目标
  entry: path.join(__dirname, 'src/index.js'), // __dirname表示这个文件所在目录的地址,path.join表示两个路径拼接起来,entry表示文件入口
  // 文件出口
  output: {
    filename: 'bundle.[hash:8].js', // 输出文件
    path: path.join(__dirname, 'dist') // 输出路径
  },
  module: {
    // 添加规则
    rules: [
      {
        test: /\.vue$/, // 检测文件类型,正则表达式
        loader: 'vue-loader' // 匹配到相关文件时，处理时使用的模块
      },
      {
        test: /\.jsx$/, // 处理jsx文件，需要在.babelrc配置中添加相关内容，安装相关模块(babel-load v8+)： @babel/core @babel/preset-env babel-loader
        loader: 'babel-loader'
      },
      {
        test: /\.css$/, // 处理css文件
        // css-loader只能处理css文件，不能把文件写入html文件中，需要借助其他模块
        use: [
          'style-loader', // 把css文件写入html中
          'css-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/, // 处理图片
        use: [
          {
            loader: 'url-loader', // 处理时使用的loader,依赖于file-loader
            // 对loader的配置
            options: {
              limit: 1024, // 图片转化成base64代码，写道js文件中，文件大小 小于1024转化成base64代码
              name: '[name].[ext]' // 定义输出文件的名称
            }
          }
        ]
      }
    ]
  },
  plugins: [
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
  ],

  mode: 'development'
}

/**
 * 帮助我们在页面调试代码，浏览器不支持ES6代码，需要做代码映射，在浏览器可以看到我们写的代码
 * eval 每个模块都使用 eval() 执行，并且都有 //@ sourceURL。此选项会相当快地构建。主要缺点是，由于会映射到转换后的代码，而不是映射到原始代码，所以不能正确的显示行数。
 * inline-source-map - SourceMap 转换为 DataUrl 后添加到 bundle 中。
 * eval-source-map - 每个模块使用 eval() 执行，并且 SourceMap 转换为 DataUrl 后添加到 eval() 中。初始化 SourceMap 时比较慢，但是会在重构建时提供很快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。
 * cheap-module-eval-source-map - 就像 eval-source-map，每个模块使用 eval() 执行，并且 SourceMap 转换为 DataUrl 后添加到 eval() 中。"低开销"是因为它没有生成列映射(column map)，只是映射行数。
 *
 */
// config.devtool = isDev ? false : '#cheap-module-eval-source-map'
if (isDev) {
  config.module.rules.push({
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
  })
  config.devtool = 'cheap-module-source-map'
  // webpack2之后新增加的配置
  config.devServer = {
    port: 8000, // 配置端口号
    host: '0.0.0.0', // 可以通过localhost访问，也可以通过局域网IP地址访问
    overlay: {
      // webpack有任何的编译错误都显示在网页上面
      errors: true
    },
    hot: true, // 修改组件代码，只会重新渲染组件代码
    open: true // 运行的时候自动打开浏览器，每次都会打开新的页面
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(), // 热替换模块
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  // 单独打包js文件
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  // 区分正式环境和开发环境的文件名称
  config.output = {
    filename: '[name].[chunkhash:8].js',
    publicPath: './', // 解决 Automatic publicPath is not supported in this browser 错误
    path: path.join(__dirname, 'dist')
  }
  // 区分不同的环境，正式环境分开打包文件
  config.module.rules.push({
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
  })
  // 指定输出文件的名字
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'styles.[chunkhash].[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    })
  )
  // 类库文件的单独打包配置
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendor'
        }
      }
    },
    runtimeChunk: true
  }
}
module.exports = config
