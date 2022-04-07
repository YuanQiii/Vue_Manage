<template>
  <div class="product-cate-list">
    <el-card class="operate-container" shadow="never">
      <div class="left">
        <i class="el-icon-tickets"></i>
        <span style="margin-top: 5px">数据列表</span>
      </div>
      <div class="right">
        <el-button class="btn-add" @click="handleAddProductCate" size="mini">
          添加
        </el-button>
      </div>
    </el-card>

    <div class="table-container">
      <el-table
        ref="productCateTable"
        style="width: 100%"
        :data="currentList"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.level | levelFilter
          }}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.productCount }}</template>
        </el-table-column>
        <el-table-column label="数量单位" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.productUnit }}</template>
        </el-table-column>
        <el-table-column label="导航栏" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleNavStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.navStatus"
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
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.level | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)"
              >查看下级
            </el-button>
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

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pageConfig.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="pageConfig.pageNum"
        :total="categoryList.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { productFilterCateApi, productChildCateApi } from "@/api/product";

export default {
  name: "ProductCateList",
  data() {
    return {
      categoryList: [],
      listLoading: true,
      pageConfig: {
        pageNum: 1,
        pageSize: 5,
      },
      parentId: 0,
    };
  },
  created() {
    this.getList();
    this.resetParentId();
  },
  computed: {
    // 当前展示数据列表
    currentList() {
      let start = (this.pageConfig.pageNum - 1) * this.pageConfig.pageSize;
      let end = this.pageConfig.pageNum * this.pageConfig.pageSize;
      let max = this.categoryList.length;
      end = end > max ? max : end;
      return this.categoryList.slice(start, end);
    },
  },
  watch: {
    // 监听分类层级路由变化
    $route(route) {
      this.resetParentId();
    },
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return "一级";
      } else if (value === 1) {
        return "二级";
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    // 获取分类
    getList() {
      this.listLoading = true;
      if (this.parentId == 0) {
        productFilterCateApi().then((response) => {
          this.listLoading = false;
          this.categoryList = response.data;
        });
      } else {
        productChildCateApi(this.parentId).then((response) => {
          this.listLoading = false;
          this.categoryList = response.data;
        });
      }
    },

    // 获取parentId
    resetParentId() {
      this.pageConfig.pageNum = 1;
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
      this.getList();
    },

    // 跳转到添加页面
    handleAddProductCate() {
      this.$router.push({ name: "addProductCate" });
    },

    // 改变每页展示数量
    handleSizeChange(value) {
      this.pageConfig = {
        pageNum: 1,
        pageSize: value,
      };
    },

    // 改变页码
    handleCurrentChange(value) {
      this.pageConfig = {
        pageNum: value,
        pageSize: this.pageConfig.pageSize,
      };
    },

    // 导航栏
    handleNavStatusChange() {
      this.$message({
        message: "导航栏",
        type: "info",
      });
    },

    // 显示
    handleShowStatusChange() {
      this.$message({
        message: "是否显示",
        type: "info",
      });
    },

    // 查看下一级
    handleShowNextLevel(index, row) {
      this.$router.push({
        path: "/pms/productCate",
        query: { parentId: row.id },
      });
    },

    // 编辑更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/pms/updateProductCate",
        query: { id: row.id },
      });
    },

    // 删除
    handleDelete(index, row) {
      this.$confirm("是否要删除该品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let temp = [];
        this.categoryList.forEach((element) => {
          if (element.name != row.name) {
            temp.push(element);
          }
        });
        this.categoryList = temp;
        this.$message({
          message: "删除成功",
          type: "success",
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.product-cate-list {
  width: 100%;
  margin-left: 20px;
  margin-top: 40px;
  .operate-container {
    margin-bottom: 20px;
    .left {
      display: inline-block;
      .el-icon-tickets {
        margin-right: 5px;
      }
    }
    .right {
      display: inline-block;
      margin-left: 93%;
    }
  }
  .pagination-container {
    margin-top: 20px;
  }
}
</style>
