<template>
  <div class="order-orderList">
    <datasheets :all-data="allData" :total="allData.length" :filter-data="filterData" :batch-operate-options="batchOperateOptions" :multiple-selection="multipleSelection">
      <template v-slot="prop">
        <el-table
            :data="prop.tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border
        >
          <el-table-column
              type="selection"
              width="60"
              align="center"
          ></el-table-column>
          <el-table-column prop="id" label="编号" width="100" align="center"/>
          <el-table-column prop="orderSn" label="编号" width="180" align="center"/>
          <el-table-column label="提交时间" width="180" align="center">
            <template v-slot="scope">
              {{scope.row.createTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column prop="memberUsername" label="用户账户" align="center"/>
          <el-table-column label="订单金额" width="120" align="center">
            <template v-slot="scope">
            {{`￥${scope.row.totalAmount}`}}
          </template></el-table-column>
          <el-table-column label="支付方式" width="120" align="center">
            <template v-slot="scope">
              {{scope.row.payType | formatPayType}}
            </template>
          </el-table-column>
          <el-table-column label="订单来源" width="120" align="center">
            <template v-slot="scope">
              {{scope.row.sourceType | formatSourceType}}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" align="center">
            <template v-slot="scope">
              {{scope.row.status | formatStatus}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template v-slot="scope">
              <el-button
                  size="mini"
                  @click="handleViewOrder(scope.row)"
              >查看订单
              </el-button>
              <el-button
                  size="mini"
                  @click="handleCloseOrder(scope.row)"
                  v-show="scope.row.status === 0"
              >关闭订单
              </el-button>
              <el-button
                  size="mini"
                  @click="handleDeliveryOrder(scope.row)"
                  v-show="scope.row.status === 1"
              >订单发货
              </el-button>
              <el-button
                  size="mini"
                  @click="handleTrackOrder(scope.row)"
                  v-show="scope.row.status === 2 || scope.row.status === 3"
              >订单跟踪
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteOrder(scope.row)"
                  v-show="scope.row.status === 4"
              >删除订单
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>

    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import {formatDate} from "@/utils/date";
import {orderListApi} from "@/api/order";

import LogisticsDialog from "@/views/oms/list/components/LogisticsDialog";
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  name: "OrderList",
  components: {Datasheets, LogisticsDialog},
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: '订单编号',
            placeholder: '请输入订单编号',
            keyword: 'orderSn'
          },
          {
            label: '收货人',
            placeholder: '请输入收货人',
            keyword: 'memberUsername'
          },
        ],
        select: [
          {
            label: '订单状态',
            placeholder: '全部',
            keyword: 'status',
            options: [
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
            ]
          },
          {
            label: '订单分类',
            placeholder: '全部',
            keyword: 'orderType',
            options: [
              {
                label: "正常订单",
                value: 0,
              },
              {
                label: "秒杀订单",
                value: 1,
              },
            ]
          },
          {
            label: '订单来源',
            placeholder: '全部',
            keyword: 'payType',
            options: [
              {
                label: "PC订单",
                value: 0,
              },
              {
                label: "APP订单",
                value: 1,
              },
            ]
          },
        ],
        date: [
          {
            label: '提交时间',
            placeholder: '请选择时间',
            keyword: 'createTime'
          }
        ]
      },
      batchOperateOptions: [
        {
          label: '批量发货',
          key: 'status',
          value: 2
        },
        {
          label: '删除订单',
          key: 'delete',
          value: 1
        },
      ],
      multipleSelection: [],

      // 订单跟踪弹窗
      logisticsDialogVisible: false,
    };
  },
  created() {
    this.getOrderList();
  },
  filters: {
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

  methods: {
    // 获取订单列表
    getOrderList() {
      orderListApi().then((response) => {
        this.allData = response.data;
      });
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 跳转到订单详情
    handleViewOrder(row) {
      this.$router.push({path: "/oms/orderDetail", query: {id: row.id}});
    },

    // 关闭订单
    handleCloseOrder(row){
      console.log(row)
    },

    // 跳转到订单发货页面
    handleDeliveryOrder(row) {
      let deliverList = this.covertOrder(row);
      this.$router.push({
        path: 'deliverOrderList',
        query: deliverList
      })
    },

    // 展示订单跟踪弹窗
    handleTrackOrder(row) {
      this.logisticsDialogVisible = true;
    },

    // 删除订单按钮
    handleDeleteOrder(row) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$message({
          message: "删除成功！",
          type: "success",
        });
      });
    },

    // 转换订单地址格式
    covertOrder(order) {
      return {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: `${order.receiverProvince}${order.receiverCity}${order.receiverRegion}${order.receiverDetailAddress}`,
        deliveryCompany: null,
        deliverySn: null,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.order-orderList {
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


