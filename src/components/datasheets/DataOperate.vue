<template>
  <div class="data-operation">
    <el-card class="operate-container" shadow="never">
      <div class="container">
        <div class="left">
          <i class="el-icon-tickets"></i>
          <span>数据列表</span>
        </div>

        <div class="right">
          <el-button class="btn" @click="value.callback" size="small" v-for="(value, index) in operateData" :key="index">
            {{value.btnName}}
          </el-button>
        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "DataOperate",
  props: {
    operateData: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="less" scoped>
.data-operation{
  .operate-container{
    .container{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left{
        .el-icon-tickets{
          margin-right: 5px;
        }
      }
    }

  }
}
</style>