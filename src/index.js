import cButton from './Components/button/button.vue'
export {
    cButton
}
const install=(app)=>{
    app.component(cButton.name,cButton )
}

export default {
    install
}
