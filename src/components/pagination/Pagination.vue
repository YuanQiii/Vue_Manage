<template>
  <div class="pagination">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :layout="layout"
      :current-page.sync="config.pageNum"
      :page-size.sync="config.pageSize"
      :page-sizes="[5, 10, 15]"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pageConfig: {
      type: Object,
      default: {
        pageNum: 1,
        pageSize: 10,
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    layout: {
      type: String,
      default: "total, sizes ,prev, pager, next, jumper",
    },
  },
  data() {
    return {
      config: this.pageConfig,
    };
  },
  methods: {
    handleSizeChange() {
      this.pageConfig.pageNum = 1;
      this.$emit("handleSizeChange", this.config);
    },
    handleCurrentChange() {
      this.$emit("handleCurrentChange", this.config);
    },
  },
};
</script>

<style>
</style>