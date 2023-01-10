<template>
  <div class="layer-edit">
    <el-tabs type="border-card" v-if="konvaImageEditId">
      <el-tab-pane label="样式">
        <div v-if="imageType === 'image'">
          <div class="info">
            <div class="left">
              <img :src="konvaImageEditObj.attrs.image.currentSrc">
            </div>
            <div class="right">
              <div>名字：{{konvaImageEditObj.attrs.id}}</div>
              <div>尺寸：{{konvaImageEditObj.attrs.width}} * {{konvaImageEditObj.attrs.height}}</div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-evenly">
              <div>大小</div>
              <div>宽度：<el-input-number v-model="imageWidth" :min="0" :max="10000"  @change="(currentValue, oldValue)=>{handleChange('width', currentValue, oldValue)}"></el-input-number></div>
              <div>高度：<el-input-number v-model="imageHeight" :min="0" :max="10000" @change="(currentValue, oldValue)=>{handleChange('height', currentValue, oldValue)}"></el-input-number></div>
            </div>
            <div style="display: flex; justify-content: space-evenly">
              <div>位置</div>
              <div>X：<el-input-number v-model="imageX" :min="0" :max="10000" @change="(currentValue, oldValue)=>{handleChange('x', currentValue, oldValue)}"></el-input-number></div>
              <div>Y：<el-input-number v-model="imageY" :min="0" :max="10000" @change="(currentValue, oldValue)=>{handleChange('y', currentValue, oldValue)}"></el-input-number></div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="动画">
        <el-select
            v-model="animations"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择动效">
          <el-option
              v-for="item in animationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="handleAddAnimation">添加动画</el-button>
        <el-button @click="handlePlay">播放</el-button>
        <el-button @click="handlePause">暂停</el-button>

        <div v-if="animations.includes('位移')">
          <div>
            延迟：<el-slider
              v-model="animationArgs.delay"
              :max="1000"
              show-input>
          </el-slider>
          </div>
          <div>
            重复：

            <el-select v-model="animationArgs.repeat" placeholder="请选择">
              <el-option
                  v-for="item in positionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-button @click="handleAddKeyframe">添加关键帧</el-button>
          <position-keyframe @getKeyframeData="getKeyframeData" v-for="(value, index) in animationArgs.keyframe" :dx="value.x" :dy="value.y" :dtime="value.time" :id="index"/>

        </div>
        <div v-if="animations.includes('旋转')">
          旋转
        </div>
        <div v-if="animations.includes('缩放')">
          缩放
        </div>
        <div v-if="animations.includes('渐隐')">
          渐隐
        </div>
        <div v-if="animations.includes('帧动画')">
          帧动画
        </div>

      </el-tab-pane>
      <el-tab-pane label="事件">
        <el-select v-model="events" placeholder="请选择事件">
          <el-option
              v-for="item in eventOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="handleAddEvent">添加事件</el-button>
        <el-button @click="handleRemoveEvent">移除事件</el-button>
        <div v-if="events.includes('点击')">
          关联图层
          <el-select v-model="eventControlled" placeholder="请选择">
            <el-option
                v-for="item in releasableImages"
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
import {mapGetters, mapMutations, mapState} from "vuex";
import Konva from "konva";
import PositionKeyframe from "@/views/editor/components/PositionKeyframe";
import _ from 'lodash'
import {addAnimationArgs, addEvent, updateAnimationsStatus} from "@/views/editor/utils/utils";

export default {
  name: "shapeOperation",
  components: {PositionKeyframe},
  data(){
    return {
      animations: ['位移'],
      animationOptions: [
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

      animationArgs: {
        id: '',
        type: '位移',
        delay: 0,
        repeat: 0,
        keyframe: [
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
        ]
      },

      positionOptions: [
        {
          value: '1',
          label: '一次'
        },
        {
          value: '0',
          label: '循环'
        },
      ],

      events: ['点击'],
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
    ...mapState('editor', ['konvaImages', 'konvaImageEditId']),
    ...mapGetters('editor', ['konvaImageEditObj']),

    releasableImages(){
      let arr = []
      this.konvaImages.forEach(ele => {
        if (ele.attrs.id !== this.konvaImageEditId) {
          arr.push({
            label: ele.attrs.id,
            value: ele.attrs.id
          })
        }
      })
      return arr
    },

    imageType(){
      if(this.konvaImageEditObj instanceof Konva.Image){
        return 'image'
      }
      return 'image'
    },

    imageWidth: {
      get(){
        return this.konvaImageEditObj.width()
      },
      set(val){
        this.konvaImageEditObj.width(val)
      }
    },
    imageHeight: {
      get(){
        return this.konvaImageEditObj.height()
      },
      set(val){
        this.konvaImageEditObj.height(val)
      }
    },
    imageX: {
      get(){
        return this.konvaImageEditObj.x()
      },
      set(val){
        this.konvaImageEditObj.x(val)
      }
    },
    imageY: {
      get(){
        return this.konvaImageEditObj.y()
      },
      set(val){
        this.konvaImageEditObj.y(val)
      }
    },


  },
  methods: {
    ...mapMutations('editor', ['recordState']),
    handleAddKeyframe(){
      let keyframe = this.animationArgs.keyframe
      keyframe.push({
        ..._.cloneDeep(keyframe.slice(-1)[0]),
        id: this.animationArgs.keyframe.length,
      })
      keyframe.sort((a, b) => {
        return a.time - b.time
      })
    },

    getKeyframeData(value){
      this.animationArgs.keyframe.forEach(ele => {
        if(ele.id === value.id){
          ele.x = value.x
          ele.y = value.y
          ele.time = value.time
        }
      })
    },

    handleAddAnimation(){
      this.animationArgs.id = this.konvaImageEditId
      addAnimationArgs(this.animationArgs)
    },
    handlePlay(){
      updateAnimationsStatus(this.konvaImageEditId, 'play')
    },
    handlePause(){
      updateAnimationsStatus(this.konvaImageEditId, 'stop')
    },

    handleAddEvent(){
      // console.log(this.eventControlled)
      addEvent(this.konvaImageEditId, '点击', [this.eventControlled])
    },

    handleRemoveEvent(){

    },

    handleChange(type, currentValue, oldValue){
      this.recordState()
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