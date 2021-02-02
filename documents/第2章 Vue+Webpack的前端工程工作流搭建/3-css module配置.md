 ## 配置流程

1. 在`vue-loader.config.js`文件中添加配置：`cssModules:{}`

```javascript
cssModules: {
  localIndetName: '[path]-[name]-[hash:base64:5]',// css对应的class名称
  camelCase: true // style中的class类名用横杠连接方式转化为驼峰命名方式，Javascript变量使用驼峰命名时，书写style中的calss类名时一般使用 - 连接，调用时不好用
},
```

2. 在需要使用的此配置的`style`标签处添加`module`，编译完成以后此组件会自动添加一个变量`$style`，我们可以使用`:calss`引用style中的对象。如下所示：

```vue
<template>
	<!-- 使用main-test样式 -->
	<h1 :class="$style.mainTest">
    Test
  </h1>
</template>

<script>
  ……
</script>
<!-- 添加module使其生效 -->
<style module>
  .main-test {
    text-align: center
  }
</style>
```

3. 自动匹配生成代码时的class名字为`localIndetName`配置的内容，这样子没有class命名空间的冲突，不会出现重复；可以定义class名称，保密性比较好。

## 注意事项

`vue-loader`在`v14`以后修改配置的位置，在 css-loade 的模块`options`中配置，CSS Modules 现在需要通过 css-loader 选项显式地配置


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

此时会对所有的css文件做这种处理，我们如果只对其中一部分做处理的话，则需要加上匹配条件。

如下对styl文件的处理，增加了`resourceQuery: /module/`，对style标签中添加module的CSS代码做处理，其余的则不使用这种处理方式

```javascript
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
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }
    ]
}
```

