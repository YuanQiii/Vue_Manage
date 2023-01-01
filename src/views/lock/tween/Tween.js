import Konva from "konva";
import store from '@/store'

let tweenList = []
let tweenArgsList = []
let scaleRate = 3

export {
    tweenList
}
export function addTween(tweenArgs){
    let index = tweenArgsList.findIndex(ele => {
        return ele.layerObj === tweenArgs.layerObj
    })

    if(index === -1){
        console.log('添加动画')

        store.commit('lock/addOp', {
            layer: tweenArgs.layerObj,
            op: 'update',
            tween: {
                op: 'add'
            }
        })

        tweenArgsList.push(tweenArgs)
        tweenList.push(createAni(tweenArgs))


    }else{
        console.log('更新动画')

        store.commit('lock/addOp', {
            layer: tweenArgs.layerObj,
            op: 'update',
            tween: {
                op: 'update',
                tweenArgs: _.cloneDeep(tweenArgsList[index])
            }
        })

        tweenArgsList[index] = tweenArgs
        tweenList[index] = createAni(tweenArgs)

    }
    console.log(tweenList)
}

export function delTween(layerObj){
    let index = tweenArgsList.findIndex(ele => {
        return ele.layerObj === layerObj
    })

    tweenArgsList.splice(index, 1)
    tweenList.splice(index, 1)
}

export function updatePlayTween(layerObj, op){
    tweenList.forEach(ele => {
        if(ele.layerObj === layerObj){
            if(op === 'play'){
                ele.playAni()
            }
            if(op === 'stop'){
                ele.stopAni()
            }
        }
    })
}

export function updateAllPlayTween(type){
    tweenList.forEach(ele => {
        if(type === 'play'){
            if(ele !== null){
                ele.playAni()
            }
        }else{
            if(ele !== null){
                ele.stopAni()
            }
        }
    })
}

function createAni({layerObj, positionKeyframe, positionRepeat, positionDelay}){

    let tween = null
    let originX = layerObj.x()
    let originY = layerObj.y()

    function playAni(){

        // 设置起点
        layerObj.x(originX)
        layerObj.y(originY)

        // 初始化
        let lastTime = 0

        setTimeout(() => {
            let fn = index => {
                if(index < positionKeyframe.length){
                    let obj = positionKeyframe[index]
                    tween = new Konva.Tween({
                        node: layerObj,
                        duration: (obj.time - lastTime) / 1000,
                        x: obj.x / scaleRate,
                        y: obj.y / scaleRate,
                        onFinish(){
                            lastTime = obj.time
                            fn(index+1)
                        }
                    });
                    layerObj.draggable(false)
                    tween.play()
                }else{
                    // 重复
                    if(positionRepeat === 0){
                        playAni(0)
                    }
                }
            }
            fn(0)

        }, positionDelay)
    }

    function stopAni(){
        if(tween !== null){
            tween.reset()
            tween = null
            layerObj.x(originX)
            layerObj.y(originY)
            layerObj.draggable(true)
        }
    }

    return {
        layerObj,
        playAni,
        stopAni
    }
}




