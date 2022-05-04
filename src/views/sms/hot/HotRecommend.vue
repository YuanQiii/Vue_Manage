<template>
  <div class="hot-recommend">
    <filter-search
      class="filter-container"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
    >
      <el-form
        :inline="true"
        :model="pageConfig"
        size="small"
        label-width="140px"
      >
        <el-form-item label="品牌名称：">
          <el-input
            v-model="filterConditions.name"
            class="input-width"
            placeholder="品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="推荐状态：">
          <el-select
            v-model="filterConditions.recommendStatus"
            placeholder="全部"
            clearable
            class="input-width"
          >
            <el-option
              v-for="item in recommendOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </filter-search>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleSelectProduct"
        >选择商品</el-button
      >
    </el-card>

    <div class="table-container">
      <el-table
        ref="newProductTable"
        :data="tableDataList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="是否推荐" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleRecommendStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.recommendStatus"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.recommendStatus | formatRecommendStatus
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEditSort(scope.$index, scope.row)"
              >设置排序
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="footer">
      <div class="batch-operate-container">
        <el-select size="small" v-model="operateType" placeholder="批量操作">
          <el-option
            v-for="item in operates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 20px"
          class="search-button"
          @click="handleBatchOperate"
          type="primary"
          size="small"
        >
          确定
        </el-button>
      </div>
      <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :pageConfig="pageConfig"
        :total="productList.length"
      />
    </div>

    <select-dialog
      :productList="otherProductList"
      :dialogVisible.sync="dialogVisible"
      @closeDialog="closeDialog"
    />

    <el-dialog title="设置排序" :visible.sync="sortDialogVisible" width="40%">
      <el-form :model="sortDialogData" label-width="150px">
        <el-form-item label="排序：">
          <el-input
            v-model="sortDialogData.sort"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleUpdateSort" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FilterSearch from "@/components/filterSearch/FilterSearch.vue";

import { productListApi } from "@/api/product";
import { dataTableList } from "@/utils/logic";
import SelectDialog from "./components/SelectDialog.vue";
import Pagination from "@/components/pagination/Pagination.vue";
export default {
  name: "HotRecommend",
  components: { FilterSearch, SelectDialog, Pagination },
  created() {
    this.getProductList();
  },
  filters: {
    formatRecommendStatus(status) {
      if (status === 1) {
        return "推荐中";
      } else {
        return "未推荐";
      }
    },
  },
  data() {
    return {
      productList: [],
      otherProductList: [],
      tableDataList: [],
      filterConditions: {},
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
      },
      dialogVisible: false,
      recommendOptions: [
        {
          label: "未推荐",
          value: 0,
        },
        {
          label: "推荐中",
          value: 1,
        },
      ],
      listLoading: false,
      multipleSelection: [],
      sortDialogVisible: false,
      sortDialogData: {
        id: 0,
        sort: 0,
      },
      operates: [
        {
          label: "设为推荐",
          value: 0,
        },
        {
          label: "取消推荐",
          value: 1,
        },
        {
          label: "删除",
          value: 2,
        },
      ],
      operateType: null,
    };
  },
  methods: {
    // 获取商品数据
    getProductList() {
      this.listLoading = true;
      productListApi().then((response) => {
        let list = response.data.list;
        this.productList = list.slice(0, 5);
        this.otherProductList = list.slice(5, list.length);
        this.tableDataList = this.productList;
        this.listLoading = false;
      });
    },

    // 重置
    handleReset() {
      this.filterConditions = {};
    },

    // 搜索
    handleSearch() {
      this.pageConfig.pageNum = 1;
      this.handleTableDataList();
    },

    // 选择商品
    handleSelectProduct() {
      this.dialogVisible = true;
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 推荐按钮
    handleRecommendStatusChange(index, row) {
      this.handleRecommendStatus([row.id], row.recommendStatus);
      this.handleTableDataList();
    },

    // 设置排序按钮
    handleEditSort(index, row) {
      this.sortDialogData.id = row.id;
      this.sortDialogVisible = true;
    },

    // 删除按钮
    handleDelete(index, row) {
      this.$confirm("是否要删除该推荐?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.handleDeleteLogic([row.id]);
        this.handleTableDataList();
      });
    },

    // 批量操作
    handleBatchOperate() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
        });
        return;
      }

      let ids = [];
      this.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });

      if (this.operateType === 0) {
        //设为推荐
        this.handleRecommendStatus(ids, 1);
      } else if (this.operateType === 1) {
        //取消推荐
        this.handleRecommendStatus(ids, 0);
      } else if (this.operateType === 2) {
        //删除
        this.handleDeleteLogic(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
        });
      }
      this.handleTableDataList();
      this.operateType = null;
    },

    // 改变数据列表数量
    handleSizeChange(value) {
      this.pageConfig = value;
      this.dataTableList();
    },

    // 改变页码
    handleCurrentChange(value) {
      this.pageConfig = value;
      this.dataTableList();
    },

    // 关闭对话框,添加数据
    closeDialog(value) {
      this.dialogVisible = false;

      value.forEach((element) => {
        for (let i = 0; i < this.productList.length; i++) {
          if (this.productList[i].id != element.id) {
            this.productList.push(element);
            break;
          }
        }
      });

      this.handleTableDataList();
    },

    // 排序确定
    handleUpdateSort() {
      this.productList.forEach((element) => {
        if (element.id == this.sortDialogData.id) {
          element.sort = this.sortDialogData.sort;
        }
      });
      this.handleTableDataList();
      this.sortDialogVisible = false;
    },

    // 推荐切换逻辑
    handleRecommendStatus(ids, status) {
      this.productList.forEach((element) => {
        ids.forEach((id) => {
          if (element.id == id) {
            element.recommendStatus = status;
          }
        });
      });
    },

    // 删除逻辑
    handleDeleteLogic(ids) {
      let temp = [];
      this.productList.forEach((element) => {
        if (!ids.includes(element.id)) {
          temp.push(element);
        }
      });
      this.productList = temp;
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
.filter-container {
  margin-top: 40px;
  margin-bottom: 20px;
}
.operate-container {
  margin-bottom: 20px;
  .btn-add {
    float: right;
  }
}
.footer {
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
}
</style>