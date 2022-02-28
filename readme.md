# vue3-json-viewer

[中文版](readme_cn.md)

Simple and easy-to-use json content display component suitable for `vue3` and `vite`.
When developing with `vue3`+`vite`, I found that I needed to use the display json data component, and found that `vue-json-viewer` can only be compatible with `vue2`, so it took an hour to rewrite the adaptation of `vue3`.
Original author: [github](https://github.com/chenfengjw163/vue-json-viewer)

## Install

Requires `clipboard`

```
$ npm install clipboard --save
```

Then install `vue3-json-viewer`

```
$ npm install vue3-json-viewer --save
```

## Usage

main.js

```js
import { createApp } from "vue";
import App from "./App.vue";
import JsonViewer from "vue3-json-viewer";
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";
const app = createApp(App);
app.use(JsonViewer);
app.mount("#app");
```

App.vue

``` html
<template>
<div class="box">
  <h2>light</h2>
 <JsonViewer :value="jsonData" copyable boxed sort theme="jv-light"/>
  <h2>dark</h2>
   <JsonViewer :value="jsonData" copyable boxed sort theme="jv-dark"/>
</div>
 
</template>

<script setup>
import {JsonViewer} from "vue3-json-viewer"

import "vue3-json-viewer/dist/index.css";
import { reactive, ref } from "vue";
let obj = {
  name: "qiu",//字符串
  age: 18,//数组
  isMan:false,//布尔值
  date:new Date(),
  fn:()=>{},
  arr:[1,2,5]
};
const jsonData = reactive(obj);
</script>

<style>
.box{
    margin-top: 1rem;
}
</style>

```

![](./img/demo.png)