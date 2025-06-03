<template>
  <span :class="['jv-item', 'jv-undefined']">
    {{ textValue }}
  </span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

/**
 * JsonUndefined component renders `null` or `undefined` JSON values.
 */
const props = defineProps({
  /**
   * The value to display. Expected to be `null` or `undefined`.
   * The `type` is set to `null` and `PropType` is used to allow `undefined` as well,
   * with a default of `undefined`.
   */
  jsonValue: {
    type: null as unknown as PropType<null | undefined>,
    default: undefined
  }
});

/**
 * Computed property that returns the string 'null' or 'undefined' based on `props.jsonValue`.
 */
const textValue = computed(() => (props.jsonValue === null ? 'null' : 'undefined'));
</script>
