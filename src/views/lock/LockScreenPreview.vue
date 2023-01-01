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
  computed: {
    ...mapState('lock', ['previewWidth', 'previewHeight', 'scaleRate'])
  },
  methods: {
    ...mapMutations('lock', ['setKonvaStage']),
    initKonva(){

      let width = Math.round(this.previewWidth / this.scaleRate)
      let height = Math.round(this.previewHeight / this.scaleRate)

      let stage = new Konva.Stage({
        container: 'konva-container',
        width,
        height,
      })

      stage.scale()
      this.setKonvaStage(stage)
    },
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