<script lang="ts">
import { defineComponent, h, ref, watch, onMounted, PropType, VNode, Component } from 'vue';
import JsonBox from '../json-box.vue';

/**
 * JsonArray component renders JSON arrays. It can be expanded or collapsed
 * and recursively renders its items using JsonBox.
 */
export default defineComponent({
  name: 'JsonArray',
  props: {
    /** The array value to render. */
    jsonValue: {
      type: Array as PropType<any[]>,
      required: true
    },
    /** The key name of this array if it's a property of an object. */
    keyName: {
      type: String,
      default: ''
    },
    /** Current nesting depth of this array. */
    depth: {
      type: Number,
      default: 0
    },
    /** Whether to sort array items (Note: arrays are typically not sorted by key). */
    sort: Boolean, // This prop might be less relevant for arrays vs objects
    /** Whether this array should be rendered in an expanded state. */
    expand: Boolean,
    /** Whether preview mode is enabled (potentially showing a condensed view). */
    previewMode: Boolean,
  },
  emits: ['update:expand'],
  /**
   * Setup function for the JsonArray component.
   * @param props - The component's props.
   * @param context - The setup context, including `emit`.
   */
  setup(props, { emit }) {
    /**
     * Internally managed list of items to render.
     * The `setValueRecursive` method populates this with a timeout,
     * potentially for incremental rendering of large arrays.
     */
    const internalValue = ref<any[]>([]);
    /** Reference to the root DOM element of this component for event dispatching. */
    let currentEl: HTMLElement | null = null;

    /**
     * Recursively populates `internalValue` from `props.jsonValue`.
     * Uses `setTimeout` to add items incrementally, which might improve
     * performance for very large arrays by not blocking the main thread.
     * @param vals - The array of values to process.
     * @param index - The current index in the `vals` array.
     */
    const setValueRecursive = (vals: any[], index = 0) => {
      if (index === 0) {
        internalValue.value = [];
      }
      // Simulates async loading or incremental rendering.
      setTimeout(() => {
        if (vals && vals.length > index) {
          internalValue.value.push(vals[index]);
          setValueRecursive(vals, index + 1);
        }
      }, 0);
    };

    // Watch for changes in the input `jsonValue` prop to update the internal representation.
    // `immediate: true` ensures it runs on component mount.
    // `deep: true` is important if `jsonValue` itself could be a reactive object/array where nested changes occur.
    watch(() => props.jsonValue, (newVal) => {
      setValueRecursive(newVal);
    }, { immediate: true, deep: true });

    /**
     * Toggles the expansion state of the array.
     * Emits an 'update:expand' event to notify the parent (typically JsonBox)
     * and dispatches a 'resized' event on its own DOM element.
     */
    const toggle = () => {
      emit('update:expand', !props.expand);
      if (currentEl) {
        try {
          currentEl.dispatchEvent(new Event('resized'));
        } catch (e) {
          // Fallback for older browsers (IE)
          const evt = document.createEvent('Event');
          evt.initEvent('resized', true, false);
          currentEl.dispatchEvent(evt);
        }
      }
    };
    
    /**
     * Render function for JsonArray.
     * @returns {VNode} The virtual node representing the component.
     */
    return () => {
      const elements: VNode[] = [];

      if (!props.previewMode && !props.keyName) {
        elements.push(h('span', {
          class: {
            'jv-toggle': true,
            'open': !!props.expand,
          },
          onClick: toggle
        }));
      }

      elements.push(h('span', {
        class: ['jv-item', 'jv-array'],
      }, '['));

      if (props.expand) {
        internalValue.value.forEach((itemValue, key) => {
          elements.push(h(JsonBox as Component, { // Cast JsonBox to Component
            key,
            // style: { display: props.expand ? undefined : 'none' }, // This style is redundant if items are not rendered
            sort: props.sort,
            depth: props.depth + 1,
            value: itemValue,
            previewMode: props.previewMode,
          }));
        });
      }

      if (!props.expand && internalValue.value.length > 0) {
        elements.push(h('span', {
          class: 'jv-ellipsis',
          onClick: toggle,
          title: `click to reveal ${internalValue.value.length} hidden items`,
        }, '...'));
      }

      elements.push(h('span', {
        class: ['jv-item', 'jv-array'],
      }, ']'));

      return h('span', { ref: el => { currentEl = el as HTMLElement } }, elements);
    };
  }
});
</script>
