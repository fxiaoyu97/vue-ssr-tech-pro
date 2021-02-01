// 根据不同的环境使用不同的配置
module.exports = isDev => {
  return {
    preserveWhitepace: true, // 清除vue文件中，文本换行等情况下的空格
    // cssModules: {
    //   localIdentName: '[path]-[name]-[hash:base64:5]',// css对应的class名称
    //   camelCase: true // style中的class类名用横杠连接方式转化为驼峰命名方式，Javascript变量使用驼峰命名时，style中的calss类名时一般使用 - 连接，调用时不好用
    // },
    hotReload: true // 热更新，默认会自动判断是否开发环境自动开启关闭，其实关闭后也会刷新页面更新
  }
}
