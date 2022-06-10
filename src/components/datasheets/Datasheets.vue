<template>
  <div class="datasheets">
    <filter-search :filter-data="filterData"
                   @handleReset="handleReset"
                   @handleSearch="handleSearch">
    </filter-search>

    <data-operate :operate-data="operateData" class="data-operate"/>

<!--    <slot :tableData="tableData" />-->

    <data-table :table-data="tableData" :table-data-structure="tableDataStructure"  />

    <div class="bottom">
      <batch-operate class="batch-operate"
                     :batch-operate-options="batchOperateOptions"
                     @handleBatchOperate="handleBatchOperate"
                     v-if="batchOperateOptions.length !== 0"/>
      <pagination :layout="layout" :total="total" :page-config="pageConfig" @handleSizeChange="handleSizeChange"/>
    </div>

  </div>
</template>

<script>
import FilterSearch from "@/components/datasheets/FilterSearch";
import DataOperate from "@/components/datasheets/DataOperate";
import BatchOperate from "@/components/datasheets/BatchOperate";
import Pagination from "@/components/datasheets/Pagination";
import DataTable from "@/components/datasheets/DataTable";

export default {
  name: "Datasheets",
  components: {DataTable, BatchOperate, DataOperate, FilterSearch, Pagination},
  props: {
    allData: {
      type: Array,
      default: () => []
    },

    filterData: {
      type: Object,
      default: () => ({})
    },
    operateData: {
      type: Array,
      default: () => []
    },

    batchOperateOptions: {
      type: Array,
      default: () => []
    },

    tableDataStructure: {
      type: Array,
      default: () => []
    },

    total: {
      type: Number,
      default: 0
    },
    pageConfig: {
      type: Object,
      default: () => ({
        pageNum: 1,
        pageSize: 10,
      })
    },
    layout: {
      type: String,
      default: "total, sizes ,prev, pager, next, jumper",
    },

  },
  data() {
    return {
      filterConditions: {},
      tableData: []
    }
  },

  // 监听展示的全部数据列表获取状态
  watch: {
    allData(newValue){
      this.tableData = this.handleData(newValue, this.pageConfig, this.filterConditions)
    }
  },
  methods: {

    // 重置
    handleReset(value) {
      this.filterConditions = value
    },

    // 搜索
    handleSearch(value) {
      this.filterConditions = value
      this.tableData = this.handleData(this.allData, this.pageConfig, this.filterConditions)
    },

    // 批量操作
    handleBatchOperate(value){
      this.$emit('handleBatchOperate', value)
    },

    // 改变展示数量
    handleSizeChange(value){
      this.$emit('handleSizeChange', value)
    },

    // 改变当前页
    handleCurrentChange(value){
      this.$emit('handleCurrentChange', value)
    },

    // 处理数据
    handleData(list, pageConfig, filterConditions) {
      let temp = [];
      let start = (pageConfig.pageNum - 1) * pageConfig.pageSize;
      let end = pageConfig.pageNum * pageConfig.pageSize;
      let max = this.allData.length;
      end = end > max ? max : end;

      list.slice(start, end).forEach((element) => {
        let flags = [];
        let keys = Object.keys(filterConditions)
        if (keys.length) {
          keys.forEach((key) => {
            let value = filterConditions[key];

            if (value != null && (value === 0 || value !== "")) {
              if (typeof value == 'number') {
                if (element[key] === value) {
                  flags.push(true);
                } else {
                  flags.push(false);
                }
              } else {
                if (element[key] != null && element[key].includes(value)) {
                  flags.push(true);
                } else {
                  flags.push(false);
                }
              }
            } else {
              flags.push(true);
            }
          });
          if (flags.every((value) => value)) {
            temp.push(element);
          }
        } else {
          temp.push(element)
        }

      });

      temp.sort((a, b) => {
        return b.sort - a.sort
      })

      return temp;
    }
  }
}
</script>

<style lang="less" scoped>
.datasheets{
  .data-operate{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .bottom{
    display: flex;
    justify-content: end;
    margin-top: 20px;
    .batch-operate{
      margin-right: 40px;
    }
  }
}
</style>