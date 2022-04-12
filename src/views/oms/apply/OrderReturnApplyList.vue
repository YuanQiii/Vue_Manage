<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-12 15:46:01
 * @FilePath: \vue_manage\src\views\oms\apply\OrderReturnApplyList.vue
-->
<template>
  <div class="order-return-apply-list">
    <apply-filter />

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <div class="table-container">
      <el-table
        ref="returnApplyTable"
        :data="returnApplyList"
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
            scope.row.status | formatStatus
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
      returnApplyList: null,
      listLoading: false,
      multipleSelection: [],
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
      },
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

    formatStatus(status) {
      for (let i = 0; i < this.statusOptions.length; i++) {
        if (status === this.statusOptions[i].value) {
          return this.statusOptions[i].label;
        }
      }
    },

    formatReturnAmount(row) {
      return row.productRealPrice * row.productCount;
    },
  },
  methods: {
    // 获取退货申请列表
    getOrderReturnApplyList() {
      this.listLoading = true;
      orderRetuenApplyListApi().then((response) => {
        this.listLoading = false;
        console.log(response.data);
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
          duration: 1000,
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
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      }
    },

    // 列表展示数量
    handleSizeChange(val) {
      this.filterConditions.pageNum = 1;
      this.filterConditions.pageSize = val;
    },

    // 改变页码
    handleCurrentChange(val) {
      this.filterConditions.pageNum = val;
    },
  },
};
</script>
<style scoped>
</style>


