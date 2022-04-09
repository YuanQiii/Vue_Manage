<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-08 17:04:09
 * @FilePath: \vue_manage\src\views\pms\brand\ProductBrandList.vue
-->
<template>
  <div class="brand-list">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchBrandList()"
          type="primary"
          size="small"
        >
          查询结果
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="pageConfig"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              style="width: 203px"
              v-model="pageConfig.keyword"
              placeholder="品牌名称/关键字"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addBrand()" size="mini">
        添加
      </el-button>
    </el-card>

    <div class="table-container">
      <el-table
        ref="brandTable"
        :data="currentList"
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="品牌首字母" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.firstLetter }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="品牌制造商" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleFactoryStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.factoryStatus"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showStatus"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="pageConfig.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="pageConfig.pageNum"
        :total="brandList.length"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { brandListApi } from "@/api/brand";

export default {
  name: "ProductBrandList",
  created() {
    this.getBrandList();
  },
  data() {
    return {
      operates: [
        {
          label: "显示品牌",
          value: "showBrand",
        },
        {
          label: "隐藏品牌",
          value: "hideBrand",
        },
      ],
      operateType: null,
      pageConfig: {
        keyword: null,
        pageNum: 1,
        pageSize: 5,
      },
      brandList: [],
      listLoading: true,
      multipleSelection: [],
    };
  },
  computed: {
    currentList() {
      let start = this.pageConfig.pageSize * (this.pageConfig.pageNum - 1);
      let end = this.pageConfig.pageSize * this.pageConfig.pageNum;
      let max = this.pageConfig.length;
      end = end > max ? max : end;
      return this.brandList.slice(start, end);
    },
  },
  methods: {
    // 获取品牌数据
    getBrandList() {
      this.listLoading = true;
      brandListApi().then((response) => {
        this.listLoading = false;
        this.brandList = response.data;
      });
    },

    // 品牌选择
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 删除
    handleDelete(index, row) {
      this.$confirm("是否要删除该品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let temp = [];
        this.brandList.forEach((element) => {
          if (element.id != row.id) {
            temp.push(element);
          }
        });
        this.brandList = temp;

        this.$message({
          message: "删除成功",
          type: "success",
        });
      });
    },

    // 品牌制造商
    handleFactoryStatusChange(index, row) {
      this.$message({
        message: "品牌制造商",
        type: "info",
      });
    },

    // 是否显示
    handleShowStatusChange(index, row) {
      console.log(this.brandList);
    },

    // 每页显示条数
    handleSizeChange(value) {
      this.pageConfig.pageNum = 1;
      this.pageConfig.pageSize = value;
    },

    // 页码
    handleCurrentChange(value) {
      this.pageConfig.pageNum = value;
    },

    // 查询
    searchBrandList() {
      this.pageConfig.pageNum = 1;
      if (this.pageConfig.keyword) {
        let temp = [];
        this.brandList.forEach((element) => {
          if (
            element.name.includes(this.pageConfig.keyword) ||
            element.firstLetter == this.pageConfig.keyword.toUpperCase()
          ) {
            temp.push(element);
          }
        });
        this.brandList = temp;
      } else {
        this.getBrandList();
      }
    },

    // 批量操作
    handleBatchOperate() {
      console.log(this.multipleSelection);

      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
        });
        return;
      }

      let showStatus = 0;
      if (this.operateType === "showBrand") {
        showStatus = 1;
      } else if (this.operateType === "hideBrand") {
        showStatus = 0;
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
        });
        return;
      }

      let temp = [];
      this.brandList.forEach((element) => {
        this.multipleSelection.forEach((item) => {
          if (element.id == item.id) {
            element.showStatus = showStatus;
          }
        });

        temp.push(element);
      });
      this.brandList = temp;

      this.$message({
        message: "修改成功",
        type: "success",
      });
    },

    // 跳转到更新页面
    handleUpdate(index, row) {
      this.$router.push({ path: "/pms/updateBrand", query: { id: row.id } });
    },

    // 跳转到添加页面
    addBrand() {
      this.$router.push({ path: "/pms/addBrand" });
    },
  },
};
</script>
<style lang="less" scoped>
.el-icon-search {
  margin-right: 5px;
}
</style>

