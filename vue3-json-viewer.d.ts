
declare module 'vue3-json-viewer' {
    import { App, Component } from 'vue'
    interface JsonViewerProps {
        value: Object | Array<any> | string | number | boolean,
        expanded: boolean,
        expandDepth: number,
        copyable: boolean | object,
        sort: boolean,
        boxed: boolean,
        theme: string,
        previewMode: boolean,
        timeformat: (value: any) => string
    }
    const JsonViewer: Component<JsonViewerProps>
    export { JsonViewer }
    const def: { install: (app: App) => void }
    export default def
}
