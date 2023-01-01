import moneyFormat from "./moneyFormat"
import formatDate from "./formatDate"

const filter = {
    moneyFormat,
    formatDate
}

export default {
    install(Vue){
        Object.keys(filter).forEach(key=>{
            Vue.filter(key,filter[key])
        })
    }
}
