<template>
  <div class="order-search">
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
          <el-form-item label="输入搜索：">
            <el-input
              v-model="filterConditions.orderSn"
              class="input-width"
              placeholder="订单编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input
              v-model="filterConditions.receiverKeyword"
              class="input-width"
              placeholder="收货人姓名/手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker
              class="input-width"
              v-model="filterConditions.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select
              v-model="filterConditions.status"
              class="input-width"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单分类：">
            <el-select
              v-model="filterConditions.orderType"
              class="input-width"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源：">
            <el-select
              v-model="filterConditions.sourceType"
              class="input-width"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in sourceTypeOptions"
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
  name: "OrderSearch",
  data() {
    return {
      defaultConditions: {
        orderSn: null,
        receiverKeyword: null,
        createTime: null,
        status: null,
        orderType: null,
        sourceType: null,
      },
      filterConditions: {
        orderSn: null,
        receiverKeyword: null,
        createTime: null,
        status: null,
        orderType: null,
        sourceType: null,
      },
      // 订单状态选项
      statusOptions: [
        {
          label: "待付款",
          value: 0,
        },
        {
          label: "待发货",
          value: 1,
        },
        {
          label: "已发货",
          value: 2,
        },
        {
          label: "已完成",
          value: 3,
        },
        {
          label: "已关闭",
          value: 4,
        },
      ],

      // 订单类型选项
      orderTypeOptions: [
        {
          label: "正常订单",
          value: 0,
        },
        {
          label: "秒杀订单",
          value: 1,
        },
      ],

      // 订单来源选项
      sourceTypeOptions: [
        {
          label: "PC订单",
          value: 0,
        },
        {
          label: "APP订单",
          value: 1,
        },
      ],
    };
  },
  methods: {
    // 重置
    handleResetSearch() {
      this.filterConditions = this.defaultConditions;
    },

    // 查询结果
    handleSearchList() {
      this.$emit("searchResult", Object.assign({}, this.filterConditions));
    },
  },
};
</script>

<style lang="less" scoped>
.el-icon-search {
  margin-right: 5px;
}
.input-width {
  width: 203px;
}
</style>