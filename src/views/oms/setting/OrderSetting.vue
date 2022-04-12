<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-12 15:15:29
 * @FilePath: \vue_manage\src\views\oms\setting\OrderSetting.vue
-->
<template>
   
  <div class="order-setting">
    <el-card class="form-container" shadow="never">
      <el-form
        :model="orderSetting"
        ref="orderSettingForm"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="秒杀订单超过：" prop="flashOrderOvertime">
          <el-input
            v-model="orderSetting.flashOrderOvertime"
            class="input-width"
          >
            <template slot="append">分</template>
          </el-input>
          <span class="note-margin">未付款，订单自动关闭</span>
        </el-form-item>
        <el-form-item label="正常订单超过：" prop="normalOrderOvertime">
          <el-input
            v-model="orderSetting.normalOrderOvertime"
            class="input-width"
          >
            <template slot="append">分</template>
          </el-input>
          <span class="note-margin">未付款，订单自动关闭</span>
        </el-form-item>
        <el-form-item label="发货超过：" prop="confirmOvertime">
          <el-input v-model="orderSetting.confirmOvertime" class="input-width">
            <template slot="append">天</template>
          </el-input>
          <span class="note-margin">未收货，订单自动完成</span>
        </el-form-item>
        <el-form-item label="订单完成超过：" prop="finishOvertime">
          <el-input v-model="orderSetting.finishOvertime" class="input-width">
            <template slot="append">天</template>
          </el-input>
          <span class="note-margin">自动结束交易，不能申请售后</span>
        </el-form-item>
        <el-form-item label="订单完成超过：" prop="commentOvertime">
          <el-input v-model="orderSetting.commentOvertime" class="input-width">
            <template slot="append">天</template>
          </el-input>
          <span class="note-margin">自动五星好评</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="confirm('orderSettingForm')" type="primary"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { orderSettingApi } from "@/api/order";

export default {
  name: "OrderSetting",
  data() {
    return {
      orderSetting: {
        id: null,
        flashOrderOvertime: 0,
        normalOrderOvertime: 0,
        confirmOvertime: 0,
        finishOvertime: 0,
        commentOvertime: 0,
      },
      rules: {
        flashOrderOvertime: { validator: this.checkTime, trigger: "blur" },
        normalOrderOvertime: { validator: this.checkTime, trigger: "blur" },
        confirmOvertime: { validator: this.checkTime, trigger: "blur" },
        finishOvertime: { validator: this.checkTime, trigger: "blur" },
        commentOvertime: { validator: this.checkTime, trigger: "blur" },
      },
    };
  },
  created() {
    this.getOrderSetting();
  },
  methods: {
    // 获取订单设置
    getOrderSetting() {
      orderSettingApi().then((response) => {
        this.orderSetting = response.data;
      });
    },

    // 校验
    checkTime(rule, value, callback) {
      if (!value) {
        return callback(new Error("时间不能为空"));
      }
      console.log("checkTime", value);
      let intValue = parseInt(value);
      if (!Number.isInteger(intValue)) {
        return callback(new Error("请输入数字值"));
      }
      callback();
    },

    // 提交
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否要提交修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.$message({
              type: "success",
              message: "提交成功!",
            });
          });
        } else {
          this.$message({
            message: "提交参数不合法",
            type: "warning",
          });
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.order-setting {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  .form-container {
    width: 720px;
    padding: 40px;
  }
  .input-width {
    width: 50%;
  }

  .note-margin {
    margin-left: 15px;
  }
}
</style>


