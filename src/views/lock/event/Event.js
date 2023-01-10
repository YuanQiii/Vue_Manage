
import store from '@/store'

let eventList = []

export function addEvent(layerObj, layerObjControlled, eventName){


    layerObj.on('click', function (){
        layerObjControlled.visible(!layerObjControlled.visible())
    })

    eventList.push({
        Controller: layerObj,
        Controlled: layerObjControlled,
        eventName
    })

    store.commit('lock/addOp', {
        layer: layerObj,
        op: 'update',
        event: {
            op: 'add',
            eventName: 'click'
        }
    })

}
