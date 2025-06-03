<template>
  <span :class="['jv-item', 'jv-number', isInteger ? 'jv-number-integer' : 'jv-number-float']">
    {{ jsonValue.toString() }}
  </span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

/**
 * JsonNumber component renders a JSON number value.
 * It distinguishes between integers and floating-point numbers for styling.
 */
const props = defineProps({
  /** The number value to display. */
  jsonValue: {
    type: Number as PropType<number>,
    required: true
  }
});

/**
 * Computed property that checks if the `jsonValue` is an integer.
 * Used for applying specific CSS classes.
 */
const isInteger = computed(() => Number.isInteger(props.jsonValue));
</script>
