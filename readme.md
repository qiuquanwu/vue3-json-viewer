# vue3-json-viewer
简单易用的json内容展示组件,适配vue3和vite。
在使用vue3+vite开发时，发现需要用到vue显示json数据，发现vue-json-viewer只能兼容vue2，于是花了一个小时，重写的vue3的适配。
原作者：[github](https://github.com/chenfengjw163/vue-json-viewer)
 ## Installing
需要依赖clipboard，先安装clipboard
```
$ npm install clipboard --save
```
再安装vue3-json-viewer
```
$ npm install vue3-json-viewer --save
```

## Example
mian.js
```js
import { createApp } from 'vue'
import App from './App.vue'
import JsonViewer from "vue3-json-viewer"
const app=createApp(App)
app.use(JsonViewer)
app.mount('#app')

```
App.vue
``` html
<template>
  <json-viewer :value="jsonData" copyable boxed sort />
</template>

<script setup>
import { reactive, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
let obj = {
  name: "qiu",//字符串
  age: 18,//数组
  isMan:false,//布尔值
  date:new Date(),
  fn:()=>{},
  arr:[1,2,5]
};
const jsonData = reactive(obj);
const strData = ref("http://www.baidu.com");
</script>

<style></style>

```

![](./img/demo.png)