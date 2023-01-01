import Konva from "konva";

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
}
