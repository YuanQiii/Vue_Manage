<template>
  <div class="lock-screen-preview">
    <tool-bar class="tool-bar" />
    <div class="wrapper">
      <div id="konva-container"></div>
      <div class="layer">
        <layer-edit />
        <layer-list />
      </div>
    </div>

  </div>
</template>

<script>
import Konva from 'konva';
import ToolBar from "@/views/lock/tool/toolBar";
import LayerEdit from "@/views/lock/edit/LayerEdit";
import LayerList from "@/views/lock/list/LayerList";
import {mapMutations, mapState} from "vuex";

export default {
  name: "LockScreenPreview",
  components: {LayerList, LayerEdit, ToolBar},
  mounted(){
    this.initKonva()
  },
  data(){
    return {
    }
  },
  watch: {
    '$store.state.lock.konvaStaticLayer': function (){
      this.record()
    },
    '$store.state.lock.layersObj': function (){
      this.record()
    },
    '$store.state.lock.layerEditObj': function (){
      this.record()
    },
    '$store.state.lock.konvaImageTweenList': function (){
      this.record()
    },
    '$store.state.lock.konvaImageEventList': function (){
      this.record()
    },
  },
  computed: {
    ...mapState('lock', ['previewWidth', 'previewHeight', 'scaleRate', 'flag', 'history'])
  },
  methods: {
    ...mapMutations('lock', ['setKonvaStage', 'recordState']),
    initKonva(){
      this.setKonvaStage()
    },
    record(){
      if(this.flag){
        this.recordState()
        console.log('history', this.history)
      }

    }
  }
}
</script>

<style lang="less" scoped>
.lock-screen-preview{
  padding-bottom: 50px;
}
.tool-bar{
  margin-bottom: 20px;
}

.wrapper{
  display: flex;
}

.layer{
  display: flex;
}

#konva-container{
  border: solid 2px #000;
  padding: 10px;
}

</style>