<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-12 15:49:31
 * @FilePath: \vue_manage\src\views\oms\apply\components\ApplyFilter.vue
-->
<template>
  <div class="apply-filter">
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
              v-model="filterConditions.id"
              class="input-width"
              placeholder="服务单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="处理状态：">
            <el-select
              v-model="filterConditions.status"
              placeholder="全部"
              clearable
              class="input-width"
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
          <el-form-item label="申请时间：">
            <el-date-picker
              class="input-width"
              v-model="filterConditions.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作人员：">
            <el-input
              v-model="filterConditions.handleMan"
              class="input-width"
              placeholder="全部"
            ></el-input>
          </el-form-item>
          <el-form-item label="处理时间：">
            <el-date-picker
              class="input-width"
              v-model="filterConditions.handleTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ApplyFilter",
  data() {
    return {
      defaultFilterConditions: {
        id: null,
        receiverKeyword: null,
        status: null,
        createTime: null,
        handleMan: null,
        handleTime: null,
      },
      filterConditions: Object.assign({}, this.defaultFilterConditions),
      statusOptions: [
        {
          label: "待处理",
          value: 0,
        },
        {
          label: "退货中",
          value: 1,
        },
        {
          label: "已完成",
          value: 2,
        },
        {
          label: "已拒绝",
          value: 3,
        },
      ],
    };
  },
  filters: {},
  methods: {
    // 搜索
    handleSearchList() {
      this.$emit("searchResult", Object.assign({}, this.filterConditions));
    },

    // 重置
    handleResetSearch() {
      this.filterConditions = {};
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