1. 安装webpack的变化，V4以后命令行使用 webpack 依赖`webpack-cli`

```shell
npm i webpack webpack-dev-server webpack-merge webpack-cli --save-dev
```

2. 升级其他依赖模块

```shell
npm i babel-loader extract-text-webpack-plugin file-loader html-webpack-plugin --save-dev
```

3. 如果出现还未适配的依赖版本，可以尝试使用未发布的下一个版本，例如：

```shell
npm i extract-text-webpack-plugin@next --save-dev
```

4. `webpack.config.base.js`中的 config 添加 mode 配置

```javascript
const config = {
  mode: process.env.NODE_ENV || 'production', // development||productions
  target: 'web', // 添加一个编译目标
  ……
}
```

5. 去除webpack配置文件中 plugins 下的 `new webpack.NoEmitOnErrorsPlugin()`，已废弃