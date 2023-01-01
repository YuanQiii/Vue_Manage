<template>
  <div class="layer-edit">
    <el-tabs type="border-card" v-if="layerEditObj">
      <el-tab-pane label="样式">
        <div v-if="layerType === 'image'">
          <div class="info">
            <div class="left">
              <img :src="layerEditObj.attrs.image.currentSrc">
            </div>
            <div class="right">
              <div>名字：{{layerEditObj.attrs.id}}</div>
              <div>尺寸：{{layerEditObj.attrs.width}} * {{layerEditObj.attrs.height}}</div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-evenly">
              <div>大小</div>
              <div>宽度：<el-input-number v-model="layerWidth" :min="0" :max="10000"  @change="(currentValue, oldValue)=>{handleChange('width', currentValue, oldValue)}"></el-input-number></div>
              <div>高度：<el-input-number v-model="layerHeight" :min="0" :max="10000" @change="(currentValue, oldValue)=>{handleChange('height', currentValue, oldValue)}"></el-input-number></div>
            </div>
            <div style="display: flex; justify-content: space-evenly">
              <div>位置</div>
              <div>X：<el-input-number v-model="layerX" :min="0" :max="10000" @change="(currentValue, oldValue)=>{handleChange('x', currentValue, oldValue)}"></el-input-number></div>
              <div>Y：<el-input-number v-model="layerY" :min="0" :max="10000" @change="(currentValue, oldValue)=>{handleChange('y', currentValue, oldValue)}"></el-input-number></div>
            </div>
<!--            <div style="display: flex; justify-content: space-evenly; margin-top: 20px;">-->
<!--              <div>对平对齐</div>-->
<!--              <el-radio v-model="VA" label="left">左</el-radio>-->
<!--              <el-radio v-model="VA" label="center">中</el-radio>-->
<!--              <el-radio v-model="VA" label="right">右</el-radio>-->
<!--            </div>-->
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="动画">
        <el-select
            v-model="aniList"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择动效">
          <el-option
              v-for="item in aniOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="handleAddAnimation">添加动画</el-button>
        <el-button @click="handlePlay">播放</el-button>
        <el-button @click="handlePause">暂停</el-button>

        <div v-if="aniList.includes('位移')">
          <div>
            延迟：<el-slider
              v-model="positionDelay"
              :max="1000"
              show-input>
          </el-slider>
          </div>
          <div>
            重复：

            <el-select v-model="positionRepeat" placeholder="请选择">
              <el-option
                  v-for="item in positionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-button @click="handleAddKeyframe">添加关键帧</el-button>
          <position-keyframe @getKeyframeData="getKeyframeData" v-for="(value, index) in positionKeyframe" :dx="value.x" :dy="value.y" :dtime="value.time" :id="index"/>

        </div>
        <div v-if="aniList.includes('旋转')">
          旋转
        </div>
        <div v-if="aniList.includes('缩放')">
          缩放
        </div>
        <div v-if="aniList.includes('渐隐')">
          渐隐
        </div>
        <div v-if="aniList.includes('帧动画')">
          帧动画
        </div>

      </el-tab-pane>
      <el-tab-pane label="事件">
        <el-select v-model="eventList" placeholder="请选择事件">
          <el-option
              v-for="item in eventOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="handleAddEvent">添加事件</el-button>
        <el-button @click="handleRemoveEvent">移除事件</el-button>
        <div v-if="eventList.includes('点击')">
          关联图层
          <el-select v-model="eventControlled" placeholder="请选择">
            <el-option
                v-for="item in layerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import Konva from "konva";
import PositionKeyframe from "@/views/lock/edit/PositionKeyframe";
import {addTween, updatePlayTween} from "@/views/lock/tween/Tween";
import {addEvent} from "@/views/lock/event/Event";
import {debounce} from "@/utils/lock";
import _ from 'lodash'

export default {
  name: "LayerEdit",
  components: {PositionKeyframe},
  data(){
    return {
      VA: 'left',


      fn: null,

      aniList: ['位移'],
      aniOptions: [
        {
          value: '位移',
          label: '位移'
        },
        {
          value: '旋转',
          label: '旋转'
        },
        {
          value: '缩放',
          label: '缩放'
        },
        {
          value: '渐隐',
          label: '渐隐'
        },
        {
          value: '帧动画',
          label: '帧动画'
        }
      ],

      positionDelay: 0,
      positionRepeat: 0,
      positionOptions: [
      {
        value: '1',
        label: '一次'
      },
      {
        value: '0',
        label: '循环'
      }],
      positionKeyframe: [
        {
          id: 0,
          x: 200,
          y: 200,
          time: 1000,
        },
        {
          id: 1,
          x: 400,
          y: 400,
          time: 2000
        },
      ],

      eventList: ['点击'],
      eventOptions: [
        {
          value: '点击',
          label: '点击'
        },
        {
          value: '滑动',
          label: '滑动'
        },
      ],

      eventControlled: [],

      tween: null,
      originX: 0,
      originY: 0,
    }
  },
  computed: {
    ...mapState('lock', ['layersObj', 'layerEditObj', 'scaleRate']),
    layerOptions(){
      let arr = []
      this.layersObj.forEach(ele => {
        if (ele.attrs.id !== this.layerEditObj.attrs.id) {
          arr.push({
            label: ele.attrs.id,
            value: ele.attrs.id
          })
        }
      })
      return arr
    },
    layerType(){
      if(this.layerEditObj instanceof Konva.Image){
        return 'image'
      }
      return 'image'
    },

    layerWidth: {
      get(){
        return this.layerEditObj.width()
      },
      set(val){
        this.layerEditObj.width(val)
        this.recordTween()
      }
    },
    layerHeight: {
      get(){
        return this.layerEditObj.height()
      },
      set(val){
        this.layerEditObj.height(val)
        this.recordTween()
      }
    },
    layerX: {
      get(){
        return this.layerEditObj.x()
      },
      set(val){
        this.layerEditObj.x(val)
        this.recordTween()
      }
    },
    layerY: {
      get(){
        return this.layerEditObj.y()
      },
      set(val){
        this.layerEditObj.y(val)
        this.recordTween()
      }
    },
  },
  methods: {
    ...mapMutations('lock', ['updateTweenArgs', 'addOp']),
    handleAddKeyframe(){
      let obj = JSON.parse(JSON.stringify(this.positionKeyframe.slice(-1)[0]))
      obj.id = this.positionKeyframe.length
      this.positionKeyframe.push(obj)

      this.positionKeyframe.sort((a, b) => {
        return a.time - b.time
      })

      this.recordTween()
    },
    getKeyframeData(value){
      this.positionKeyframe.forEach(ele => {
        if(ele.id === value.id){
          ele.x = value.x
          ele.y = value.y
          ele.time = value.time
        }
      })
      console.log(this.positionKeyframe)

      this.recordTween()
    },
    handleAddAnimation(){
      let tweenArgs = _.cloneDeep({
        positionKeyframe: this.positionKeyframe,
        positionRepeat: this.positionRepeat,
        positionDelay: this.positionDelay
      })
      tweenArgs.layerObj = this.layerEditObj

      addTween(tweenArgs)
    },
    handlePlay(){
      updatePlayTween(this.layerEditObj, 'play')
    },
    handlePause(){
      updatePlayTween(this.layerEditObj, 'stop')
    },

    handleAddEvent(){
      console.log(this.eventControlled)
      this.layersObj.forEach(ele => {
        if(ele.attrs.id === this.eventControlled){
          addEvent(this.layerEditObj, ele, this.eventList[0])
        }
      })

    },
    handleRemoveEvent(){

    },
    recordTween(){
      // this.updateTweenArgs({
      //   aniList: this.aniList,
      //   positionDelay: this.positionDelay,
      //   positionRepeat: this.positionRepeat,
      //   positionKeyframe: this.positionKeyframe,
      // })
      // this.handleAddAnimation()
    },

    handleChange(type, currentValue, oldValue){
      this.addOp({
        layer: this.layerEditObj,
        op: 'update',
        style:{
          [type]: oldValue
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layer-edit{
  width: 40vw;
  margin-left: 20px;
}

.info{
  display: flex;
  .left{
    img{
      width: 50px;
      height: 50px;
    }
  }
}
</style>