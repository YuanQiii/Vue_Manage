<template>
  <div class="batch-operate">
    <el-select size="small" v-model="batchOperateType" placeholder="批量操作">
      <el-option
          v-for="item in batchOperateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
      default: []
    },
  },
  data(){
    return {
      batchOperateType: null,
    }
  },
  methods: {
    handleBatchOperate(){
      this.$emit('handleBatchOperate', this.batchOperateType)
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