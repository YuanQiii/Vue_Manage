<template>
  <el-dialog
    title="选择商品"
    width="50%"
    :visible.sync="visible"
    class="dialog"
  >
    <el-input
      v-model.trim="filterConditions.name"
      style="width: 250px; margin-bottom: 20px"
      size="small"
      placeholder="商品名称搜索"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSearch"
      ></el-button>
    </el-input>

    <el-table
      :data="tableDataList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column
        type="selection"
        width="60"
        align="center"
      ></el-table-column>
      <el-table-column label="商品名称" align="center">
        <template v-slot="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="货号" width="160" align="center">
        <template v-slot="scope">NO.{{ scope.row.productSn }}</template>
      </el-table-column>
      <el-table-column label="价格" width="120" align="center">
        <template v-slot="scope">￥{{ scope.row.price }}</template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <pagination
        class="pagination"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :pageConfig="pageConfig"
        :total="productList.length"
      />
    </div>

    <div slot="footer">
      <el-button size="small" @click="handleDialogCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="handleDialogConfirm"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/pagination/Pagination.vue";

import { dataTableList } from "@/utils/logic";
export default {
  components: { Pagination },
  name: "SelectDialog",
  props: {
    productList: {
      type: Array,
      default: [],
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(value) {
        this.$emit("update:dialogVisible", value);
      },
    },
  },
  watch: {
    productList(newValue) {
      this.tableDataList = newValue;
    },
  },
  data() {
    return {
      filterConditions: {},
      tableDataList: [],
      multipleSelection: [],
      pageConfig: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  },
  methods: {
    // 搜索
    handleSearch() {
      this.handleTableDataList();
    },

    // 改变页码
    handleCurrentChange(value) {
      this.pageConfig = value;
      this.handleTableDataList();
    },

    // 改变列表展示数据
    handleSizeChange() {
      this.pageConfig = value;
      this.handleTableDataList();
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 确定
    handleDialogConfirm() {
      if (this.multipleSelection.length) {
        this.handleCloseDialog();
      } else {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
        });
      }
    },

    // 取消
    handleDialogCancel() {
      this.handleCloseDialog();
    },

    // 关闭对话框
    handleCloseDialog() {
      this.$emit("closeDialog", this.multipleSelection);
    },

    // 列表数据处理逻辑
    handleTableDataList() {
      this.tableDataList = dataTableList(
        this.productList,
        this.pageConfig,
        this.filterConditions
      );
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
}
</style>