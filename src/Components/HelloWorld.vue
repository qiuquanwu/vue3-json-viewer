<template>
  <!-- script-setup内引入使用，不需注册-->
  <Button type="primary"> Primary</Button>
  <!-- 在mian.js使用use注册组件 -->
  <a-input placeholder="Basic usage" />
</template>
<script setup>
import { Button } from "ant-design-vue";
</script>
