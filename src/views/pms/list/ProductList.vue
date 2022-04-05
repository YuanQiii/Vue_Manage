<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-05 14:41:10
 * @FilePath: \vue_manage\src\views\pms\list\ProductList.vue
-->
<template>
  <div class="product-list">
    <product-filter class="filter" @SearchList="SearchList" />

    <el-card class="operate-container" shadow="never">
      <div class="left">
        <i class="el-icon-tickets"></i> <span>数据列表</span>
      </div>

      <el-button class="btn-add" @click="handleAddProduct" size="mini">
        添加
      </el-button>
    </el-card>

    <product-datasheets
      class="list"
      :dataList="dataList"
      @selectionChange="selectionChange"
      @deleteIndex="deleteIndex"
    />

    <product-operate
      :total="productList.length"
      :selectList="selectList"
      class="product-operate"
      @pageConfigChange="pageConfigChange"
      @batchOperate="batchOperate"
    />
  </div>
</template>

<script>
import { productListApi } from "@/api/product";

import ProductFilter from "./ProductFilter.vue";
import ProductOperate from "./ProductOperate.vue";
import ProductDatasheets from "./ProductDatasheets.vue";
export default {
  name: "ProductList",
  components: {
    ProductFilter,
    ProductOperate,
    ProductDatasheets,
  },
  created() {
    this.getProductList();
  },
  data() {
    return {
      productList: [],
      dataList: [],
      selectList: [],
      listConfig: {},
      pageConfig: {
        pageSize: 5,
        pageNum: 1,
      },
    };
  },

  methods: {
    //  获取商品
    getProductList() {
      productListApi().then((response) => {
        this.productList = response.data.list;
        this.dataList = response.data.list;
        this.total = response.data.total;
        this.handleDataList();
      });
    },

    SearchList(value) {
      this.listConfig = value;
      this.handleDataList();
    },

    pageConfigChange(value) {
      this.pageConfig = value;
      this.handleDataList();
    },

    selectionChange(value) {
      this.selectList = value;
    },

    deleteIndex(value) {
      let index =
        this.pageConfig.pageSize * (this.pageConfig.pageNum - 1) + value;
      this.productList.splice(index, 1);
      this.productList = [...this.productList];
      this.handleDataList();
    },

    batchOperate(value) {
      console.log(value);
      let temp = [];
      this.productList.forEach((element) => {
        let flag = true;
        value.forEach((item) => {
          if (item.id == element.id) {
            temp.push(item);
            flag = false;
          }
        });
        if (flag) {
          temp.push(element);
        }
      });
      this.productList = temp;
      this.handleDataList();
    },

    getMatchResult(element) {
      let keys = Object.keys(this.listConfig);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        if (this.listConfig[key] != null || this.listConfig[key] != undefined) {
          if (key == "keyword") {
            if (!element.name.includes(this.listConfig[key])) {
              return false;
            }
          } else {
            if (this.listConfig[key] != element[key]) {
              return false;
            }
          }
        }
      }
      return true;
    },

    handleAddProduct() {
      this.$router.push({ name: "addProduct" });
    },

    handleDataList() {
      let temp = [];
      this.productList.forEach((element) => {
        if (this.getMatchResult(element)) {
          temp.push(element);
        }
      });

      let size = this.pageConfig.pageSize;
      let num = this.pageConfig.pageNum;
      let start = size * (num - 1);
      let max = temp.length;
      let end = size * num > max ? max : size * num;
      temp = temp.slice(start, end);
      this.dataList = temp;
    },
  },
};
</script>

<style lang="less" scoped>
.product-list {
  .filter {
    margin-top: 60px;
    margin-left: 20px;
  }
  .operate-container {
    margin-left: 20px;
    margin-top: 20px;
    .left {
      display: inline-block;
      .el-icon-tickets {
        margin-right: 5px;
      }
    }
    .btn-add {
      margin-left: 91%;
    }
  }
  .list {
    margin-left: 20px;
    margin-top: 20px;
  }
  .product-operate {
    margin-bottom: 40px;
  }
}
</style>
