// postcss的配置文件
const autoprefixer = require('autoprefixer')

// styl编译完成css代码以后，对css代码进行优化使用，通过组件优化
module.exports = {
  plugins: [
    autoprefixer() // 有些浏览器样式文件需要添加前缀，可以自动添加
  ]
}