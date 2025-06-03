<template>
  <span :class="['jv-item', 'jv-regexp']">
    {{ jsonValue.toString() }}
  </span>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

/**
 * JsonRegexp component renders a JavaScript RegExp object as a string.
 */
defineProps({
  /** The RegExp object to display. */
  jsonValue: {
    type: RegExp as PropType<RegExp>,
    required: true
  }
});
</script>
