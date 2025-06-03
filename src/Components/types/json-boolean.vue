<template>
  <span :class="['jv-item', 'jv-boolean']">
    {{ jsonValue.toString() }}
  </span>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

/**
 * JsonBoolean component renders a boolean JSON value.
 */
defineProps({
  /** The boolean value to display. */
  jsonValue: {
    type: Boolean as PropType<boolean>,
    required: true
  }
});
</script>
