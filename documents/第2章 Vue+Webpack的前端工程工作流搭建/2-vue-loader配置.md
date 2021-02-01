## Vue-loader的配置

1. 在build文件夹下新建配置文件：`vue-loader.config.js`
2. 在webpack配置文件中引入配置文件：`const createVueLoaderOptions = require('./vue-loader.config')`
3. `style-loader`可能出现修改样式页面没有热更替，需要刷新页面的情况，可以替换成`vue-style-loader`模块

```javascript
// 根据不同的环境使用不同的配置
module.exports = isDev => {
  return {
    preserveWhitepace: true, // 清除vue文件中，文本换行等情况下的空格
    cssModules: {},
    hotReload: true // 热更新，默认会自动判断是否开发环境自动开启关闭，其实关闭后也会刷新页面更新
  }
}
```



## 打包前清除dist文件夹

1. 安装模块：`npm i -D rimraf   `
2. 在`package.json`文件中添加命令：`"clean": "rimraf dist"`
3. 可以修改`build`命令：`"build": "npm run clean && npm run build:client"`



## 自定义vue文件中不同块的loader

vue文件的结构如下所示：

```vue
<template>
	……
</template>

<script>
  ……
</script>

<style>
  ……
</style>

<docs>
  ……
</docs>
```

`vue-loader.config.js`文件中可以添加自定的loader去处理vue文件中的`docs`模块

```javascript
const docsLoader = require.resolve('./doc-loader')

module.exports = {
  return {
    loaders: {
      loaders { // 定义不同的模式使用指定的loader去处理
  			'docs': docsLoader,
			},
  		preLoader:{},// 在指定模块处理之前的做一些处理
      postLoader:{}// 在指定模块处理之后的做一些处理
    }
  }
}
```



