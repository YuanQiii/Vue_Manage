<template>
  <div class="lock-screen-preview">
    <tool-bar />
    <div class="wrapper">
      <div id="konva-container"></div>
      <div class="layer">
        <shape-operation />
        <shape-list />
      </div>
    </div>
  </div>
</template>

<script>
import ShapeOperation from "@/views/editor/components/ShapeOperation";
import ShapeList from "@/views/editor/components/ShapeList";
import ToolBar from "@/views/editor/components/ToolBar";
import {mapMutations} from "vuex";
export default {
  name: "LockscreenEditor",
  components: {ToolBar, ShapeList, ShapeOperation},
  mounted() {
    this.initKonva()
  },
  watch: {
    '$store.state.editor.konvaImages': function (){
      this.recordState()
    },
    '$store.state.editor.animationArgsList': function (){
      this.recordState()
    },
    '$store.state.editor.imageEvents': function (){
      this.recordState()
    },
  },
  methods: {
    ...mapMutations('editor', ['setKonvaStage', 'recordState']),
    initKonva(){
      this.setKonvaStage()
      this.recordState()
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