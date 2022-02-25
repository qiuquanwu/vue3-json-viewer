import JsonViewer from './Components/json-viewer.vue'
export {
    JsonViewer
}
const install=(app)=>{
    app.component(JsonViewer.name,JsonViewer )
}

export default {
    install,
}
