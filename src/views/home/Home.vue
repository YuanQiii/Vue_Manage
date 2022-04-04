<template>
  <div class="home">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon" />
            <div class="total-title">今日订单总数</div>
            <div class="total-value">{{ dayData.todayOrders }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon" />
            <div class="total-title">今日销售总额</div>
            <div class="total-value">
              {{ dayData.todaySales | moneyFormat }}
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon" />
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">
              {{ dayData.yesterdaySales | moneyFormat }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[0] }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[1] }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待确认收货订单</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[2] }})</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[3] }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">新缺货登记</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[4] }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退款申请</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[5] }})</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已发货订单</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[6] }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退货订单</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[7] }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">广告位即将到期</span>
              <span style="float: right" class="color-danger"
                >({{ affairsData[8] }})</span
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[0]
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[1]
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[2]
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[3]
                }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">库存紧张</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[4]
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[5]
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[6]
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  overviewData[7]
                }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399; font-size: 14px">本月订单总数</div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                {{ orderData["monthTotalOrders"] }}
              </div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #c0c4cc; font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px">
              <div style="color: #909399; font-size: 14px">本周订单总数</div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                {{ orderData["weekTotalOders"] }}
              </div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #c0c4cc; font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px">
              <div style="color: #909399; font-size: 14px">本月销售总额</div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                {{ orderData["monthTotalSales"] }}
              </div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #c0c4cc; font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px">
              <div style="color: #909399; font-size: 14px">本周销售总额</div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                {{ orderData["weekTotalSales"] }}
              </div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #c0c4cc; font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="20">
          <div style="padding: 10px; border-left: 1px solid #dcdfe6">
            <el-date-picker
              style="float: right; z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getData"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { str2Date } from "@/utils/date";

import { orderStatisticsApi, overviewApi, affairsApi } from "@/api/home";

import img_home_order from "@/assets/images/home_order.png";
import img_home_today_amount from "@/assets/images/home_today_amount.png";
import img_home_yesterday_amount from "@/assets/images/home_yesterday_amount.png";

export default {
  name: "Home",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2022);
              start.setMonth(3);
              start.setDate(23);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2022);
              start.setMonth(3);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      orderCountDate: "",
      orderStatistics: [],
      chartSettings: {
        xAxisType: "time",
        area: true,
        axisSite: { right: ["orderAmount"] },
        labelMap: { orderCount: "订单数量", orderAmount: "订单金额" },
      },
      chartData: {
        columns: [],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      orderData: {},
      dayData: {},
      overviewData: [],
      affairsData: [],
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount,
    };
  },
  created() {
    this.getOrderStatistics();
    this.getOverview();
    this.getAffairs();
  },
  methods: {
    // 获取订单统计
    getOrderStatistics() {
      orderStatisticsApi().then((response) => {
        this.orderStatistics = response.data;
        this.initOrderCountDate();
        this.getData();
        this.getOrderData();
        this.getDayData();
      });
    },

    // 获取总览数据
    getOverview() {
      overviewApi().then((response) => {
        let temp = [];
        response.data.forEach((element) => {
          temp.push(parseInt(element / 100000000000000));
        });
        this.overviewData = temp;
      });
    },

    getAffairs() {
      affairsApi().then((response) => {
        let temp = [];
        response.data.forEach((element) => {
          temp.push(parseInt(element / 100000000000000));
        });
        this.affairsData = temp;
      });
    },

    // 初始化当前订单统计表时间区间
    initOrderCountDate() {
      let start = new Date();
      start.setFullYear(2022);
      start.setMonth(3);
      start.setDate(23);
      const end = new Date();
      end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
      this.orderCountDate = [start, end];
    },

    // 获取区间内的统计数据
    getData() {
      this.chartData = {
        columns: ["date", "orderCount", "orderAmount"],
        rows: [],
      };

      this.orderStatistics.rows.forEach((element, index) => {
        let item = {};
        item["date"] = element["date"];
        item["orderCount"] = parseInt(element.orderCount / 100000000000000);
        item["orderAmount"] = parseInt(element.orderAmount / 1000000000000);

        let currDate = str2Date(item.date);
        let start = this.orderCountDate[0];
        let end = this.orderCountDate[1];
        if (
          currDate.getTime() >= start.getTime() &&
          currDate.getTime() <= end.getTime()
        ) {
          this.chartData.rows.push(item);
        }
      });

      this.dataEmpty = false;
      this.loading = false;
    },

    // 获取订单统计总合数据
    getOrderData() {
      let monthTotalOrders = 0;
      let weekTotalOders = 0;
      let monthTotalSales = 0;
      let weekTotalSales = 0;

      this.orderStatistics.rows.forEach((element, index) => {
        if (index < 7) {
          weekTotalOders += parseInt(element.orderCount / 100000000000000);
          weekTotalSales += parseInt(element.orderAmount / 1000000000000);
        }
        monthTotalOrders += parseInt(element.orderCount / 100000000000000);
        monthTotalSales += parseInt(element.orderAmount / 1000000000000);
      });

      this.orderData = {
        monthTotalOrders,
        monthTotalSales,
        weekTotalOders,
        weekTotalSales,
      };
    },

    // 获取昨日和今日数据
    getDayData() {
      this.dayData = {
        todayOrders: parseInt(
          this.orderStatistics.rows[15].orderCount / 100000000000000
        ),
        todaySales: parseInt(
          this.orderStatistics.rows[15].orderAmount / 1000000000000
        ),
        yesterdaySales: parseInt(
          this.orderStatistics.rows[14].orderAmount / 1000000000000
        ),
      };
    },
  },
};
</script>

<style lang='less' scoped>
.home {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
  padding-bottom: 40px;
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #f2f6fc;
    font-weight: bold;
  }

  .total-layout {
    margin-top: 20px;
    .total-frame {
      border: 1px solid #dcdfe6;
      padding: 20px;
      height: 65px;
      .total-icon {
        color: #409eff;
        width: 60px;
        height: 60px;
      }
      .total-title {
        position: relative;
        font-size: 16px;
        color: #909399;
        left: 70px;
        top: -50px;
      }
      .total-value {
        position: relative;
        font-size: 18px;
        color: #606266;
        left: 70px;
        top: -40px;
      }
    }
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #dcdfe6;

    .un-handle-item {
      border-bottom: 1px solid #ebeef5;
      padding: 10px;
    }
  }
}

.overview-layout {
  margin-top: 20px;
  .out-border {
    border: 1px solid #dcdfe6;
    .overview-item-value {
      font-size: 24px;
      text-align: center;
    }

    .overview-item-title {
      margin-top: 10px;
      text-align: center;
    }
  }
}
.statistics-layout {
  height: 468px;
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
</style>
