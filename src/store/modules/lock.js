import FileSaver from 'file-saver'
import x2js from 'x2js'
import Konva from 'konva';
import {handleMove, handleValueTransform} from "@/utils/lock";
import {delTween, tweenArgsList, tweenList} from "@/views/lock/tween/Tween";
import dayjs from "dayjs";
import {addTag, handleXML, updateTag} from "@/views/lock/xml/XML";
import _ from "lodash";
import sizeof from 'object-sizeof'


const state = {
    scaleRate: 3,
    mode: 'edit',
    previewWidth: 1080,
    previewHeight: 1920,
    konvaStage: null,

    konvaStaticLayer: new Konva.Layer(),

    xmlObj: {
        Lockscreen: {
            _version: '1',
            _frameRate: '30',
            _screenWidth: '1080'
        },
    },

    files: {},
    layersObj: [],
    layerEditObj: null,

    deleteLayersObj: [],

    tr: null,

    operationHistory: [],
    tweenArgs: {},
    events: [],

    konvaImageTweenList: [],
    konvaImageEventList: [],

    history: [],
    currentIndex: -1,
    flag: true,
    xxx: true,

    tempThis: null


};


const mutations = {
    setKonvaStage(state){
        let width = Math.round(state.previewWidth / state.scaleRate)
        let height = Math.round(state.previewHeight / state.scaleRate)
        let container = 'konva-container'

        let stage = new Konva.Stage({
          container,
          width,
          height,
        })

        stage.scale()
        state.konvaStage = stage
    },

    updateMode(state, payload){
        state.mode = payload
    },

    addFile(state, payload){
        state.files =  Object.assign(state.files, payload)

        state.konvaStage.add(state.konvaStaticLayer);
        if(state.xxx){
            // state.konvaStaticLayer.add(state.tr)
            state.xxx = false
        }


        console.log('files', state.files)

        for (const [key, value] of Object.entries(payload)) {

            // let layer = new Konva.Layer();

            let imageObj = new Image();
            imageObj.onload = function() {
                let tempImage = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: imageObj,
                    width: Math.round(imageObj.width / 3),
                    height: Math.round(imageObj.height / 3),
                    stroke: 'blue',
                    strokeWidth: 1,
                    dash: [2, 2],
                    strokeScaleEnabled: false,
                    draggable: true,
                    id: `${key}-${dayjs().unix()}`
                });

                console.log('tempImage0', _.cloneDeep(tempImage))

                // layer.add(state.tr)

                tempImage.on('mousedown', function() {

                    if(state.mode === 'edit'){
                        if(this.visible() && this.draggable()){
                            state.layerEditObj = this

                            Object.values(state.layersObj).forEach(ele => {
                                ele.strokeWidth(Number(ele !== this))
                            })

                            if(state.tr) state.tr.destroy()
                            state.tr = new Konva.Transformer()
                            state.konvaStaticLayer.add(state.tr)
                            state.tr.nodes([this])

                            state.konvaStaticLayer.draw();
                        }
                    }
                });

                tempImage.on('mouseup', function() {
                    if(this.visible() && this.draggable()){
                        this.dash([2, 2])
                    }
                });

                let tempDragX = 0
                let tempDragY = 0

                tempImage.on('dragstart', function() {
                    tempDragX = tempImage.x()
                    tempDragY = tempImage.y()
                });

                tempImage.on('dragmove', function() {
                    // handleMove(state.konvaStage)
                });

                tempImage.on('dragend', function() {

                    updateTag(state.xmlObj, tempImage.attrs.id, {
                        x: tempImage.x(),
                        y: tempImage.y()
                    })

                    state.operationHistory.push({
                        layer: tempImage,
                        op: 'update',
                        style: {
                            x: `${tempDragX}`,
                            y: `${tempDragY}`
                        }
                    })

                    // state.tr.detach()
                    console.log('state.konvaStaticLayer0', state.konvaStaticLayer)

                    let obj = _.cloneDeep({
                        layersObj: state.layersObj,
                        layerEditObj: state.layerEditObj,
                        konvaImageTweenList: state.konvaImageTweenList
                    })
                    obj.konvaStaticLayer = state.konvaStaticLayer.clone()
                    state.history.push(obj)
                    state.currentIndex++

                    console.log('state.history', state.history)
                });

                tempImage.on('mouseover', function() {
                    if(this.visible() && this.draggable()){
                        document.body.style.cursor = 'pointer';
                        this.dash([0, 0])
                    }
                });

                tempImage.on('mouseout', function() {
                    if(this.visible() && this.draggable()){
                        document.body.style.cursor = 'default';
                        this.dash([2, 2])
                    }
                });

                let tempScaleX = 0
                let tempScaleY = 0

                tempImage.on('transformstart', function() {
                    this.strokeWidth(0)
                    this.dash([0, 0])

                    tempScaleX = this.scaleX()
                    tempScaleY = this.scaleY()
                });

                tempImage.on('transform', function() {
                    handleValueTransform(this.width(), this.scaleX())
                });

                tempImage.on('transformend', function() {
                    console.log('transform end');
                    state.operationHistory.push({
                        layer: tempImage,
                        op: 'update',
                        style: {
                            scaleX: tempScaleX,
                            scaleY: tempScaleY
                        }
                    })
                });

                console.log('tempImage1', tempImage)

                // add the shape to the layer
                // layer.add(tempImage);
                // layer.batchDraw();

                state.konvaStaticLayer.add(tempImage)
                // state.konvaStaticLayer.batchDraw()

                // setTimeout(() => {
                //     state.konvaStaticLayer.remove(tempImage)
                // }, 1000)

                // tempImage.cache()
                // layer.destroy()

                // tempImage.layer = layer
                // tempImage.layer = state.konvaStaticLayer

                state.layersObj.push(tempImage)

                // 添加xml
                addTag(state.xmlObj, 'Lockscreen', 'Image', tempImage.attrs.id, {
                    x: '0',
                    y: '0',
                    src: `${key}.png`,
                    align: 'center',
                    alignV: 'center'
                })

                // 添加操作历史
                // state.operationHistory.push({
                //     layer: tempImage,
                //     op: 'add'
                // })
                // console.log('state.operationHistory', state.operationHistory)

            };
            imageObj.src = URL.createObjectURL(value);
        }

    },

    updateFile(state, payload){
        for (const [key, value] of Object.entries(payload)) {
            let imageObj = new Image();
            imageObj.onload = function (){
                state.layersObj.forEach(ele => {
                    if(ele.attrs.id.split('-')[0] === key.split('-')[0]){
                        state.operationHistory.push({
                            layer: ele,
                            op: 'update',
                            style: {
                                image: ele.attrs.image,
                            }
                        })

                        ele.attrs.image = imageObj
                        ele.layer.batchDraw()
                    }
                })
            }
            imageObj.src = URL.createObjectURL(value);
        }
    },

    setLayerTr(state, payload){
        if(state.layerEditObj === payload[0]){
            if(payload[1]){
                // state.tr.nodes([payload[0]])
            }else{
                // state.tr.nodes([])
                // state.tr.stopTransform()
            }
        }
    },

    setLayerLock(state, payload){
        // state.layerEditObj.strokeWidth(0)
        // state.layerEditObj.draggable(false)
    },

    updateTweenArgs(state, payload){
        state.tweenArgs = payload
    },

    exportFile(state){
        let xs = new x2js()
        let xmlStr = handleXML(xs.js2xml(state.xmlObj))
        let blob = new Blob([xmlStr], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, 'demo.xml')
    },

    deleteLayersObj(state, payload){
        payload.visible(false)
        state.deleteLayersObj.push(state.layersObj.pop())
        // state.tr.nodes([])
        if(payload.attrs.id === state.layerEditObj.attrs.id){
            state.layerEditObj = null
        }
    },

    addEvent(state, payload){
        state.events.push(payload)
    },

    addOp(state, payload){
        state.operationHistory.push(payload)
        console.log(state.operationHistory)
    },

    revokeOp(state){
        console.log(state.operationHistory)
        if(state.operationHistory.length){

            console.log(state.operationHistory)

            let opObj = state.operationHistory.pop()

            console.log(opObj)

            // 进行删除操作
            if(opObj.op === 'add'){
                console.log('进行删除操作')
                opObj.layer.layer.destroy()
                state.layersObj.pop()
                if(opObj.layer.attrs.id === state.layerEditObj.attrs.id){
                    state.layerEditObj = null
                }
            }

            // 进行添加操作
            if(opObj.op === 'delete'){
                console.log('进行添加操作')
                opObj.layer.visible(true)
                state.layersObj.push(state.deleteLayersObj.pop())
            }

            // 进行更新操作
            if(opObj.op === 'update'){
                console.log('进行更新操作')
                if(opObj.style){
                    console.log('样式')
                    for (const [key, value] of Object.entries(opObj.style)){
                        if(key === 'image'){
                            opObj.layer.attrs[key] = value
                        }else{
                            opObj.layer[key](value)
                        }
                    }
                    opObj.layer.layer.batchDraw()

                    if(opObj.layer === state.layerEditObj){
                        // state.tr.nodes([])
                        // state.tr.nodes([opObj.layer])
                    }
                }

                if(opObj.tween){
                    console.log('动画')
                    if(opObj.tween.op === 'add'){
                        delTween(opObj.layer)
                    }
                }

                if(opObj.event){
                    console.log('事件')
                    if(opObj.event.op === 'add'){
                        opObj.layer.off(opObj.event.eventName)
                    }
                }
            }
        }
    },

    test(state){

    },

    updateKonvaImageTweenList(state, payload){
        if(payload.type === 'add'){
            state.konvaImageTweenList.push(payload.value)
        }

        if(payload.type === 'delete'){
            state.konvaImageTweenList.splice(payload.value, 1)
        }
    },

    updateKonvaImageEventList(state, payload){
        let {layerObj, layerObjControlled, eventName} = payload
        state.layersObj.forEach(ele => {
            if(ele.attrs.id === layerObj.attrs.id){
                ele.on('click', function (){
                    console.log('click')
                    state.tempThis = this

                    layerObjControlled.visible(!layerObjControlled.visible())
                })
            }
        })
        state.konvaImageEventList.push({
            Controller: layerObj,
            Controlled: layerObjControlled,
            eventName
        })
    },

    recordState(state){
        let obj = _.cloneDeep({
            layersObj: state.layersObj,
            layerEditObj: state.layerEditObj,
            konvaImageTweenList: state.konvaImageTweenList
        })
        obj.konvaStaticLayer = state.konvaStaticLayer.clone()
        state.history.push(obj)
        state.currentIndex++

        console.log('state.history', state.history)

        // console.log('sizeof', sizeof(state.history))
    },

    undo(state){
        state.currentIndex--
        state.flag = false
        // let {konvaStaticLayer, layersObj, layerEditObj, konvaImageTweenList} = _.cloneDeep(state.history[state.currentIndex])
        let {layerEditObj} = _.cloneDeep(state.history[state.currentIndex])

        state.konvaStaticLayer = state.history[state.currentIndex].konvaStaticLayer.clone()
        // state.layersObj = layersObj
        // state.layerEditObj = layerEditObj
        // state.konvaImageTweenList = konvaImageTweenList

        setTimeout(() => {
            state.flag = true
        }, 1000)
        state.konvaStage.destroyChildren()
        console.log('state.konvaStage.getLayers()', state.konvaStage.getLayers())
        state.konvaStage.add(state.konvaStaticLayer)
        console.log('state.konvaStage.getLayers()', state.konvaStage.getLayers())

        if(state.tr) state.tr.destroy()
        state.tr = new Konva.Transformer()
        state.konvaStaticLayer.add(state.tr)
        state.tr.nodes([layerEditObj])



        console.log('tweenArgsList', tweenArgsList)

    }
};

const getters = {};

const actions = {};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
