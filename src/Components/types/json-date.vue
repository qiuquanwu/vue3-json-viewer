<template>
  <span :class="['jv-item', 'jv-string']">
    "{{ formattedTime }}"
  </span>
</template>

<script lang="ts" setup>
import { inject, computed, PropType } from 'vue';

/**
 * Type definition for the time formatting function.
 * @param value - The Date object to format.
 * @returns A string representation of the formatted date.
 */
type TimeFormatFunction = (value: Date) => string;

/**
 * JsonDate component renders a JavaScript Date object as a formatted string.
 * It uses an injected `timeformat` function for custom formatting.
 */
const props = defineProps({
  /** The Date object to display. */
  jsonValue: {
    type: Date as PropType<Date>,
    required: true
  }
});

/**
 * Injected time formatting function from the parent JsonViewer.
 * Defaults to `toLocaleString` if not provided.
 * @see JsonViewerProps.timeformat
 */
const timeformat = inject<TimeFormatFunction>('timeformat', (value: Date) => value.toLocaleString());

/**
 * Computed property that returns the formatted date string.
 */
const formattedTime = computed(() => timeformat(props.jsonValue));
</script>
