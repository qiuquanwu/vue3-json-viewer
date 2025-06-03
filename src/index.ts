/**
 * @module vue3-json-viewer
 * @description This module exports the JsonViewer component and its associated types
 * for use in Vue 3 applications. It also provides an `install` function
 * for Vue plugin registration.
 */

import type { App } from 'vue'
import JsonViewer from './Components/json-viewer.vue'
import type { JsonViewerProps } from './Components/json-viewer.vue'

/**
 * The main JsonViewer Vue component.
 * @see JsonViewerProps for a detailed list of available props.
 * @example
 * ```vue
 * <template>
 *   <JsonViewer :value="jsonData" theme="jv-dark" />
 * </template>
 * <script setup>
 *   import { JsonViewer } from "vue3-json-viewer";
 *   import "vue3-json-viewer/dist/style.css"; // Or your own theme
 *
 *   const jsonData = { a: 1, b: { c: 2 } };
 * <\/script>
 * ```
 */
export { JsonViewer }

/**
 * Type definition for the props accepted by the {@link JsonViewer} component.
 */
export type { JsonViewerProps }

/**
 * Vue plugin install function.
 * @param {App} app - The Vue application instance.
 */
const install = (app: App) => {
  app.component(JsonViewer.name as string, JsonViewer)
}

/**
 * Default export for Vue plugin usage (e.g., `app.use(Vue3JsonViewer)`).
 */
export default {
  install,
}
