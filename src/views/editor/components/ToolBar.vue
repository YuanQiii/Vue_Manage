<template>
  <div class="pixi-tool-bar">
    <el-button @click="handleNewProject">新建</el-button>
    <input ref="lockScreenFiles" type="file" multiple @change="handleFilesChange"/>
    <el-button @click="handleChangeMode">{{mode | getName}}</el-button>
    <el-button @click="handleUndo">撤销</el-button>
    <el-button @click="handleRedo">重做</el-button>
    <el-button @click="handleExport">导出</el-button>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "ToolBar",
  computed: {
    ...mapState('editor', ['mode']),
  },
  filters: {
    getName(value){
      return value === 'edit' ? '编辑' : '预览'
    },
  },
  methods: {
    ...mapMutations('editor', ['addImages', 'undo', 'redo', 'updateMode']),
    handleNewProject(){
      console.log('handleNewProject')
    },
    handleFilesChange(e){
      let files = e.target.files
      // 检验格式，不对就报错

      let filesObj = {}
      files.forEach(ele => {
        filesObj[ele.name.slice(0, -4)] = ele
      })

      this.addImages(filesObj)
    },
    handleChangeMode(){
      this.updateMode()
    },
    handleUndo(){
      this.undo()
    },
    handleRedo(){
      this.redo()
    },
    handleExport(){
      console.log('handleExport')
    }
  }
}
</script>

<style scoped>

</style>