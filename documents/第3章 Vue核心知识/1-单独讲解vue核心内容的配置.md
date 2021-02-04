1. 在 build 文件夹下创建配置文件`webpack.config.practice.js`文件，内容如下所示：

```javascript
const path = require('path') // 使用绝对路径，防止出现问题
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin') // 使用html处理相关的组件
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base')
const { merge } = require('webpack-merge') // 合并不同的webpack配置，根据所有的配置项，合理的合并

const defaultPlugins = [
  new webpack.DefinePlugin({
    // 在这里写了，在webpack编译过程中以及页面上写的js代码中判断环境，就可以直接引用 process.env.NODE_ENV
    // 现在vue根据不同的环境进行打包，开发环境包含很多错误信息提示，很多在正式环境不用的功能，降低代码效率，增加代码的大小，区分环境可以减少不需要的东西
    // 没有双引号会变成变量名称
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),
  new HTMLPlugin(),
  new VueLoaderPlugin()
]

// webpack2之后新增加的配置
const devServer = {
  port: 8088, // 配置端口号
  host: '0.0.0.0', // 可以通过localhost访问，也可以通过局域网IP地址访问
  overlay: {
    // webpack有任何的编译错误都显示在网页上面
    errors: true
  },
  hot: true, // 修改组件代码，只会重新渲染组件代码
  open: true // 运行的时候自动打开浏览器，每次都会打开新的页面
}

let config
config = merge(baseConfig, {
  entry: path.join(__dirname,'../parctice/index.js'),
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.styl/, // 使用css预处理器
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  esModule: false,
                  modules: {
                    localIdentName: '[path]-[name]-[hash:base64:5]', // css对应的class名称
                    exportLocalsConvention: 'camelCase' // style中的class类名用横杠连接方式转化为驼峰命名方式，Javascript变量使用驼峰命名时，style中的calss类名时一般使用 - 连接，调用时不好用
                  }
                }
              },
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
            use: [
              'vue-style-loader', // 各模块自下往上处理，下面的处理完，会变成上面模块要处理的文件
              {
                loader: 'css-loader', // 每个loader只处理它自己关心的那部分，不会管处理以后的文件
                options: {
                  esModule: false // vue文件中的样式失效,css-loader4.0后默认对esModule设置的是true,vue-style-loader 4.1.2默认接收的是commonjs的结果，也就是默认接收的是“css-loader中esModule设置的是false的结果”，  所以一个配置的是true，一个接收的是false，最终就不会显示样式了。
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true // stylus-loader可以生成sourceMap文件，此处配置让postcss-loader直接使用已生成的文件，不再自己生成
                }
              },
              'stylus-loader'
            ]
          }
        ]
      },
      {
        test: /\.css$/i, //i表示大小写不敏感
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  devServer,
  plugins: defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin() // 热替换模块
    // new webpack.NoEmitOnErrorsPlugin() 已经取消了，不再使用
  ])
})
module.exports = config
```

2. 在根目录下创建文件夹`practice`，入口文件为`/pactice/index.js`
3. 在 build 文件夹下面新建`template.html`文件，并在`HTMLPlugin`组件中引入此文件，生成的html文件都会以此文件为模版。

```
new HTMLPlugin(
	{template: path.join(__dirname,'template.html')}
),
```

4. 在 package.json 文件中添加启动脚本

```
"practice": "cross-env NODE_ENV=development webpack serve --config build/webpack.config.practice.js"
```

5. 解决 eslint 出现的编码规范问题，添加 rules ，并关闭 no-new

```json
{
  "extends": "standard",
  "parser": "vue-eslint-parser",
  "plugins": [
    "html"
  ],
  "rules":{
    "no-new":"off"
  }
}
```

