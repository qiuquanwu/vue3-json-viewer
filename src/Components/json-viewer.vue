<template>
  <div :class="jvClass">
    <div v-if="copyable" :class="`jv-tooltip ${copyText.align || 'right'}`">
      <span ref="clip" class="jv-button" :class="{ copied }">
        <slot name="copy" :copied="copied">
          {{ copied ? copyText.copiedText : copyText.copyText }}
        </slot>
      </span>
    </div>
    <div class="jv-code" :class="{ open: expandCode, boxed }">
      <json-box ref="jsonBox" :value="parseValue" :sort="sort" :preview-mode="previewMode" />
    </div>
    <div v-if="expandableCode && boxed" class="jv-more" @click="toggleExpandCode">
      <span class="jv-toggle" :class="{ open: !!expandCode }" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch, onMounted, nextTick, provide } from 'vue';
import JsonBox from "./json-box.vue";
import ClipboardJS from "clipboard"; // Renamed to avoid conflict with variable name
import { debounce } from "./utils";

interface CopyableOptions {
  copyText?: string;
  copiedText?: string;
  timeout?: number;
  align?: 'left' | 'right';
}

// Define the type for the $refs.jsonBox
interface JsonBoxComponent extends InstanceType<typeof JsonBox> {
  $el: HTMLElement;
}
// Define the type for the $refs.clip
interface ClipElement extends HTMLElement {}

/**
 * Props for the JsonViewer component.
 */
export interface JsonViewerProps {
  /** The JSON object or array to display. Can also be a string, number, boolean, or function. */
  value: any;
  /** Whether the JSON tree should be initially expanded. */
  expanded?: boolean;
  /** The initial depth to expand the JSON tree. */
  expandDepth?: number;
  /**
   * Enables copying the JSON data.
   * Can be a boolean or an object with `CopyableOptions`.
   */
  copyable?: boolean | CopyableOptions;
  /** Whether to sort object keys alphabetically. */
  sort?: boolean;
  /** Whether to display the viewer in a boxed mode with a border. */
  boxed?: boolean;
  /** The theme for the viewer, e.g., 'light' or 'dark'. */
  theme?: string;
  /** A function to format date values. */
  timeformat?: (value: Date) => string;
  /** Whether to enable preview mode, which might show a condensed view. */
  previewMode?: boolean;
  /** Whether to attempt parsing the `value` prop if it's a string. */
  parse?: boolean;
}

/**
 * JsonViewer is a Vue component for displaying JSON data in a collapsible tree structure.
 * It supports various data types, copying to clipboard, themes, and custom styling.
 */
export default defineComponent({
  name: "JsonViewer",
  components: {
    JsonBox,
  },
  props: {
    value: {
      type: [Object, Array, String, Number, Boolean, Function] as PropType<JsonViewerProps['value']>,
      required: true,
    },
    expanded: {
      type: Boolean as PropType<JsonViewerProps['expanded']>,
      default: false,
    },
    expandDepth: {
      type: Number as PropType<JsonViewerProps['expandDepth']>,
      default: 1,
    },
    copyable: {
      type: [Boolean, Object] as PropType<JsonViewerProps['copyable']>,
      default: false,
    },
    sort: {
      type: Boolean as PropType<JsonViewerProps['sort']>,
      default: false,
    },
    boxed: {
      type: Boolean as PropType<JsonViewerProps['boxed']>,
      default: false,
    },
    theme: {
      type: String as PropType<JsonViewerProps['theme']>,
      default: "light",
    },
    timeformat: {
      type: Function as PropType<JsonViewerProps['timeformat']>,
      default: (value: Date) => value.toLocaleString(),
    },
    previewMode: {
      type: Boolean as PropType<JsonViewerProps['previewMode']>,
      default: false,
    },
    parse: {
      type: Boolean as PropType<JsonViewerProps['parse']>,
      default: false,
    }
  },
  emits: ["onKeyClick", "copied"],
  /**
   * Setup function for the JsonViewer component.
   * @param props - The component's props.
   * @param context - The setup context, including `emit`.
   */
  setup(props: JsonViewerProps, { emit }) {
    /** Indicates whether the JSON has been copied to the clipboard. */
    const copied = ref(false);
    /** Whether the code block can be expanded (e.g., if content is taller than max height). */
    const expandableCode = ref(false);
    /** Current expansion state of the code block. */
    const expandCode = ref(props.expanded);

    // Template refs
    const clip = ref<ClipElement | null>(null);
    const jsonBox = ref<JsonBoxComponent | null>(null);

    // Provide shared configuration to child components.
    provide("expandDepth", props.expandDepth);
    provide("timeformat", props.timeformat);
    /**
     * Handles clicks on object keys.
     * @param keyName - The name of the key that was clicked.
     */
    provide("keyClick", (keyName: string) => {
      emit("onKeyClick", keyName);
    });

    /** Computed CSS class for the main container. */
    const jvClass = computed(() => {
      return "jv-container " + "jv-" + props.theme + (props.boxed ? " boxed" : "");
    });

    /** Computed options for the copy functionality. */
    const copyText = computed(() => {
      if (typeof props.copyable === 'boolean' && !props.copyable) {
        // Default values if copyable is false, though this block might not be strictly necessary
        // if the copy button is hidden when copyable is false.
        return { copyText: "copy", copiedText: "copied!", timeout: 2000, align: 'right' as 'left' | 'right' };
      }
      const options = props.copyable as CopyableOptions; // Type assertion for when copyable is an object
      return {
        copyText: options.copyText || "copy",
        copiedText: options.copiedText || "copied!",
        timeout: options.timeout || 2000,
        align: options.align || ('right' as 'left' | 'right'),
      };
    });

    /**
     * Computed value after attempting to parse `props.value` if it's a string and `props.parse` is true.
     * Returns the original value if parsing is not enabled or fails.
     */
    const parseValue = computed(() => {
      if (!props.parse || typeof props.value !== 'string') {
        return props.value;
      }
      try {
        return JSON.parse(props.value);
      } catch (e) {
        // console.error("Failed to parse JSON string:", e); // Optional: log error
        return props.value; // Return original string if parsing fails
      }
    });

    /**
     * Handler for resize events, triggering a debounced resize calculation.
     */
    const onResized = () => {
      debouncedResized();
    };

    /**
     * Performs calculations upon resize to determine if the code block is expandable.
     * This is typically called after the content has been rendered or updated.
     */
    const debResized = () => {
      nextTick(() => {
        if (!jsonBox.value) return;
        // Check if the rendered height of jsonBox content exceeds a threshold (e.g., 250px)
        if (jsonBox.value.$el.clientHeight >= 250) {
          expandableCode.value = true;
        } else {
          expandableCode.value = false;
        }
      });
    };
    /** Debounced version of `debResized` to limit frequency of calculations. */
    const debouncedResized = debounce(debResized, 200);

    /**
     * Handles the success event from ClipboardJS.
     * Sets `copied` state to true and resets it after a timeout.
     * @param copyEvent - The event object from ClipboardJS.
     */
    const onCopied = (copyEvent: ClipboardJS.Event) => {
      if (copied.value) {
        return;
      }
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, copyText.value.timeout);
      emit("copied", copyEvent);
    };

    /**
     * Toggles the expansion state of the main code block.
     */
    const toggleExpandCode = () => {
      expandCode.value = !expandCode.value;
    };

    // Watch for changes in the input value to trigger resize checks.
    watch(() => props.value, () => {
      onResized();
    });

    // Initialize ClipboardJS and event listeners on component mount.
    onMounted(() => {
      if (props.boxed && jsonBox.value) {
        onResized();
        // Listen for custom 'resized' events that might be dispatched by child components (e.g., JsonBox itself).
        (jsonBox.value.$el as HTMLElement).addEventListener("resized", onResized, true);
      }
      if (props.copyable && clip.value) {
        const clipboardInstance = new ClipboardJS(clip.value, {
          text: () => JSON.stringify(parseValue.value, null, 2), // Use parseValue for copying
        });
        clipboardInstance.on("success", onCopied);
        // TODO: Consider adding clipboardInstance.destroy() in onBeforeUnmount
      }
    });

    // Expose reactive states and methods to the template.
    return {
      clip,
      jsonBox,
      copied,
      expandableCode,
      expandCode,
      jvClass,
      copyText,
      parseValue,
      toggleExpandCode,
      // Methods are already bound or don't need explicit exposure if not used in template
      // onResized, // only called internally
      // debResized, // only called internally
      // onCopied, // only called internally
    };
  },
});
</script>

<style>
.jv-container {
  box-sizing: border-box;
  position: relative;
}

.jv-container.boxed {
  border: 1px solid #eee;
  border-radius: 6px;
}

.jv-container.boxed:hover {
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.15);
  border-color: transparent;
  position: relative;
}

.jv-container.jv-light {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;
}

.jv-container.jv-dark {
  background: #282c34;
  white-space: nowrap;
  color: #fff;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;
}

.jv-container.jv-light .jv-ellipsis {
  color: #999;
  background-color: #eee;
  display: inline-block;
  line-height: 0.9;
  font-size: 0.9em;
  padding: 0px 4px 2px 4px;
  margin: 0 4px;
  border-radius: 3px;
  vertical-align: 2px;
  cursor: pointer;
  user-select: none;
}

.jv-container.jv-dark .jv-ellipsis {
  color: #f8f8f8;
  background-color: #2c3e50;
  display: inline-block;
  line-height: 0.9;
  font-size: 0.9em;
  padding: 0px 4px 2px 4px;
  margin: 0 4px;
  border-radius: 3px;
  vertical-align: 2px;
  cursor: pointer;
  user-select: none;
}

.jv-container.jv-light .jv-button {
  color: #49b3ff;
}

.jv-container.jv-dark .jv-button {
  color: #49b3ff;
}

.jv-container.jv-light .jv-key {
  color: #111111;
  margin-right: 4px;
}

.jv-container.jv-dark .jv-key {
  color: #fff;
  margin-right: 4px;
}

/**dark */
.jv-container.jv-dark .jv-item.jv-array {
  color: #111111;
}

.jv-container.jv-dark .jv-item.jv-array {
  color: #fff;
}

.jv-container.jv-dark .jv-item.jv-boolean {
  color: #fc1e70;
}

.jv-container.jv-dark .jv-item.jv-function {
  color: #067bca;
}

.jv-container.jv-dark .jv-item.jv-number {
  color: #fc1e70;
}

.jv-container.jv-dark .jv-item.jv-object {
  color: #fff;
}

.jv-container.jv-dark .jv-item.jv-undefined {
  color: #e08331;
}

.jv-container.jv-dark .jv-item.jv-string {
  color: #42b983;
  word-break: break-word;
  white-space: normal;
}

.jv-container.jv-dark .jv-item.jv-string .jv-link {
  color: #0366d6;
}

.jv-container.jv-dark .jv-code .jv-toggle:before {
  padding: 0px 2px;
  border-radius: 2px;
}

.jv-container.jv-dark .jv-code .jv-toggle:hover:before {
  background: #eee;
}

/**light */
.jv-container.jv-light .jv-item.jv-array {
  color: #111111;
}

.jv-container.jv-light .jv-item.jv-boolean {
  color: #fc1e70;
}

.jv-container.jv-light .jv-item.jv-function {
  color: #067bca;
}

.jv-container.jv-light .jv-item.jv-number {
  color: #fc1e70;
}

.jv-container.jv-light .jv-item.jv-object {
  color: #111111;
}

.jv-container.jv-light .jv-item.jv-undefined {
  color: #e08331;
}

.jv-container.jv-light .jv-item.jv-string {
  color: #42b983;
  word-break: break-word;
  white-space: normal;
}

.jv-container.jv-light .jv-item.jv-string .jv-link {
  color: #0366d6;
}

.jv-container.jv-light .jv-code .jv-toggle:before {
  padding: 0px 2px;
  border-radius: 2px;
}

.jv-container.jv-light .jv-code .jv-toggle:hover:before {
  background: #eee;
}

.jv-container .jv-code {
  overflow: hidden;
  padding: 30px 20px;
}

.jv-container .jv-code.boxed {
  max-height: 300px;
}

.jv-container .jv-code.open {
  max-height: initial !important;
  overflow: visible;
  overflow-x: auto;
  padding-bottom: 45px;
}

.jv-container .jv-toggle {
  background-image: url(./icon.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  cursor: pointer;
  width: 10px;
  height: 10px;
  margin-right: 2px;
  display: inline-block;
  transition: transform 0.1s;
}

.jv-container .jv-toggle.open {
  transform: rotate(90deg);
}

.jv-container .jv-more {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  width: 100%;
  text-align: center;
  cursor: pointer;
}

.jv-container .jv-more .jv-toggle {
  position: relative;
  top: 40%;
  z-index: 2;
  color: #888;
  transition: all 0.1s;
  transform: rotate(90deg);
}

.jv-container .jv-more .jv-toggle.open {
  transform: rotate(-90deg);
}

.jv-container .jv-more:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 20%,
      rgba(230, 230, 230, 0.3) 100%);
  transition: all 0.1s;
}

.jv-container .jv-more:hover .jv-toggle {
  top: 50%;
  color: #111;
}

.jv-container .jv-more:hover:after {
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 20%,
      rgba(230, 230, 230, 0.3) 100%);
}

.jv-container .jv-button {
  position: relative;
  cursor: pointer;
  display: inline-block;
  padding: 5px;
  z-index: 5;
}

.jv-container .jv-button.copied {
  opacity: 0.4;
  cursor: default;
}

.jv-container .jv-tooltip {
  position: absolute;
}

.jv-container .jv-tooltip.right {
  right: 15px;
}

.jv-container .jv-tooltip.left {
  left: 15px;
}

.jv-container .j-icon {
  font-size: 12px;
}

.jv-node .jv-toggle.open+.jv-key+.jv-push>.jv-item.jv-object:last-of-type,
.jv-node .jv-toggle.open+.jv-key+.jv-push>.jv-item.jv-array:last-of-type {
  margin-left: 12px;
}

.jv-node .jv-toggle:not(.open)+.jv-key+.jv-push>.jv-item.jv-object:last-of-type,
.jv-node .jv-toggle:not(.open)+.jv-key+.jv-push>.jv-item.jv-array:last-of-type,
.jv-node .jv-toggle:not(.open)+.jv-key+.jv-push>.jv-node:last-of-type {
  margin-left: 0;
}
</style>
