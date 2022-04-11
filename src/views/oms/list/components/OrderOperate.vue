<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-11 16:37:44
 * @FilePath: \vue_manage\src\views\oms\list\components\OrderOperate.vue
-->
<template>
  <div class="order-operate">
    <!-- 当前订单状态操作 -->
    <div class="operate-container">
      <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
      <span class="color-danger"
        >当前订单状态：{{ order.status | formatStatus }}</span
      >
      <div class="operate-button-container" v-show="order.status === 0">
        <el-button size="mini" @click="showUpdateReceiverDialog"
          >修改收货人信息</el-button
        >
        <el-button size="mini">修改商品信息</el-button>
        <el-button size="mini" @click="showUpdateMoneyDialog"
          >修改费用信息</el-button
        >
        <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
        <el-button size="mini" @click="showCloseOrderDialog"
          >关闭订单</el-button
        >
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>
      <div class="operate-button-container" v-show="order.status === 1">
        <el-button size="mini" @click="showUpdateReceiverDialog"
          >修改收货人信息</el-button
        >
        <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
        <el-button size="mini">取消订单</el-button>
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>
      <div
        class="operate-button-container"
        v-show="order.status === 2 || order.status === 3"
      >
        <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
        <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>
      <div class="operate-button-container" v-show="order.status === 4">
        <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>
    </div>

    <el-dialog
      title="修改收货人信息"
      :visible.sync="receiverDialogVisible"
      width="40%"
    >
      <el-form :model="receiverInfo" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input
            v-model="receiverInfo.receiverName"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input
            v-model="receiverInfo.receiverPostCode"
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker
            :province="receiverInfo.receiverProvince"
            :city="receiverInfo.receiverCity"
            :area="receiverInfo.receiverRegion"
            @selected="onSelectRegion"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input
            v-model="receiverInfo.receiverDetailAddress"
            type="textarea"
            rows="3"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiverDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateReceiverInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="修改费用信息"
      :visible.sync="moneyDialogVisible"
      width="40%"
    >
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell"
            >￥{{ order.totalAmount }}</el-col
          >
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="mini"
              ><template slot="prepend">￥</template></el-input
            >
          </el-col>
          <el-col :span="6" class="table-cell"
            >-￥{{ order.couponAmount }}</el-col
          >
          <el-col :span="6" class="table-cell"
            >-￥{{ order.integrationAmount }}</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell"
            >-￥{{ order.promotionAmount }}</el-col
          >
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"
              ><template slot="prepend">-￥</template></el-input
            >
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger"
              >￥{{ order.totalAmount + moneyInfo.freightAmount }}</span
            >
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger"
              >￥{{
                order.payAmount +
                moneyInfo.freightAmount -
                moneyInfo.discountAmount
              }}</span
            >
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateMoneyInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="发送站内信"
      :visible.sync="messageDialogVisible"
      width="40%"
    >
      <el-form :model="message" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭订单" :visible.sync="closeDialogVisible" width="40%">
      <el-form :model="closeInfo" label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备注订单"
      :visible.sync="markOrderDialogVisible"
      width="40%"
    >
      <el-form :model="markInfo" label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
export default {
  name: "OrderOperate",
  components: {
    VDistpicker,
  },
  props: {
    order: {
      type: Object,
      default: {},
    },
    receiverInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      defaultReceiverInfo: {
        orderId: null,
        receiverName: null,
        receiverPhone: null,
        receiverPostCode: null,
        receiverDetailAddress: null,
        receiverProvince: null,
        receiverCity: null,
        receiverRegion: null,
        status: null,
      },
      receiverInfo: Object.assign({}, this.defaultReceiverInfo),
      receiverDialogVisible: false,
      moneyDialogVisible: false,
      moneyInfo: {
        orderId: null,
        freightAmount: 0,
        discountAmount: 0,
        status: null,
      },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null },
      logisticsDialogVisible: false,
    };
  },
  filters: {
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
    showUpdateReceiverDialog() {
      this.receiverDialogVisible = true;
      this.receiverInfo = {
        orderId: this.order.id,
        receiverName: this.order.receiverName,
        receiverPhone: this.order.receiverPhone,
        receiverPostCode: this.order.receiverPostCode,
        receiverDetailAddress: this.order.receiverDetailAddress,
        receiverProvince: this.order.receiverProvince,
        receiverCity: this.order.receiverCity,
        receiverRegion: this.order.receiverRegion,
        status: this.order.status,
      };
    },
    showUpdateMoneyDialog() {
      this.moneyDialogVisible = true;
      this.moneyInfo.orderId = this.order.id;
      this.moneyInfo.freightAmount = this.order.freightAmount;
      this.moneyInfo.discountAmount = this.order.discountAmount;
      this.moneyInfo.status = this.order.status;
    },
    showMessageDialog() {
      this.messageDialogVisible = true;
      this.message.title = null;
      this.message.content = null;
    },
    showCloseOrderDialog() {
      this.closeDialogVisible = true;
      this.closeInfo.note = null;
      this.closeInfo.id = this.id;
    },
    showMarkOrderDialog() {
      this.markOrderDialogVisible = true;
      this.markInfo.id = this.id;
      this.closeOrder.note = null;
    },
    showLogisticsDialog() {
      this.logisticsDialogVisible = true;
    },
    onSelectRegion(data) {
      this.receiverInfo.receiverProvince = data.province.value;
      this.receiverInfo.receiverCity = data.city.value;
      this.receiverInfo.receiverRegion = data.area.value;
    },
    handleUpdateMoneyInfo() {
      this.$confirm("是否要修改费用信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        updateMoneyInfo(this.moneyInfo).then((response) => {
          this.moneyDialogVisible = false;
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        });
      });
    },
    handleSendMessage() {
      this.$confirm("是否要发送站内信?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.messageDialogVisible = false;
        this.$message({
          type: "success",
          message: "发送成功!",
        });
      });
    },
    handleCloseOrder() {
      this.$confirm("是否要关闭?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.closeDialogVisible = false;
        this.$message({
          type: "success",
          message: "订单关闭成功!",
        });
      });
    },
    handleDeleteOrder() {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$message({
          message: "删除成功！",
          type: "success",
          duration: 1000,
        });
        this.$router.back();
      });
    },
    handleMarkOrder() {
      this.$confirm("是否要备注订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.markOrderDialogVisible = false;
        this.$message({
          type: "success",
          message: "订单备注成功!",
        });
      });
    },
  },
};
</script>

<style>
</style>