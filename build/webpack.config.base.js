const path = require('path') // 使用绝对路径，防止出现问题

// 代码要用在正式环境和开发环境下，此时需要添加判断，添加依赖 cross-env(可以适配不同的平台),
// 启动命令上添加环境变量 cross-env NODE_ENV=production webpack --config webpack.config.js
// 添加环境变量判断的标志，启动脚本设置的变量存放在process.env中
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web', // 添加一个编译目标
  entry: path.join(__dirname, '../client/index.js'), // __dirname表示这个文件所在目录的地址,path.join表示两个路径拼接起来,entry表示文件入口
  // 文件出口
  output: {
    filename: 'bundle.[hash:8].js', // 输出文件
    path: path.join(__dirname, '../dist') // 输出路径
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
        test: /\.js$/, // 处理js文件
        loader: 'babel-loader',
        exclude: /node_modules/ // 这里面的js文件已经编译过了，可以忽略掉
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/, // 处理图片
        use: [
          {
            loader: 'url-loader', // 处理时使用的loader,依赖于file-loader
            // 对loader的配置
            options: {
              limit: 1024, // 图片转化成base64代码，写道js文件中，文件大小 小于1024转化成base64代码
              name: 'resources/[path][name].[hash:8].[ext]' // 定义输出文件的名称
            }
          }
        ]
      }
    ]
  }
}

module.exports = config
