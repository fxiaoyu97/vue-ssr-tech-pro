import Vue from 'vue'

const app = new Vue({
  el: '#root',
  template: '<div>{{text}}</div>',
  data: {
    text: 'aaa'
  },
  beforeCreate() {
    console.log(this, 'beforeCreate')
  },
  created() {
    console.log(this, 'created')
  },
  beforeMount() {
    console.log(this, 'beforeMount')
  },
  mounted() {
    console.log(this, 'mounted')
  },
  beforeUpdate() {
    console.log(this, 'beforeUpdate')
  },
  updated() {
    console.log(this, 'updated')
  },
  activated() {
    // 组件章节讲解
    console.log(this, 'activated')
  },
  deactivated() {
    console.log(this, 'deacticated')
  },
  beforeDestroy() {
    console.log(this, 'beforeDestroy')
  },
  destroyed() {
    console.log(this, 'destroyed')
  },
  render(h) {
    throw new TypeError('render error')
  },
  renderError(h, err) {
    // 只在开发期间生效，只有本组件的render出错时才会调用此方法
    return h('div', {}, err.stack)
  },
  errorCaptured() {
    // 会向上冒泡，可以在线上环境收集错误信息，可以收集子组件错误
  }
})
