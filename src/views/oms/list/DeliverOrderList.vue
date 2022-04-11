<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-11 21:47:33
 * @FilePath: \vue_manage\src\views\oms\list\DeliverOrderList.vue
-->
<template>
  <div class="deliver-order-list">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="deliverOrderTable"
        style="width: 100%"
        :data="deliverList"
        border
      >
        <el-table-column label="订单编号" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="收货人" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.receiverName }}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.receiverPhone }}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.receiverPostCode
          }}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="配送方式" width="160" align="center">
          <template slot-scope="scope">
            <el-select
              placeholder="请选择物流公司"
              v-model="scope.row.deliveryCompany"
              size="small"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="180" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px; text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DeliverOrderList",
  data() {
    return {
      deliverList: this.$route.params.deliverList,
      companyOptions: ["顺丰快递", "圆通快递", "中通快递", "韵达快递"],
    };
  },
  methods: {
    cancel() {
      this.$router.back();
    },
    confirm() {
      let temp1 = this.checkDeliveryCompany();
      if (temp1.length) {
        this.$message({
          type: "warning",
          message: `${temp1}，配送方式不能为空！`,
        });
        return;
      }

      let temp2 = this.checkDeliverySn();
      if (this.checkDeliverySn().length) {
        this.$message({
          type: "warning",
          message: `${temp2}，物流单号不能为空！`,
        });
        return;
      }

      this.$confirm("是否要进行发货操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          {
            this.$message({
              type: "success",
              message: "发货成功!",
            });
            this.$router.back();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发货",
          });
        });
    },
    checkDeliverySn() {
      let temp = [];
      this.deliverList.forEach((element) => {
        if (!element.deliverySn) {
          temp.push(element.orderSn);
        }
      });
      return temp;
    },
    checkDeliveryCompany() {
      let temp = [];
      this.deliverList.forEach((element) => {
        console.log(element.deliveryCompany);
        if (!element.deliveryCompany) {
          temp.push(element.orderSn);
        }
      });
      return temp;
    },
  },
};
</script>
<style></style>


