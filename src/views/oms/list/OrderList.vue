<template>
   
  <div class="order-orderList">
    <order-search @searchResult="searchResult" />

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
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
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatCreateTime
          }}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{ scope.row.memberUsername }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template slot-scope="scope">￥{{ scope.row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template slot-scope="scope">{{
            scope.row.payType | formatPayType
          }}</template>
        </el-table-column>
        <el-table-column label="订单来源" width="120" align="center">
          <template slot-scope="scope">{{
            scope.row.sourceType | formatSourceType
          }}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{
            scope.row.status | formatStatus
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
              >查看订单</el-button
            >
            <el-button
              size="mini"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 0"
              >关闭订单</el-button
            >
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 1"
              >订单发货</el-button
            >
            <el-button
              size="mini"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status === 2 || scope.row.status === 3"
              >订单跟踪</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 4"
              >删除订单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="bottom">
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
          :total="orderList.length"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrder.dialogVisible"
      width="30%"
    >
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.content"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/list/components/LogisticsDialog";

import { orderListApi } from "@/api/order";
import OrderSearch from "./components/OrderSearch.vue";

export default {
  name: "OrderList",
  components: { LogisticsDialog, OrderSearch },
  data() {
    return {
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
      },
      listLoading: true,
      orderList: [],
      operateType: null,
      multipleSelection: [],
      filterConditions: {},

      // 关闭订单跟踪
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: [],
      },

      // 订单操作选项
      operateOptions: [
        {
          label: "批量发货",
          value: 1,
        },
        {
          label: "删除订单",
          value: 2,
        },
      ],

      // 订单跟踪弹窗
      logisticsDialogVisible: false,
    };
  },
  created() {
    this.getOrderList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },

    formatPayType(value) {
      if (value === 1) {
        return "支付宝";
      } else if (value === 2) {
        return "微信";
      } else {
        return "未支付";
      }
    },

    formatSourceType(value) {
      if (value === 1) {
        return "APP订单";
      } else {
        return "PC订单";
      }
    },

    formatStatus(value) {
      if (value === 1) {
        return "待发货";
      } else if (value === 2) {
        return "已发货";
      } else if (value === 3) {
        return "已完成";
      } else if (value === 4) {
        return "已关闭";
      } else if (value === 5) {
        return "无效订单";
      } else {
        return "待付款";
      }
    },
  },
  computed: {
    currentList() {
      let temp = [];
      let start = (this.pageConfig.pageNum - 1) * this.pageConfig.pageSize;
      let end = this.pageConfig.pageNum * this.pageConfig.pageSize;
      let max = this.orderList.length;
      end = end > max ? max : end;

      this.orderList.slice(start, end).forEach((element) => {
        let flags = [];
        Object.keys(this.filterConditions).forEach((key) => {
          let value = this.filterConditions[key];
          if (value) {
            if (value == element[key]) {
              flags.push(true);
            } else {
              flags.push(false);
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
    // 筛选
    searchResult(value) {
      this.filterConditions = value;
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 跳转到订单详情
    handleViewOrder(index, row) {
      this.$router.push({ path: "/oms/orderDetail", query: { id: row.id } });
    },

    // 关闭订单跟踪
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },

    // 跳转到订单发货页面
    handleDeliveryOrder(index, row) {
      let listItem = this.covertOrder(row);
      this.$router.push({
        path: "/oms/deliverOrderList",
        query: { orderList: [listItem] },
      });
    },

    // 展示订单跟踪弹窗
    handleViewLogistics(index, row) {
      this.logisticsDialogVisible = true;
    },

    // 删除订单按钮
    handleDeleteOrder(index, row) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteOrder([row]);
      });
    },

    // 批量操作
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的订单",
          type: "warning",
        });
        return;
      }

      if (this.operateType === 1) {
        this.batchDeliverOrder();
      }
      if (this.operateType === 2) {
        this.batchDeleteOrder();
      }
    },

    // 批量发货
    batchDeliverOrder() {
      let selectOrderList = [];
      this.multipleSelection.forEach((element) => {
        if (element.status == 1) {
          selectOrderList.push(element);
        }
      });

      if (selectOrderList.length) {
        this.$message({
          message: "选中订单中没有可以发货的订单",
          type: "warning",
        });
        return;
      }

      this.$router.push({
        path: "/oms/deliverOrderList",
        query: { orderList: orderList },
      });
    },

    // 批量删除
    batchDeleteOrder() {
      let selectOrderList = [];
      this.multipleSelection.forEach((element) => {
        if (element.status == 4) {
          selectOrderList.push(element);
        }
      });

      if (!selectOrderList.length) {
        this.$message({
          message: "选中订单中没有可以删除的订单",
          type: "warning",
        });
        return;
      }

      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteOrder(selectOrderList);
      });
    },

    // 页面展示数量
    handleSizeChange(val) {
      this.pageConfig.pageNum = 1;
      this.pageConfig.pageSize = val;
      this.getOrderList();
    },

    // 改变页码
    handleCurrentChange(val) {
      this.pageConfig.pageNum = val;
      this.getOrderList();
    },

    handleCloseOrderConfirm() {
      if (this.closeOrder.content == null || this.closeOrder.content === "") {
        this.$message({
          message: "操作备注不能为空",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      let params = new URLSearchParams();
      params.append("ids", this.closeOrder.orderIds);
      params.append("note", this.closeOrder.content);
      closeOrder(params).then((response) => {
        this.closeOrder.orderIds = [];
        this.closeOrder.dialogVisible = false;
        this.getOrderList();
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },

    //   获取订单列表
    getOrderList() {
      this.listLoading = true;
      orderListApi().then((response) => {
        this.orderList = response.data;
        this.listLoading = false;
      });
    },

    //   删除订单
    deleteOrder(orders) {
      let temp = [];
      this.orderList.forEach((element) => {
        let flags = [];
        orders.forEach((item) => {
          if (element.id == item.id) {
            flags.push(false);
          } else {
            flags.push(true);
          }
        });
        if (flags.every((value) => value)) {
          temp.push(element);
        }
      });
      this.orderList = temp;

      this.$message({
        message: "删除成功！",
        type: "success",
      });
    },

    // 转换订单地址格式
    covertOrder(order) {
      let address =
        order.receiverProvince +
        order.receiverCity +
        order.receiverRegion +
        order.receiverDetailAddress;
      let listItem = {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: null,
        deliverySn: null,
      };
      return listItem;
    },
  },
};
</script>
<style lang="less" scoped>
.order-orderList {
  margin-left: 40px;
  margin: 40px;
  .operate-container {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 40px;
  }
}
</style>


