<template>
  <div class="layer-list">
    <div v-for="(value, index) in layersObj" :key="value.attrs.id">
      <div style="display: flex">
        <div class="layer-item" style="width: 180px" @click="handleLayerUpload">
          <img class="layer-image" :src="getLayerPic(value)">
          <div>
            {{value.attrs.id}}
          </div>
          <input ref="layerFile" type="file" style="visibility: hidden" @change="handleFileChange"/>
        </div>

        <el-button @click="handleLayerVisible(value)">显隐：{{value.visible()}}</el-button>
        <el-button @click="handleLayerDraggable(value)">拖拽：{{value.draggable()}}</el-button>
        <el-button @click="handleLayerDelete(value)">删除</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "LayerList",
  data(){
    return {
      src: ''
    }
  },
  computed: {
    ...mapState('lock', ['layersObj', 'layerEditObj', 'tr']),
  },
  methods: {
    ...mapMutations('lock', ['setLayerTr', 'setLayerLock', 'addOp', 'deleteLayersObj', 'updateFile']),
    getLayerPic(value){
      return value.attrs.image.currentSrc
    },
    handleLayerVisible(value){
      if(value.visible()){
        value.hide()
        this.setLayerTr([value, false])
      }else{
        value.show()
        this.setLayerTr([value, true])
      }

      this.$forceUpdate()
    },
    handleLayerDraggable(value){
      if(value.draggable()){
        value.draggable(false)
        value.strokeWidth(0)
        this.setLayerTr([value, false])
      }else{
        value.draggable(true)
        if(this.layerEditObj !== value){
          value.strokeWidth(1)
        }
        this.setLayerTr([value, true])
      }

      this.$forceUpdate()
    },
    handleLayerDelete(value){
      console.log('删除')

      this.addOp({
        layer: value,
        op: 'delete'
      })

      this.deleteLayersObj(value)
    },
    handleLayerUpload(){
      this.$refs.layerFile[0].click()
    },
    handleFileChange(e){
      let files = e.target.files
      let filesObj = {}
      files.forEach(ele => {
        filesObj[ele.name.slice(0, -4)] = ele
      })
      this.updateFile(filesObj)
    }
  }
}
</script>

<style lang="less" scoped>
.layer-image{
  width: 50px;
  height: 50px;
  border-radius: 10px;
}

.layer-item{
  display: flex;
}

.layer-show{
  text-align: center;
  margin-right: 20px;
}
.layer-lock{
  margin-left: 20px;
}

.layer-list{
  margin-left: 20px;
}
</style>