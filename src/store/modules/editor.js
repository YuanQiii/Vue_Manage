import _ from "lodash";
import {
    batchCreateAnimation,
    getImageLayerById,
    updateAnimationsStatus
} from "@/views/editor/utils/utils";
import Konva from "konva";
import dayjs from "dayjs";
import {addSnow} from "@/views/editor/utils/effect";

const state = {
    konvaStage: null,

    konvaStaticLayer: {},
    konvaDynamicLayer: {},

    konvaStaticLayerId: null,
    konvaDynamicLayerId: null,

    konvaImages: [],
    konvaImageEditId: '',

    animationArgsList: [],
    imageEvents: [],

    mode: 'edit',
    xmlObj: {},
    tr: null,

    previewWidth: 1080,
    previewHeight: 1920,
    scaleRate: 3,

    history: [],
    currentIndex: -1,
    isListening: true
};

const getters = {
    konvaImageEditObj(state){
        return state.konvaImages.filter(ele => {
            return ele.attrs.id === state.konvaImageEditId
        })[0]
    },
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

        stage.on('mousedown', function (e){
            if(e.target instanceof Konva.Image){
                let transformer = state.konvaStage.find('Transformer')
                transformer.forEach(ele => {
                    ele.destroy()
                })

                let layer = getImageLayerById(e.target.attrs.id)
                let tr = new Konva.Transformer()
                layer.add(tr)
                tr.nodes([e.target])
                layer.draw()
            }
        })

        stage.scale()
        state.konvaStage = stage

        state.konvaStaticLayer = new Konva.Layer()
        state.konvaDynamicLayer = new Konva.Layer()

        state.konvaDynamicLayerId = state.konvaDynamicLayer._id
        state.konvaStaticLayerId = state.konvaStaticLayer._id

        state.konvaStage.add(state.konvaStaticLayer)
        state.konvaStage.add(state.konvaDynamicLayer)
    },

    addImages(state, payload){

        let _this = this
        let tempKonvaImages = []
        let count = Object.keys(payload).length

        for (const [key, value] of Object.entries(payload)) {
            let imageObj = new Image();
            imageObj.onload = function() {
                let konvaImage = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: imageObj,
                    width: Math.round(imageObj.width / state.scaleRate),
                    height: Math.round(imageObj.height / state.scaleRate),
                    stroke: 'blue',
                    strokeWidth: 1,
                    dash: [2, 2],
                    strokeScaleEnabled: false,
                    draggable: true,
                    id: `${key}-${dayjs().unix()}`
                });

                konvaImage.on('mousedown', function() {
                    if(state.mode === 'edit'){
                        if(this.visible() && this.draggable()){
                            state.konvaImageEditId = this.attrs.id
                        }
                    }
                });

                konvaImage.on('mouseup', function() {
                    if(state.mode === 'edit'){
                        if(this.visible() && this.draggable()){
                            this.dash([2, 2])
                        }
                    }
                });

                konvaImage.on('mouseover', function() {
                    if(this.visible() && this.draggable()){
                        document.body.style.cursor = 'pointer';
                        this.dash([0, 0])
                    }
                });

                konvaImage.on('mouseout', function() {
                    if(this.visible() && this.draggable()){
                        document.body.style.cursor = 'default';
                        this.dash([2, 2])
                    }
                });

                konvaImage.on('dragend', function() {
                    _this.commit('editor/recordState')
                });

                konvaImage.on('transformstart', function() {
                    this.strokeWidth(0)
                    this.dash([0, 0])
                });

                count--
                tempKonvaImages.push(konvaImage)
                if(!count) state.konvaImages.push(...tempKonvaImages)

                state.konvaStaticLayer.add(konvaImage)
            };
            imageObj.src = URL.createObjectURL(value);

            addSnow(key, value)

        }
    },

    updateAnimationArgs(state, payload){
        let value = _.cloneDeep(payload.value)

        if(payload.type === 'add'){
            state.animationArgsList.push(value)
        }

        if(payload.type === 'update'){
            state.animationArgsList[payload.index] = value
        }

        if(payload.type === 'delete'){
            state.animationArgsList.splice(1, payload.index)
        }
    },

    updateImageEvents(state, payload){
        if(payload.type === 'add'){
            state.imageEvents.push(payload)
        }

        if(payload.type === 'delete'){
            let index = state.imageEvents.findIndex(ele => {
                return ele.id === payload.id
            })
            state.imageEvents.splice(1, index)
        }
    },

    updateMode(state){
        if(state.mode === 'edit'){
            state.mode = 'preview'
            updateAnimationsStatus(null, 'stop')
            updateAnimationsStatus(null, 'play')
        }else{
            state.mode = 'edit'
            updateAnimationsStatus(null, 'stop')
        }
    },

    recordState(state){
        if(!state.isListening) return

        if(state.currentIndex !== state.history.length - 1){
            state.history.splice(state.currentIndex+1, state.history.length - state.currentIndex -2)
        }

        let obj = _.cloneDeep({
            konvaImages: state.konvaImages,
            konvaImageEditId: state.konvaImageEditId,
            animationArgsList: state.animationArgsList,
            imageEvents: state.imageEvents,
        })

        let layers = state.konvaStage.getChildren()

        layers.forEach(ele => {
            if(ele._id === state.konvaStaticLayerId) {
                obj['konvaStaticLayer'] = ele.clone()
                obj['konvaStaticLayerId'] = obj['konvaStaticLayer']._id
            }
            if(ele._id === state.konvaDynamicLayerId) {
                obj['konvaDynamicLayer'] = ele.clone()
                obj['konvaDynamicLayerId'] = obj['konvaDynamicLayer']._id
            }
        })

        state.history.push(obj)
        state.currentIndex++

        console.log('state.history', state.history)
    },

    undo(state){
        state.currentIndex--
        this.commit('editor/recoveryOperation')
    },

    redo(){
        state.currentIndex++
        this.commit('editor/recoveryOperation')
    },

    recoveryOperation(){
        state.isListening = false

        let obj = state.history[state.currentIndex]

        state.konvaStage.destroyChildren()
        for (const [key, value] of Object.entries(obj)){
            if(!(key === 'konvaStaticLayer' || key === 'konvaDynamicLayer')){
                state[key] = _.cloneDeep(value)
            }
        }

        for (const [key, value] of Object.entries(obj)){
            if(key === 'konvaStaticLayer' || key === 'konvaDynamicLayer'){
                let layerObj = value.clone()
                if(value._id === obj.konvaStaticLayerId){
                    state['konvaStaticLayer'] = layerObj
                }
                if(value._id === obj.konvaDynamicLayerId){
                    state['konvaDynamicLayer'] = layerObj
                }
                state.konvaStage.add(layerObj)
            }
        }

        batchCreateAnimation()

        setTimeout(() => {
            state.isListening = true
        })

        console.log('state.history', state.history)
    }
};



const actions = {};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
