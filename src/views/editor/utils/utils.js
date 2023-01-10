import store from '@/store'
import Konva from "konva";

const scaleRate = 3
let animations = []

export function getImageObjById(id){

    let konvaImages = []

    store.state.editor.konvaStaticLayer.getChildren().forEach(ele => {
        konvaImages.push(ele)
    })
    store.state.editor.konvaDynamicLayer.getChildren().forEach(ele => {
        konvaImages.push(ele)
    })


    // let konvaImages = store.state.editor.konvaImages
    for (let konvaImage of konvaImages) {
        if(konvaImage.attrs.id === id){
            return konvaImage
        }
    }
}

export function getImageLayerById(id){

    let konvaStaticLayer = store.state.editor.konvaStaticLayer
    for (let child of konvaStaticLayer.getChildren()) {
        if(child.attrs.id === id) return konvaStaticLayer
    }

    let konvaDynamicLayer = store.state.editor.konvaDynamicLayer
    for (let child in konvaDynamicLayer.getChildren()) {
        if(child.attrs.id === id) return konvaDynamicLayer
    }
}

export function setTransformer(editObj){
    let layer = getImageLayerById(editObj.attrs.id)
    let tr = new Konva.Transformer()
    layer.add(tr)
    tr.nodes([editObj])
    layer.draw()
}

export function addAnimationArgs(animationArgs){

    let animationArgsList = store.state.editor.animationArgsList
    let index = animationArgsList.findIndex(ele => {
        return ele.id === animationArgs.id
    })

    if(index === -1){
        console.log('添加动画')
        store.commit('editor/updateAnimationArgs', {
            type: 'add',
            value: animationArgs
        })
        animations.push(createAnimation(animationArgs))
    }else{
        console.log('更新动画')
        store.commit('editor/updateAnimationArgs', {
            type: 'update',
            index,
            value: animationArgs
        })
        animations[index] = createAnimation(animationArgs)
    }
}

export function delAnimationArgs(id){
    let animationArgsList = store.state.editor.animationArgsList
    let index = animationArgsList.findIndex(ele => {
        return ele.id === id
    })
    store.commit('editor/updateAnimationArgs', {
        type: 'delete',
        index,
    })
    animations.splice(1, index)
}

export function createAnimation({id, type, keyframe, repeat, delay}){
    let imageObj = getImageObjById(id)
    let playAnimation = null
    let stopAnimation = null

    if(type === '位移'){
        let tween = null
        let originX = imageObj.x()
        let originY = imageObj.y()

        playAnimation = () => {

            // 设置起点
            imageObj.x(originX)
            imageObj.y(originY)

            // 初始化
            let lastTime = 0

            setTimeout(() => {
                let fn = index => {
                    if(index < keyframe.length){
                        let obj = keyframe[index]
                        tween = new Konva.Tween({
                            node: imageObj,
                            duration: (obj.time - lastTime) / 1000,
                            x: obj.x / scaleRate,
                            y: obj.y / scaleRate,
                            onFinish(){
                                tween.destroy();
                                lastTime = obj.time
                                fn(index+1)
                            }
                        });
                        imageObj.draggable(false)
                        tween.play()
                    }else{
                        // 重复
                        if(repeat === 0){
                            playAnimation(0)
                        }
                    }
                }
                fn(0)

            }, delay)
        }

        stopAnimation = () => {
            if(tween !== null){
                tween.reset()
                tween = null
                imageObj.x(originX)
                imageObj.y(originY)
                imageObj.draggable(true)
            }
        }
    }

    return {
        id,
        playAnimation,
        stopAnimation
    }
}

export function batchCreateAnimation(){
    animations = store.state.editor.animationArgsList.map(ele => {
        return createAnimation(ele)
    })
}

export function updateAnimationsStatus(id, type){
    animations.forEach(ele => {
        if(id === null || id === ele.id){
            ele[`${type}Animation`]()
        }
    })
}

export function addEvent(id, name, Controlled){
    let imageObj = getImageObjById(id)
    if(name === '点击'){
        imageObj.on('click', function (){
            Controlled.forEach(ele => {
                let tempObj = getImageObjById(ele)
                console.log('tempObj', tempObj)
                tempObj.visible(!tempObj.visible())
            })
        })
    }

    store.commit('editor/updateImageEvents', {
        type: 'add',
        id,
        name,
        Controlled
    })

}

export function delEvent(id){
    let imageObj = getImageObjById(id)
    imageObj.off('click')
    store.commit('editor/updateImageEvents', {
        type: 'delete',
        id
    })
}
