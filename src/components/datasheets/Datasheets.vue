<template>
  <div class="datasheets">
    <filter-search
      :filter-data="filterData"
      @handleReset="handleReset"
      @handleSearch="handleSearch"
    >
    </filter-search>

    <data-operate :operate-data="operateData" class="data-operate" />

    <slot :tableData="tableData" />

    <div class="bottom">
      <batch-operate
        class="batch-operate"
        :batch-operate-options="batchOperateOptions"
        @handleBatchOperate="handleBatchOperate"
        v-if="batchOperateOptions.length !== 0"
      />
      <pagination
        :layout="layout"
        :total="total"
        :page-config="pageConfig"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import FilterSearch from "@/components/datasheets/FilterSearch";
import DataOperate from "@/components/datasheets/DataOperate";
import BatchOperate from "@/components/datasheets/BatchOperate";
import Pagination from "@/components/datasheets/Pagination";

export default {
  name: "Datasheets",
  components: { BatchOperate, DataOperate, FilterSearch, Pagination },
  props: {
    allData: {
      type: Array,
      default: () => [],
    },

    filterData: {
      type: Object,
      default: () => ({}),
    },
    operateData: {
      type: Array,
      default: () => [],
    },

    batchOperateOptions: {
      type: Array,
      default: () => [],
    },

    total: {
      type: Number,
      default: 0,
    },
    pageConfig: {
      type: Object,
      default: () => ({
        pageNum: 1,
        pageSize: 10,
      }),
    },
    layout: {
      type: String,
      default: "total, sizes ,prev, pager, next, jumper",
    },
  },
  data() {
    return {
      filterConditions: {},
      tableData: [],
    };
  },

  // 监听展示的全部数据列表获取状态
  watch: {
    allData(newValue) {
      this.tableData = this.handleData(
        newValue,
        this.pageConfig,
        this.filterConditions
      );
    },
  },
  methods: {
    // 重置
    handleReset(value) {
      this.filterConditions = value;
    },

    // 搜索
    handleSearch(value) {
      this.filterConditions = value;
      this.tableData = this.handleData();
      console.log(this.tableData)
    },

    // 批量操作
    handleBatchOperate(value) {
      this.$emit("handleBatchOperate", value);
    },

    // 改变展示数量
    handleSizeChange(value) {
      this.pageConfig = value;
      this.tableData = this.handleData();
    },

    // 改变当前页
    handleCurrentChange(value) {
      this.pageConfig = value;
      this.tableData = this.handleData();
    },

    // 处理数据
    handleData() {
      let temp = [];
      let start = (this.pageConfig.pageNum - 1) * this.pageConfig.pageSize;
      let end = this.pageConfig.pageNum * this.pageConfig.pageSize;
      let max = this.allData.length;
      end = end > max ? max : end;

      this.allData.slice(start, end).forEach((element) => {
        let flags = [];
        let keys = Object.keys(this.filterConditions);
        if (keys.length) {
          keys.forEach((key) => {
            let value = this.filterConditions[key];
            if (value != null && (value === 0 || value !== "")) {
              if (typeof value === "number") {
                if (element[key] === value) {
                  flags.push(true);
                } else {
                  flags.push(false);
                }
              }
              else if(Array.isArray(value)){
                if(element[key] === value[1]){
                  flags.push(true);
                }else{
                  flags.push(false)
                }
              }else {
                if (element[key] != null && element[key].includes(value)) {
                  flags.push(true);
                } else {
                  flags.push(false);
                }
              }
            }
            else {
              flags.push(true);
            }
          });
          if (flags.every((value) => value)) {
            temp.push(element);
          }
        } else {
          temp.push(element);
        }
      });

      temp.sort((a, b) => {
        return b.sort - a.sort;
      });

      return temp;
    },
  },
};
</script>

<style lang="less" scoped>
.datasheets {
  .data-operate {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 40px;
    .batch-operate {
      margin-right: 40px;
    }
  }
}
</style>