<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-05 14:45:54
 * @FilePath: \vue_manage\src\views\pms\list\ProductFilter.vue
-->
<template>
  <div class="product-filter">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small"
        >
          查询结果
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              style="width: 203px"
              v-model="listQuery.keyword"
              placeholder="商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input
              style="width: 203px"
              v-model="listQuery.productSn"
              placeholder="商品货号"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select
              v-model="listQuery.brandId"
              placeholder="请选择品牌"
              clearable
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select
              style="width: 203px"
              v-model="listQuery.publishStatus"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select
              style="width: 203px"
              v-model="listQuery.verifyStatus"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { productFilterCateApi } from "@/api/product";
import { brandListApi } from "@/api/brand";

export default {
  name: "ProductFilter",
  created() {
    this.getProductFilterCate();
    this.getBandList();
  },
  data() {
    return {
      defaultListQuery: {
        keyword: null,
        publishStatus: null,
        verifyStatus: null,
        productSn: null,
        productCategoryId: null,
        brandId: null,
      },
      listQuery: Object.assign({}, this.defaultListQuery),
      selectProductCateValue: {},
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "上架",
        },
        {
          value: 0,
          label: "下架",
        },
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 0,
          label: "未审核",
        },
      ],
    };
  },
  methods: {
    getProductFilterCate() {
      productFilterCateApi().then((response) => {
        let temp = [];
        response.data.forEach((element) => {
          let children = [];
          element.children.forEach((item) => {
            children.push({
              label: item.name,
              value: item.id,
            });
          });
          temp.push({
            label: element.name,
            value: element.id,
            children,
          });
        });
        this.productCateOptions = temp;
      });
    },

    getBandList() {
      brandListApi().then((response) => {
        let temp = [];
        response.data.forEach((element) => {
          temp.push({
            label: element.name,
            value: element.id,
          });
        });
        this.brandOptions = temp;
      });
    },

    handleSearchList() {
      this.$emit(
        "SearchList",
        Object.assign(this.listQuery, {
          productCategoryId: this.selectProductCateValue[1],
        })
      );
    },
    handleResetSearch() {
      this.selectProductCateValue = {};
      this.listQuery = Object.assign({}, this.defaultListQuery);
    },
  },
};
</script>

<style lang="less" scoped>
.el-icon-search {
  margin-right: 5px;
}
</style>