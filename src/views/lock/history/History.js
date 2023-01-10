// import _ from 'lodash'
// import store from "@/store";
//
// let history = []
// let currentIndex = 0
//
// export function recordData(data){
//     history.push(_.cloneDeep(data))
//     currentIndex++
// }
//
// export function undo(){
//     currentIndex--
//     store.commit('lock/updateState', _.cloneDeep(history[currentIndex]))
// }