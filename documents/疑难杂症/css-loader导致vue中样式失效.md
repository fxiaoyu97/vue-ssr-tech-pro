## 问题描述

vue文件中的样式失效

## 环境

+ `css-loader: 5.0.1 `
+ `vue-style-loader：4.1.2`

## 原因

`css-loader4.0`后默认对`esModule`设置的是`true`

`vue-style-loader 4.1.2`默认接收的是commonjs的结果，也就是默认接收的是“css-loader中esModule设置的是false的结果”，所以一个配置的是true，一个接收的是false，最终就不会显示样式了。

## 解决

1. 在项目的`vue.config.js`中对`css`的`esModule`改成`false`

```javascript
module.exports = {
	...
    css: {
    	...
        esModule: false
    }
    ...
}
```

2. 修改webpack的配置文件，`css-loader`模块设置添加`esModule: false `

```javascript
module: {
  rules: [
    {
      test: /\.css$/i, 
      use: [
        {
          loader: 'css-loader', 
          options: { esModule: false } // 添加这个
        }
      ]
    }
  ]
}
```

## 参考

[css-loader导致vue中样式失效（坑坑坑！！）](https://blog.csdn.net/vv_bug/article/details/108148263)

