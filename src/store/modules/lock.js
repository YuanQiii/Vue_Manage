import FileSaver from 'file-saver'
import x2js from 'x2js'
import Konva from 'konva';
import {handleMove, handleValueTransform} from "@/utils/lock";
import {revokeOp} from "@/views/lock/queue/OperationQueue";
import {delTween, tweenList} from "@/views/lock/tween/Tween";
import dayjs from "dayjs";


const state = {
    scaleRate: 3,
    mode: 'edit',
    previewWidth: 1080,
    previewHeight: 1920,
    konvaStage: null,
    xmlFile: null,

    files: {},
    layersObj: [],
    layerEditObj: null,

    deleteLayersObj: [],

    tr: new Konva.Transformer(),

    operationHistory: [],
    tweenArgs: {}


};

const mutations = {
    setKonvaStage(state, payload){
        state.konvaStage = payload
    },

    updateMode(state, payload){
        state.mode = payload
    },

    addFile(state, payload){
        state.files =  Object.assign(state.files, payload)

        console.log('files', state.files)

        for (const [key, value] of Object.entries(payload)) {

            let layer = new Konva.Layer();
            state.konvaStage.add(layer);
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

                console.log('tempImage', tempImage)

                layer.add(state.tr)

                tempImage.on('mousedown', function() {

                    if(state.mode === 'edit'){
                        if(this.visible() && this.draggable()){
                            state.layerEditObj = this

                            Object.values(state.layersObj).forEach(ele => {
                                ele.strokeWidth(Number(ele !== this))
                            })

                            state.tr.nodes([this])

                            layer.draw();
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
                    handleMove(state.konvaStage)
                });

                tempImage.on('dragend', function() {
                    state.operationHistory.push({
                        layer: tempImage,
                        op: 'update',
                        style: {
                            x: tempDragX,
                            y: tempDragY
                        }
                    })
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

                // add the shape to the layer
                layer.add(tempImage);
                layer.batchDraw();
                // layer.destroy()

                tempImage.layer = layer

                state.layersObj.push(tempImage)
                console.log(tempImage)

                // 添加操作历史
                state.operationHistory.push({
                    layer: tempImage,
                    op: 'add'
                })
                console.log('state.operationHistory', state.operationHistory)

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
                state.tr.nodes([payload[0]])
            }else{
                state.tr.nodes([])
                state.tr.stopTransform()
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
        let blob = new Blob([xs.js2xml(state.xmlFile)], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, 'demo.xml')
    },

    deleteLayersObj(state, payload){
        payload.visible(false)
        state.deleteLayersObj.push(state.layersObj.pop())
        state.tr.nodes([])
        if(payload.attrs.id === state.layerEditObj.attrs.id){
            state.layerEditObj = null
        }
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
                        state.tr.nodes([])
                        state.tr.nodes([opObj.layer])
                    }
                }

                if(opObj.tween){
                    console.log('动画')
                    if(opObj.tween.op === 'add'){
                        delTween(opObj.layer)
                    }

                }
            }
        }
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
