import type{ Component } from "vue";
declare interface JsonViewerProps {
    value:Object|Array<any>|string| number|boolean,
    expanded: boolean,
    expandDepth:number,
    copyable:boolean|object,
    sort:boolean,
    boxed:boolean,
    theme:string,
    previewMode:boolean,
    timeformat:(value:any)=>string
}
declare var JsonViewer: Component<JsonViewerProps>