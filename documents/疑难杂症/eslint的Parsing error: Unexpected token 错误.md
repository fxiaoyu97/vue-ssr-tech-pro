## 问题

检查代码配置的`eslint-config-standard`，使用eslint的修复命令时，出现`Parsing error: Unexpected token`

Eslint 修复命令：`eslint --fix --ext .js --ext .jsx --ext .vue client/`

## 环境

+ `node: 14.15.3`
+ `webpack: 5.12.2`
+ `eslint: 7.19.0`
+ `eslint-config-standard: 16.0.2`

## 原因

未知，猜测是对代码的解析错误

## 解决方案

1. 如果是对普通javascript代码的样式检测，则使用此方法尝试一下，eslint 配置 babel-eslint 插件

```
1. 安装 babel-eslint 插件
npm install babel-eslint --save-dev
2. 在 .eslintrc 文件中配置 parser 属性
"parser": "babel-eslint"
```

`.eslintrc` 如下所示：

```json
{
  "extends": "standard",
  "parser": "babel-eslint",
  "plugins": [
    "html"
  ]
}
```

2. 如果项目是vue项目，主要对vue文件做代码检测，则可以使用`eslint-plugin-vue`插件

   1. 安装插件：`npm install eslint-plugin-vue --save-dev`

   2. 修改`.eslintrc`文件

   ```json
   {
     "extends": "standard",
     "parser": "vue-eslint-parser",
     "plugins": [
       "html"
     ]
   }
   ```

3. 如果你是其他项目，尝试查找安装相关项目的eslint检查插件

