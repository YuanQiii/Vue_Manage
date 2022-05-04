<template>
  <div class="brand-recommend">
    <!-- 筛选搜索 -->
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
    </el-card>

    <!-- 列表 -->
    <div class="table-container">
      <el-table
        ref="homeBrandTable"
        :data="dataTableList"
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
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="是否推荐" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="
                handleRecommendStatusStatusChange(scope.$index, scope.row)
              "
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

    <div class="bottom-container">
      <!-- 批量操作 -->
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
          @click="handleBatchOperate()"
          type="primary"
          size="small"
        >
          确定
        </el-button>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <pagination
          :total="brandList.length"
          :pageConfig="pageConfig"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
    </div>

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
import Pagination from "@/components/pagination/Pagination.vue";

import { dataTableList } from "@/utils/logic";
import { brandListApi } from "@/api/brand";

export default {
  components: { FilterSearch, Pagination },
  name: "BrandRecommend",
  data() {
    return {
      pageConfig: { pageNum: 1, pageSize: 10 },
      filterConditions: {},
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
      brandList: [],
      dataTableList: [],
      list: null,
      listLoading: false,
      multipleSelection: [],
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
      sortDialogVisible: false,
      sortDialogData: { sort: 0, id: null },
    };
  },
  created() {
    this.getBrandList();
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
  methods: {
    // 获取品牌列表
    getBrandList() {
      this.listLoading = true;
      brandListApi().then((response) => {
        console.log(response);
        this.brandList = response.data;
        this.dataTableList = response.data;
        this.listLoading = false;
      });
    },

    // 搜索
    handleSearch() {
      this.pageConfig.pageNum = 1;
      this.dataTableList = dataTableList(
        this.brandList,
        this.pageConfig,
        this.filterConditions
      );
    },

    // 重置
    handleReset() {
      this.filterConditions = {};
    },

    // 列表多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 推荐切换按钮
    handleRecommendStatusStatusChange(index, row) {
      this.updateRecommendStatusStatus([row.id], row.recommendStatus);
    },

    // 切换推荐逻辑
    updateRecommendStatusStatus(ids, status) {
      this.$confirm("是否要修改推荐状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.brandList.forEach((element) => {
            ids.forEach((id) => {
              if (id == element.id) {
                element.recommendStatus = status;
              }
            });
          });

          this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消操作!",
          });
        });
    },

    // 排序
    handleEditSort(index, row) {
      this.sortDialogVisible = true;
      this.sortDialogData.sort = row.sort;
      this.sortDialogData.id = row.id;
    },

    // 删除按钮
    handleDelete(index, row) {
      this.deleteBrand([row.id]);
    },

    // 删除逻辑
    deleteBrand(ids) {
      this.$confirm("是否要删除该推荐?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let temp = [];
        this.brandList.forEach((element) => {
          if (!ids.includes(element.id)) {
            temp.push(element);
          }
        });
        this.brandList = temp;
        this.updateTableData();

        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    // 批量操作
    handleBatchOperate() {
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000,
        });
        return;
      }

      let ids = [];
      this.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });

      if (this.operateType === 0) {
        //设为推荐
        this.updateRecommendStatusStatus(ids, 1);
      } else if (this.operateType === 1) {
        //取消推荐
        this.updateRecommendStatusStatus(ids, 0);
      } else if (this.operateType === 2) {
        //删除
        this.deleteBrand(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000,
        });
        return;
      }
    },

    // 排序按钮
    handleEditSort(index, row) {
      this.sortDialogVisible = true;
      this.sortDialogData = {
        sort: row.sort,
        id: row.id,
      };
    },

    // 排序逻辑
    handleUpdateSort() {
      this.$confirm("是否要修改排序?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.brandList.forEach((element) => {
          if (element.id == this.sortDialogData.id) {
            element.sort = this.sortDialogData.sort;
          }
        });
        this.updateTableData();

        this.sortDialogVisible = false;
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    // 列表展示数据量
    handleSizeChange(value) {
      this.pageConfig = value;
      this.updateTableData();
    },

    // 页码改变
    handleCurrentChange(val) {
      this.pageConfig = value;
      this.updateTableData();
    },

    // 更新列表数据逻辑
    updateTableData() {
      this.dataTableList = dataTableList(
        this.brandList,
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
.table-container {
  margin-top: 20px;
}
.bottom-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>


