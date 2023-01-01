<template>
  <div class="batch-operate">
    <el-select size="small" v-model="batchOperateType" placeholder="批量操作">
      <el-option
          v-for="item in batchOperateOptions"
          :key="item.label"
          :label="item.label"
          :value="item.label"
      >
      </el-option>
    </el-select>
    <el-button
        class="btn"
        @click="handleBatchOperate"
        type="primary"
        size="small"
    >
      确定
    </el-button>
  </div>
</template>

<script>
export default {
  name: "BatchOperate",
  props: {
    batchOperateOptions: {
      type: Array,
      default: () => []
    },
    multipleSelection: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      batchOperateType: null,
    }
  },
  methods: {
    handleBatchOperate(){
      let isDelete = false
      if (this.multipleSelection.length) {
        this.multipleSelection.forEach(element => {
          this.batchOperateOptions.forEach(item => {
            if(item.label === this.batchOperateType){

              // 批量发货
              if(item.label === '批量发货'){
                if(element[item.key] === 1){
                  element[item.key] = item.value
                }
              }
              else if(item.label.includes('删除') && !isDelete){
                isDelete = true
              }
              else{
                element[item.key] = item.value
              }
            }
          })
        })

        if(isDelete){
          this.$message({
            message: "删除成功！",
            type: "success",
          });
        }else{
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }

        isDelete = false

      }else{
        this.$message({
          message: "请选择一条记录",
          type: "warning",
        });
      }
    }
  }
}
</script>

<style lang="less" scoped>
.batch-operate{
  .btn{
    margin-left: 20px;
  }
}

</style>