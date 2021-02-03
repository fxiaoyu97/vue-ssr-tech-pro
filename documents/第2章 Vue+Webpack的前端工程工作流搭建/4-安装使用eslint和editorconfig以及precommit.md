## 安装使用Eslint

保证代码格式一致，避免一些格式带来的错误。

1. 安装eslint，`eslint-config-standard、eslint-plugin-standard、eslint-plugin-promise、eslint-plugin-import、eslint-plugin-node`为标准规则相关的插件

```shell
npm install eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node --save-dev
```

2. 根目录下创建文件`.eslintrc`，内容为json格式

```json
{
  "extends": "standard"
}
```

3. eslint无法直接识别vue文件中的JavaScript代码，安装一个模块`eslint-plugin-html`识别`<javascript>`标签中的JavaScript代码。

```shell
npm i eslint-plugin-html --save-dev
```

4. 添加模块到eslint配置文件`.eslintrc`中

```json
{
  "extends": "standard",
  "plugins": [
    "html"
  ]
}
```

5. 在`package.json`中添加命令，`--ext`指定文件后缀，最后一个参数表示检测哪个文件夹下面的文件

```
"lint": "eslint --ext .js --ext .jsx --ext .vue client/"
```

6. 运行命令：`npm run lint`，检验代码，会发现代码中有一堆错误信息
7. 添加修复代码的命令，`--fix`参数修复查找出来的问题

```
"lint-fix": "eslint --fix --ext .js --ext .jsx --ext .vue client/"
```

8. 运行命令`npm run lint-fix`修复代码缺陷，此时可能会出现错误信息：`Parsing error: Unexpected token`，因为我们的项目属于vue项目，所以使用vue的解决方法。
   1. 安装依赖`npm install eslint-plugin-vue --save-dev`
   2. 修改`.eslintrc.js`文件，添加`parser: 'vue-eslint-parser',`

```json
{
  "extends": "standard",
  "parser": "vue-eslint-parser",
  "plugins": [
    "html"
  ]
}
```

9. 希望在项目开发过程中，项目自动进行 eslint 的检查，项目写完再运行命令检查代码问题，比较浪费时间。

   1. 安装插件`eslint-loader`和`babel-eslint`，命令：`npm i eslint-loader --save-dev`
   2. 修改`webpack.config.base.js`文件，在 rules 中添加相关的规则

   ```javascript
   module: {
     // 添加规则
     rules: [
       {
         test: /\.(vue|js|jsx)$/, // 所有要检测的文件的后缀名的集合
         loader: 'eslint-loader',
         exclude: /node_modules/,
         enforce: 'pre' // 预处理，对于这几种文件，在处理loader加载之前，都会通过 eslint-loader 处理一次
       }
     ]
   }
   ```

## 配置editorconfig

用来规范编辑器的配置，在不同的编辑器在同一项目有相同的配置

VSCode需要安装相关插件`EditorConfig for VS Code`，Webstorm自带插件，无需安装。

+ `root = true`：读取 editorconfig 的配置，读到这个文件即可，不用再往上层目录搜索
+ `charset`：编码方式
+ `end_of_line`：指定换行符，Linux 换行符为 `lf`
+ `indent_size`：tab 键的空格长度
+ `indent_style = space`：tab 键的样式，推荐使用 space ，表示空格
+ `insert_final_newline = true`：文件末尾自动添加空行
+ `trim_trailing_whitespace = true`：去除行末的空格

`.editorconfig`文件内容如下所示：

```
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
```

## git commit之前检测代码规范性——precommit

在项目使用 git 提交代码时，使用 git 的钩子 precommit ，在使用 git commit 之前检测代码的规范性，代码不合格无法提交。

1. 安装依赖：`npm i husky --save-dev`
2. 在 package.json 中添加命令

```
"precommit":"npm run lint-fix",
```

3. 项目必须是git初始化过的项目，非 git 项目无法使用此模块