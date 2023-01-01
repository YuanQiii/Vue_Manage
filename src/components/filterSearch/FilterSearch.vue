<template>
  <div class="filter-search">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          class="btn-0"
          type="primary"
          @click="handleBtn('Search')"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button class="btn-1" @click="handleBtn('Reset')" size="small">
          重置
        </el-button>
      </div>
      <div class="filter">
        <slot />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "FilterSearch",
  methods: {
    handleBtn(type) {
      this.$emit(`handle${type}`);
    },
  },
};
</script>

<style lang="less" scoped>
.el-icon-search {
  margin-right: 5px;
}
.filter {
  margin-top: 20px;
}
.btn-0 {
  float: right;
}
.btn-1 {
  float: right;
  margin-right: 15px;
}
.bnt-2 {
  float: right;
  margin-right: 15px;
}
</style>