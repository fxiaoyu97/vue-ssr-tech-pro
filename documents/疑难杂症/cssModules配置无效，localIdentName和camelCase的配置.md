## 问题

在`vue-loader`的配置文件`vue-loader.config.js`中配置的`cssModules`无效，也没报错

## 环境

+ `vue-loader: 15.9.6`
+ `webpack: 5.12.2`
+ `css-loader: 5.0.1`

## 原因

配置的方式做了修改，`vue-loader`版本的原因

## 解决

`vue-loader`在`v14`以后修改配置的位置，在 css-loade 的模块`options`中配置，CSS Modules 现在需要通过 css-loader 选项显式地配置。<style> 标签上的 module 特性仍然需要用来局部注入到组件中。

在新版本的 css-loader 中，`localIdentName`不再与`modules`平级，而是变成了`modules`的属性。

查看webpack版本进行配置。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
            exportLocalsConvention: "camelCase",
          }
        }
      }
    ]
  }
}
```

## 参考

[Vue Loader在v14以后的css Modules配置](https://vue-loader.vuejs.org/zh/migrating.html#css-modules)

[webpack5官方文档-css-loader](https://webpack.js.org/loaders/css-loader/#modules)

