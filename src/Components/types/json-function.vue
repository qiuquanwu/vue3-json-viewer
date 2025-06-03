<template>
  <span :class="['jv-item', 'jv-function']" :title="jsonValue.toString()">
    &lt;function&gt;
  </span>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

/**
 * JsonFunction component renders a placeholder for JavaScript Function objects.
 * It displays "<function>" and shows the function's string representation in the title attribute.
 */
defineProps({
  /** The Function object to represent. */
  jsonValue: {
    type: Function as PropType<Function>,
    required: true
  }
});
</script>
