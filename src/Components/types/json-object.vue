<script lang="ts">
import { defineComponent, h, ref, watch, computed, PropType, VNode, Component } from 'vue';
import JsonBox from '../json-box.vue';

/**
 * JsonObject component renders JSON objects. It can be expanded or collapsed,
 * sort its keys, and recursively renders its properties using JsonBox.
 */
export default defineComponent({
  name: 'JsonObject',
  props: {
    /** The object value to render. */
    jsonValue: {
      type: Object as PropType<Record<string, any>>,
      required: true
    },
    /** The key name of this object if it's a property of another object. */
    keyName: {
      type: String,
      default: ''
    },
    /** Current nesting depth of this object. */
    depth: {
      type: Number,
      default: 0
    },
    /** Whether this object should be rendered in an expanded state. */
    expand: Boolean,
    /** Whether to sort the keys of this object alphabetically. */
    sort: Boolean,
    /** Whether preview mode is enabled. */
    previewMode: Boolean,
  },
  emits: ['update:expand'],
  /**
   * Setup function for the JsonObject component.
   * @param props - The component's props.
   * @param context - The setup context, including `emit`.
   */
  setup(props, { emit }) {
    /**
     * Internally managed representation of the object to render.
     * Populated asynchronously by `setValue`.
     */
    const internalValue = ref<Record<string, any>>({});
    /** Reference to the root DOM element of this component for event dispatching. */
    let currentEl: HTMLElement | null = null;

    /**
     * Sets the `internalValue` asynchronously. This might be for performance reasons,
     * similar to the `setValueRecursive` in JsonArray.
     * @param val - The object value to set.
     */
    const setValue = (val: Record<string, any>) => {
      setTimeout(() => {
        internalValue.value = val;
      }, 0);
    };

    // Watch for changes in the input `jsonValue` prop to update `internalValue`.
    watch(() => props.jsonValue, (newVal) => {
      setValue(newVal);
    }, { immediate: true, deep: true });

    /**
     * Computed property that returns the object keys in sorted order if `props.sort` is true,
     * otherwise returns the keys in their original order (from `internalValue`).
     */
    const ordered = computed(() => {
      if (!props.sort) {
        return internalValue.value;
      }
      const sortedKeys = Object.keys(internalValue.value).sort();
      const result: Record<string, any> = {};
      sortedKeys.forEach(key => {
        result[key] = internalValue.value[key];
      });
      return result;
    });

    /**
     * Dispatches a 'resized' event from the component's root element.
     * This is used to notify parent components that the content size may have changed.
     */
    const dispatchEvent = () => {
      if (currentEl) {
        try {
          currentEl.dispatchEvent(new Event('resized'));
        } catch (e) {
          // Fallback for older browsers
          const evt = document.createEvent('Event');
          evt.initEvent('resized', true, false);
          currentEl.dispatchEvent(evt);
        }
      }
    };

    /**
     * Toggles the expansion state of the object.
     * Emits 'update:expand' and dispatches a 'resized' event.
     */
    const toggle = () => {
      emit('update:expand', !props.expand);
      dispatchEvent();
    };

    /**
     * Render function for JsonObject.
     * @returns {VNode} The virtual node representing the component.
     */
    return () => {
      const elements: VNode[] = [];
      // Add toggle button if not in preview mode and not a top-level unnamed object.
      if (!props.previewMode && !props.keyName) {
        elements.push(h('span', {
          class: { 'jv-toggle': true, 'open': !!props.expand }, // `!!` ensures boolean
          onClick: toggle
        }));
      }

      elements.push(h('span', { class: ['jv-item', 'jv-object'] }, '{'));

      if (props.expand) {
        for (const key in ordered.value) {
          if (ordered.value.hasOwnProperty(key)) {
            const itemValue = ordered.value[key];
            elements.push(h(JsonBox as Component, {
              key,
              // style: { display: !props.expand ? 'none' : undefined }, // Redundant
              sort: props.sort,
              keyName: key,
              depth: props.depth + 1,
              value: itemValue,
              previewMode: props.previewMode,
            }));
          }
        }
      }

      if (!props.expand && Object.keys(internalValue.value).length > 0) {
        elements.push(h('span', {
          // style: { display: props.expand ? 'none' : undefined }, // Redundant
          class: 'jv-ellipsis',
          onClick: toggle,
          title: `click to reveal object content (keys: ${Object.keys(ordered.value).join(', ')})`,
        }, '...'));
      }

      elements.push(h('span', { class: ['jv-item', 'jv-object'] }, '}'));

      return h('span', { ref: el => { currentEl = el as HTMLElement } }, elements);
    };
  }
});
</script>
