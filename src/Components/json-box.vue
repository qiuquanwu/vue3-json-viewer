<script lang="ts">
import { defineComponent, h, ref, onMounted, inject, PropType, VNode, Component } from 'vue';
import JsonString from "./types/json-string.vue";
import JsonUndefined from "./types/json-undefined.vue";
import JsonNumber from "./types/json-number.vue";
import JsonBoolean from "./types/json-boolean.vue";
import JsonObject from "./types/json-object.vue";
import JsonArray from "./types/json-array.vue";
import JsonFunction from "./types/json-function.vue";
import JsonDate from "./types/json-date.vue";
import JsonRegexp from "./types/json-regexp.vue";

// Define a more specific type for the injected 'keyClick'
type KeyClickFunction = (keyName: string) => void;

/**
 * JsonBox is a recursive component used by JsonViewer to render individual
 * JSON properties (key-value pairs) or array items. It determines the data type
 * of the value and delegates rendering to a type-specific component.
 */
export default defineComponent({
  name: "JsonBox",
  props: {
    /** The JSON value to render. Can be any valid JSON type. */
    value: {
      type: [Object, Array, String, Number, Boolean, Function, Date] as PropType<any>,
      default: null,
    },
    /** The key name for this value, if it's part of an object. */
    keyName: {
      type: String,
      default: "",
    },
    /** Whether to sort object keys alphabetically. Passed down from JsonViewer. */
    sort: Boolean,
    /** Current nesting depth of this component. */
    depth: {
      type: Number,
      default: 0,
    },
    /** Whether preview mode is enabled. Passed down from JsonViewer. */
    previewMode: Boolean,
  },
  /**
   * Setup function for the JsonBox component.
   * @param props - The component's props.
   */
  setup(props) {
    /** Injected from JsonViewer: The maximum depth to auto-expand. */
    const expandDepth = inject<number>("expandDepth", Infinity);
    /** Injected from JsonViewer: Function to call when a key is clicked. */
    const keyClick = inject<KeyClickFunction>("keyClick", () => { });

    /** Reactive state for whether this node is expanded. */
    const expand = ref(true);
    /** Holds the reference to the root DOM element of this component instance for event dispatching. */
    let currentEl: HTMLElement | null = null;

    onMounted(() => {
      // Determine initial expansion state based on preview mode and depth.
      expand.value = props.previewMode || (props.depth < expandDepth); // Corrected logic: expand if depth < expandDepth
    });

    /**
     * Toggles the expanded state of the current JSON node (object or array).
     * Also dispatches a 'resized' event to notify parent components (like JsonViewer)
     * that content size might have changed, useful for recalculating layout or visibility.
     */
    const toggle = () => {
      expand.value = !expand.value;
      if (currentEl) {
        try {
          currentEl.dispatchEvent(new Event("resized"));
        } catch (e) {
          // Fallback for older browsers (IE) that don't support new Event()
          const evt = document.createEvent("Event");
          evt.initEvent("resized", true, false);
          currentEl.dispatchEvent(evt);
        }
      }
    };

    /**
     * The render function for JsonBox.
     * It dynamically selects a component to render the value based on its type.
     * @returns {VNode} The virtual node representing the component.
     */
    return () => {
      const elements: VNode[] = [];
      let dataTypeComponent: Component;

      // Determine the component to use based on the data type of `props.value`.
      if (props.value === null || props.value === undefined) {
        dataTypeComponent = JsonUndefined;
      } else if (Array.isArray(props.value)) {
        dataTypeComponent = JsonArray;
      } else if (props.value instanceof Date) { // More direct Date check
        dataTypeComponent = JsonDate;
      } else if (props.value instanceof RegExp) {
        dataTypeComponent = JsonRegexp;
      } else if (typeof props.value === "object") {
        dataTypeComponent = JsonObject;
      } else if (typeof props.value === "number") {
        dataTypeComponent = JsonNumber;
      } else if (typeof props.value === "string") {
        dataTypeComponent = JsonString;
      } else if (typeof props.value === "boolean") {
        dataTypeComponent = JsonBoolean;
      } else if (typeof props.value === "function") {
        dataTypeComponent = JsonFunction;
      } else {
        // Fallback for any other unknown types.
        dataTypeComponent = JsonString; // Default to string representation
      }

      // Determine if the current node is a complex type (array or object) that can be toggled.
      // Date and RegExp are not considered complex for toggle purposes here.
      const isComplex =
        props.value &&
        (Array.isArray(props.value) ||
          (typeof props.value === "object" &&
            !(props.value instanceof Date) && // Exclude Date
            !(props.value instanceof RegExp)   // Exclude RegExp
          ));

      // Add toggle button for complex types if not in preview mode.
      if (!props.previewMode && isComplex) {
        elements.push(
          h("span", {
            class: {
              "jv-toggle": true,
              open: !!expand.value, // Double negation to ensure boolean
            },
            onClick: toggle,
          })
        );
      }

      // Add key name if provided.
      if (props.keyName) {
        elements.push(
          h("span", {
            class: "jv-key", // 'jv-key' is a string, not an object
            onClick: () => {
              if (keyClick) { // Ensure keyClick is provided
                keyClick(props.keyName); // props.keyName is already a string
              }
            },
          }, `${props.keyName}:`) // Text content as children
        );
      }

      // Add the type-specific component for rendering the value.
      elements.push(
        h(dataTypeComponent, {
          class: "jv-push", // 'jv-push' is a string
          jsonValue: props.value,
          keyName: props.keyName, // Pass keyName for context if needed by child
          sort: props.sort,     // Pass sort for objects/arrays
          depth: props.depth,   // Pass current depth
          expand: expand.value, // Pass current expand state
          previewMode: props.previewMode,
          // Listen for 'update:expand' events from child components (e.g., JsonArray, JsonObject)
          // This allows children to request a change in their own expansion state.
          "onUpdate:expand": (newExpandState: boolean) => {
            expand.value = newExpandState;
          },
        })
      );

      // Create the root VNode for this JsonBox instance.
      // The `ref` callback assigns the DOM element to `currentEl` for event dispatching.
      return h(
        "div",
        {
          class: {
            "jv-node": true,
            "jv-key-node": Boolean(props.keyName) && !isComplex, // Apply if keyName exists and not a complex type
            toggle: !props.previewMode && isComplex, // Apply if not preview and is complex for styling indent
          },
          ref: (el) => { currentEl = el as HTMLElement; }
        },
        elements
      );
    };
  },
});
</script>

<style>
.jv-node {
  position: relative;
}

.jv-node:after {
  content: ",";
}

.jv-node:last-of-type:after {
  content: "";
}

.jv-node.toggle {
  margin-left: 13px !important;
}

.jv-node .jv-node {
  margin-left: 25px;
}
</style>
