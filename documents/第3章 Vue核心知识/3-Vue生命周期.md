## 创建期间的生命周期函数

### beforeCreate

这是第一个生命周期函数，表示实例被完全创建之前会执行它，实例在内存中刚被创建出来，此时，还没初始化好`data`和`methods`属性。

### created

这是第二个生命周期函数，实例已经在内存中创建好了，此时的`data`和`methods`也已经创建好了，此时还没有开始编译模板。

### beforeMount

第三个生命周期函数，模板已经在内存中编辑完成，尚未把模板渲染到页面，服务端渲染时不会调用此方法。

### mounted

第四个生命周期函数，页面已经渲染完成，此时将已经编译好的模板，挂载到了页面指定的容器中显示。服务端渲染时不会调用此方法。

这是实例创建期间的最后一个生命周期函数，此时实例已经完全创建好了，保存在内存中。



## 运行期间的生命周期函数

### beforeUpdate

状态更新之前执行此函数，此时data中的状态值是最新的，但是界面上显示的数据还是旧的，因为此时还没有重新编译渲染DOM节点

### updated

实例更新完成之后调用此函数，此时`data`中的状态值和界面上显示的数据已经完成了更新，界面已经被重新渲染好了！



## 销毁期间的生命周期函数

### beforeDestroy

实例销毁之前调用。在这一步，实例仍然完全可用。

### destroyed

Vue实例销毁后调用，调用后，Vue实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

```javascript
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
```

### renderError

只在开发期间生效，只有本组件的render出错时才会调用此方法，自组件的错误不会被捕捉，不会向上冒泡

### errorCaptured

会向上冒泡，可以在线上环境收集错误信息，可以收集子组件错误