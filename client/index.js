import Vue from 'vue' // 引入vue类库
import App from './App.vue'

import './assets/styles/global.styl' // 引入样式

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
  render: (h) => h(App) // 渲染内容
}).$mount(root) // 挂载在root节点下
