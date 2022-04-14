<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-14 21:32:53
 * @FilePath: \vue_manage\src\views\sms\coupon\components\CouponSearch.vue
-->
<template>
  <div class="coupon-search">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
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
          :model="filterConditions"
          size="small"
          label-width="140px"
        >
          <el-form-item label="优惠券名称：">
            <el-input
              v-model="filterConditions.name"
              class="input-width"
              placeholder="优惠券名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-select
              v-model="filterConditions.type"
              placeholder="全部"
              clearable
              class="input-width"
            >
              <el-option
                v-for="item in typeOptions"
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
export default {
  name: "CouponSearch",
  data() {
    return {
      defaultFilterConditions: {
        name: null,
        type: null,
      },
      filterConditions: Object.assign({}, this.defaultFilterConditions),
      typeOptions: [
        {
          label: "全场赠券",
          value: 0,
        },
        {
          label: "会员赠券",
          value: 1,
        },
        {
          label: "购物赠券",
          value: 2,
        },
        {
          label: "注册赠券",
          value: 3,
        },
      ],
    };
  },
  methods: {
    // 查询
    handleSearchList() {
      this.$emit("searchResult", Object.assign({}, this.filterConditions));
    },

    // 重置
    handleResetSearch() {
      this.filterConditions = Object.assign({}, this.defaultFilterConditions);
    },
  },
};
</script>

<style lang="less" scoped>
.el-icon-search {
  margin-right: 5px;
}
</style>