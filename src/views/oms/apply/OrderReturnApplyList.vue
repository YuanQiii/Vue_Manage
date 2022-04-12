<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-12 15:46:01
 * @FilePath: \vue_manage\src\views\oms\apply\OrderReturnApplyList.vue
-->
<template>
  <div class="order-return-apply-list">
    <apply-filter @searchResult="searchResult" />

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <div class="table-container">
      <el-table
        ref="returnApplyTable"
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
        <el-table-column label="服务单号" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="180" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{ scope.row.memberUsername }}</template>
        </el-table-column>
        <el-table-column label="退款金额" width="180" align="center">
          <template slot-scope="scope"
            >￥{{ scope.row | formatReturnAmount }}</template
          >
        </el-table-column>
        <el-table-column label="申请状态" width="180" align="center">
          <template slot-scope="scope">{{
            scope.row.status | formatStatus(statusOptions)
          }}</template>
        </el-table-column>
        <el-table-column label="处理时间" width="180" align="center">
          <template slot-scope="scope">{{
            scope.row.handleTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewDetail(scope.$index, scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
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
        :current-page.sync="pageConfig.pageNum"
        :page-size="pageConfig.pageSize"
        :page-sizes="[5, 10, 15]"
        :total="returnApplyList.length"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import ApplyFilter from "./components/ApplyFilter.vue";
import { orderRetuenApplyListApi } from "@/api/order";

export default {
  components: { ApplyFilter },
  name: "OrderReturnApplyList",
  data() {
    return {
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
      returnApplyList: [],
      listLoading: false,
      multipleSelection: [],
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
      },
      filterConditions: {},
      operateType: 1,
      operateOptions: [
        {
          label: "批量删除",
          value: 1,
        },
      ],
    };
  },
  created() {
    this.getOrderReturnApplyList();
  },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },

    formatStatus(status, statusOptions) {
      let temp = "";
      statusOptions.forEach((element) => {
        if (status == element.value) {
          temp = element.label;
        }
      });
      return temp;
    },

    formatReturnAmount(row) {
      return row.productRealPrice * row.productCount;
    },
  },
  computed: {
    // 当前展示数据列表
    currentList() {
      let temp = [];
      let start = (this.pageConfig.pageNum - 1) * this.pageConfig.pageSize;
      let end = this.pageConfig.pageNum * this.pageConfig.pageSize;
      let max = this.returnApplyList.length;
      end = end > max ? max : end;

      this.returnApplyList.slice(start, end).forEach((element) => {
        let flags = [];
        Object.keys(this.filterConditions).forEach((key) => {
          let value = this.filterConditions[key];

          if (value != null && (value === 0 || value != "")) {
            if (value == 0) {
              if (element[key] == value) {
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
      });
      return temp;
    },
  },
  methods: {
    searchResult(value) {
      this.filterConditions = value;
      console.log(value);
    },

    // 获取退货申请列表
    getOrderReturnApplyList() {
      this.listLoading = true;
      orderRetuenApplyListApi().then((response) => {
        this.listLoading = false;
        this.returnApplyList = response.data.list;
      });
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 退货申请详情
    handleViewDetail(index, row) {
      this.$router.push({
        path: "/oms/returnApplyDetail",
        query: { id: row.id },
      });
    },

    // 批量操作
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的申请",
          type: "warning",
        });
        return;
      }
      if (this.operateType === 1) {
        //批量删除
        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let temp = [];
          this.returnApplyList.forEach((element) => {
            temp.push(element);
            this.multipleSelection.forEach((item) => {
              if (item.id == element.id) {
                temp.pop();
              }
            });
          });
          this.returnApplyList = temp;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      }
    },

    // 列表展示数量
    handleSizeChange(val) {
      this.pageConfig.pageNum = 1;
      this.pageConfig.pageSize = val;
    },

    // 改变页码
    handleCurrentChange(val) {
      this.pageConfig.pageNum = val;
    },
  },
};
</script>
<style scoped>
</style>


