## VUE实例的创建和作用

1. 在practice文件夹下创建一个文件夹 instance文件夹，并在文件夹下创建 index.js 文件
2. 在`practice/index.js`文件中引入新创建的`index.js`，创建对象，然后挂在到页面中

```javascript
import Vue from 'vue'

const app = new Vue({
  template: '<div>{{text}}</div>',
  data: {
    text: 'text'
  }
})
// 挂载到页面节点上
app.$mount('#root')

// 创建对象挂载页面的好处是可以在对象外修改属性的内容
app.text = 'text1'
```

## VUE实例的属性

+ `app.$data`：创建Vue对象时，传进去的 data 内容
+ `app.$props`：
+ `app.$el`：html 节点的引用，节点的内容，上面 template 的内容
+ `app.$options`：创建Vue对象时，整个对象的内容。**并非对象的引用，在通过 $options 修改实例内容时，对原实例不生效**，`app.$data`和`app.$options.data`不一样。
+ `app.$options.render`

```javascript
// 给 $options.render重新赋值，页面在重新渲染时会生效。
import Vue from 'vue'

const app = new Vue({
  template: '<div>{{text}}</div>',
  data: {
    text: 'text'
  }
})
// 挂载到页面节点上
app.$mount('#root')
setInterval(() => {
  app.text += 1
},1000)

// 当页面重新渲染时，内容会替换为 new render function
app.$options.render = (h) =>{
  return h('div', {}, 'new render function')
}
```

+ `app.$root`：Vue对象，相当于上面代码中的 app 。
+ `app.$children`：组件中的标签内容。`<item><div></div></item>`，相当于 item 组件中的 div 标签。
+ `app.$slots`：Vue的插槽
+ `app.$scopedSlots`：Vue的插槽
+ `app.$refs`：快速定位到某一个节点，`<div ref="div">{{text}}</div>`，返回节点的内容或者组件的实例。
+ `app.$isServer`：加入服务端渲染，判断是否在服务端渲染

## VUE实例的方法

+ `app.$watch()`：相当于实例中的 watch 监听方法，当某一个值有变化的时候，进行某一种操作。

```javascript
const unWatch = app.$watch('text',(newText, oldText) => {
  console.log(`${newText} : ${oldText}`)
})

// 使用$watch时，需要自己手动注销掉该方法，在app实例中声明时，当app注销掉时，watch方法会自动注销掉。
unWatch()
```

+ `app.$on()`：事件监听，触发指定事件时进行一些操作

```javascript
app.$on('test', (a, b) => {
  console.log("触发了test事件")
})
// 触发事件的操作，两个作用于同一个vue对象上面，可以传输参数也可以不传参数
app.$emit('test', 1, 2)
```

+ `app.$once()`：事件监听，用法同`app.$on()`，但是**只触发一次**
+ `app.$forceUpdate()`：强制组件重新渲染一次

```javascript
// 声明一个对象，没有设置属性，后面直接添加属性时，并不会引起页面重新渲染
const app = new Vue({
  template: '<div>{{text}}{{obj.a}}</div>',
  data: {
    text: 0,
    obj:{} // 空的对象
  }
})

app.$mount('#root')

let i = 0
setInterval(() => {
  i++;
  app.obj.a = i //直接设置属性赋值操作，并不能引起页面的重新渲染
  app.$set(app.obj.'a',i) //使用set方法，给对象某个属性设置一个值，页面会重新渲染，对应的还有 $delete 方法
})
```

