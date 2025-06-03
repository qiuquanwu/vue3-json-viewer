<script lang="ts">
import { defineComponent, h, ref, onMounted, PropType, VNode } from 'vue';

/** Regular expression to detect URLs for automatic linking. */
const REG_LINK = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;

/**
 * JsonString component renders JSON string values.
 * It supports expanding/collapsing long strings and automatically creates hyperlinks for URLs.
 */
export default defineComponent({
  name: 'JsonString',
  props: {
    /** The string value to display. */
    jsonValue: {
      type: String as PropType<string>,
      required: true
    }
  },
  /**
   * Setup function for the JsonString component.
   * @param props - The component's props.
   */
  setup(props) {
    /** Reactive state for whether the string is expanded (if it's long). */
    const expand = ref(true);
    /** Reactive state indicating if the string content is long enough to be collapsible. */
    const canExtend = ref(false);

    /** Template ref for the main item span, used for height calculation. */
    const itemRef = ref<HTMLElement | null>(null);
    /** Template ref for a hidden holder span, used to compare height against `itemRef`. */
    const holderRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      // After component mounts, check if the rendered string is taller than its container.
      // If so, it means the string is long and can be collapsed.
      if (itemRef.value && holderRef.value) {
        if (itemRef.value.offsetHeight > holderRef.value.offsetHeight) {
          canExtend.value = true;
        }
      }
    });

    /**
     * Toggles the expanded state of the string.
     */
    const toggle = () => {
      expand.value = !expand.value;
    };

    /**
     * Render function for JsonString.
     * @returns {VNode} The virtual node representing the component.
     */
    return () => {
      const value = props.jsonValue;
      const isLink = REG_LINK.test(value);
      let domItemNode: VNode; // This will hold the VNode for the string value itself.

      // If the string is not expanded and it's long enough (canExtend is true), show ellipsis.
      if (!expand.value && canExtend.value) {
        domItemNode = h('span', {
          class: { 'jv-ellipsis': true },
          onClick: toggle,
        }, '...');
      } else {
        // If it's a link, render an anchor tag.
        if (isLink) {
          domItemNode = h('span', { class: { 'jv-item': true, 'jv-string': true }, ref: itemRef }, [
            h('span', null, '"'), // Opening quote
            h('a', { href: value, target: '_blank', class: 'jv-link' }, value),
            h('span', null, '"'), // Closing quote
          ]);
        } else {
          // Otherwise, render the string as text.
          domItemNode = h('span', {
            class: { 'jv-item': true, 'jv-string': true },
            ref: itemRef, // Assign ref for height calculation
          }, `"${value}"`); // Display string with quotes
        }
      }

      const children: VNode[] = []; // Array to hold all child VNodes for the root span.

      // If the string can be extended (is long), add a toggle button.
      if (canExtend.value) {
        children.push(h('span', {
          class: {
            'jv-toggle': true, // CSS class for the toggle button
            open: expand.value,  // Class to indicate open/closed state
          },
          onClick: toggle,
        }));
      }

      // Holder span (likely used for layout or height comparison, always rendered but might be empty/hidden).
      // Its ref `holderRef` is used in `onMounted` to compare against `itemRef`.
      children.push(h('span', { class: { 'jv-holder-node': true }, ref: holderRef }));

      // Add the actual string content VNode.
      children.push(domItemNode);

      // Return the root span containing all children.
      return h('span', {}, children);
    };
  }
});
</script>
