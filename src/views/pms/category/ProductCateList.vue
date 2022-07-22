<template>
  <div class="product-cate-list">
    <datasheets
        :all-data="allData"
        :operate-data="operateData"
        :total="allData.length"
    >
      <template v-slot="prop">
        <el-table :data="prop.tableData" border>
          <el-table-column prop="id" label="编号" width="100" align="center"/>
          <el-table-column prop="name" label="分类名称" align="center"/>
          <el-table-column
              prop="level"
              label="级别"
              width="100"
              align="center"
          />
          <el-table-column
              prop="productCount"
              label="商品名称"
              width="100"
              align="center"
          />
          <el-table-column
              prop="productUnit"
              label="单位数量"
              width="100"
              align="center"
          />
          <el-table-column label="导航栏" align="center" width="100">
            <template v-slot="scope">
              <el-switch
                  v-model="scope.row.navStatus"
                  @change="handleNavStatusChange(scope.row)"
                  :active-value="1"
                  :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否显示" align="center" width="100">
            <template v-slot="scope">
              <el-switch
                  v-model="scope.row.showStatus"
                  @change="handleShowStatusChange(scope.row)"
                  :active-value="1"
                  :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
              prop="sort"
              label="排序"
              width="100"
              align="center"
          />
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button size="mini" @click="handleShowNextLevel(scope.row)"
              >查看下级
              </el-button
              >
              <el-button size="mini" @click="handleUpdate(scope.row)"
              >编辑
              </el-button
              >
              <el-button
                  type="danger"
                  size="mini"
                  @click="handleDelete(scope.row)"
              >删除
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>
  </div>
</template>

<script>
import {productFilterCateApi, productChildCateApi} from "@/api/product";
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  name: "ProductCateList",
  components: {
    Datasheets,
  },
  data() {
    return {
      allData: [],
      operateData: [
        {
          btnName: "添加",
          callback: this.handleAdd,
        },
      ],
      parentId: 0,
    };
  },
  created() {
    this.getCate();
    this.resetParentId();
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
    getCate() {
      if (this.parentId === 0) {
        productFilterCateApi().then((response) => {
          this.allData = response.data;
        });
      } else {
        productChildCateApi(this.parentId).then((response) => {
          this.allData = response.data;
        });
      }
    },

    // 获取parentId
    resetParentId() {
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
      this.getCate();
    },

    // 跳转到添加页面
    handleAdd() {
      this.$router.push({name: "addProductCate"});
    },

    // 导航栏
    handleNavStatusChange() {
      this.$message({
        message: "导航栏",
        type: "warning",
      });
    },

    // 显示
    handleShowStatusChange() {
      this.$message({
        message: "是否显示",
        type: "warning",
      });
    },

    // 查看下一级
    handleShowNextLevel(row) {
      this.$router.push({
        path: "/pms/productCate",
        query: {parentId: row.id},
      });
    },

    // 编辑更新
    handleUpdate(row) {
      this.$router.push({
        path: "/pms/updateProductCate",
        query: {id: row.id},
      });
    },

    // 删除
    handleDelete(row) {
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
</style>
