<template>
  <div class="pixi-tool-bar">
    <el-button @click="handleNewProject">新建</el-button>
    <input ref="lockScreenFiles" type="file" multiple @change="handleFilesChange"/>
    <el-button @click="handleChangeMode">{{mode | getName}}</el-button>
    <el-button>开发者模式</el-button>
    <el-button @click="handleRevoke">撤销</el-button>
    <el-button>截屏</el-button>
    <el-button @click="handleExport">导出</el-button>
  </div>
</template>

<script>

import {mapMutations, mapState} from "vuex";
import {updateAllPlayTween} from "@/views/lock/tween/Tween";
export default {
  name: "toolBar",
  computed: {
    ...mapState('lock', ['mode', 'tr'])
  },
  filters: {
    getName(value){
      return value === 'edit' ? '编辑' : '预览'
    }
  },
  methods: {
    ...mapMutations('lock', ['addFile', 'exportFile', 'updateMode', 'revokeOp']),
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

      this.addFile(filesObj)
      console.log(filesObj)
    },
    handleExport(){
      this.exportFile()
    },
    handleChangeMode(){
      if(this.mode === 'edit'){
        this.updateMode('preview')
        this.tr.nodes([])
        updateAllPlayTween('stop')
        updateAllPlayTween('play')
      }else{
        this.updateMode('edit')
        updateAllPlayTween('stop')
      }
    },
    handleRevoke(){
      this.revokeOp()
    }
  }
}
</script>

<style lang="less" scoped>

</style>