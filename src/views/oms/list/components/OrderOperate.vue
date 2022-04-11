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
      <i class="el-icon-warning color-danger"></i>
      <span class="color-danger"
        >当前订单状态：{{ order.status | formatStatus }}</span
      >

      <!-- 待付款 -->
      <div class="operate-button-container" v-show="order.status === 0">
        <el-button size="mini" @click="showUpdateReceiverDialog"
          >修改收货人信息</el-button
        >
        <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
        <el-button size="mini" @click="showCloseOrderDialog"
          >关闭订单</el-button
        >
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>

      <!-- 待发货 -->
      <div class="operate-button-container" v-show="order.status === 1">
        <el-button size="mini" @click="showUpdateReceiverDialog"
          >修改收货人信息</el-button
        >
        <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
        <el-button size="mini" @click="handleCancelOrder">取消订单</el-button>
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>

      <!-- 已发货/已完成 -->
      <div
        class="operate-button-container"
        v-show="order.status === 2 || order.status === 3"
      >
        <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
        <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>

      <!-- 已关闭 -->
      <div class="operate-button-container" v-show="order.status === 4">
        <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
        <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
      </div>
    </div>

    <!-- 修改收货人信息 -->
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

    <!-- 发送站内信 -->
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

    <!-- 关闭订单 -->
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

    <!-- 备注订单 -->
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

    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>

<script>
import LogisticsDialog from "@/views/oms/list/components/LogisticsDialog.vue";
import VDistpicker from "v-distpicker";
export default {
  name: "OrderOperate",
  components: {
    VDistpicker,
    LogisticsDialog,
  },
  props: {
    order: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      receiverInfo: {},
      receiverDialogVisible: false,
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
    // 修改收货人信息
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

    // 发送站内信
    showMessageDialog() {
      this.messageDialogVisible = true;
      this.message.title = null;
      this.message.content = null;
    },

    // 关闭订单
    showCloseOrderDialog() {
      this.closeDialogVisible = true;
      this.closeInfo.note = null;
      this.closeInfo.id = this.id;
    },

    // 备注订单
    showMarkOrderDialog() {
      this.markOrderDialogVisible = true;
      this.markInfo.id = this.id;
    },

    // 订单跟踪
    showLogisticsDialog() {
      this.logisticsDialogVisible = true;
    },

    // 区域选择
    onSelectRegion(data) {
      this.receiverInfo.receiverProvince = data.province.value;
      this.receiverInfo.receiverCity = data.city.value;
      this.receiverInfo.receiverRegion = data.area.value;
    },

    // 发送站内信
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

    // 关闭订单
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
        this.$router.back();
      });
    },

    // 取消订单
    handleCancelOrder() {
      this.$confirm("是否要取消?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.closeDialogVisible = false;
        this.$message({
          type: "success",
          message: "订单关取消成功!",
        });
        this.$router.back();
      });
    },

    // 删除订单
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

    // 备注订单
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

    // 修改收货信息
    handleUpdateReceiverInfo() {
      this.$confirm("是否要修改收货信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.receiverDialogVisible = false;
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.$emit("updateReceiverInfo", this.receiverInfo);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.operate-container {
  background: #f2f6fc;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}
.operate-button-container {
  float: right;
  margin-right: 20px;
}
.el-icon-warning {
  margin-left: 20px;
  margin-right: 5px;
}
.color-danger {
  color: #f56c6c;
}
</style>