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
import "vue3-json-viewer/dist/index.css";
const app = createApp(App);
app.use(JsonViewer);
app.mount("#app");
```

App.vue

``` html
<template>
  <json-viewer :value="jsonData" copyable boxed sort />
</template>

<script setup>
import { reactive, ref } from "vue";
let obj = {
  name: "qiu",
  age: 18,
  isMan: false,
  date: new Date(),
  fn: () => {},
  arr: [1, 2, 5]
};
const jsonData = reactive(obj);
</script>
```

![](./img/demo.png)