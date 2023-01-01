<template>
  <div class="coupon-history">
    <!-- 优惠券详情 -->
    <div class="table-layout">
      <el-row>
        <el-col :span="4" class="table-cell-title">名称</el-col>
        <el-col :span="4" class="table-cell-title">优惠券类型</el-col>
        <el-col :span="4" class="table-cell-title">可使用商品</el-col>
        <el-col :span="4" class="table-cell-title">使用门槛</el-col>
        <el-col :span="4" class="table-cell-title">面值</el-col>
        <el-col :span="4" class="table-cell-title">状态</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{ coupon.name }}</el-col>
        <el-col :span="4" class="table-cell">{{
          coupon.type | formatType
        }}</el-col>
        <el-col :span="4" class="table-cell">{{
          coupon.useType | formatUseType
        }}</el-col>
        <el-col :span="4" class="table-cell"
          >满{{ coupon.minPoint }}元可用</el-col
        >
        <el-col :span="4" class="table-cell">{{ coupon.amount }}元</el-col>
        <el-col :span="4" class="table-cell">{{
          coupon.endTime | formatStatus
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell-title">有效期至</el-col>
        <el-col :span="4" class="table-cell-title">总发行量</el-col>
        <el-col :span="4" class="table-cell-title">已领取</el-col>
        <el-col :span="4" class="table-cell-title">待领取</el-col>
        <el-col :span="4" class="table-cell-title">已使用</el-col>
        <el-col :span="4" class="table-cell-title">未使用</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">
          {{ coupon.endTime | formatDate }}
        </el-col>
        <el-col :span="4" class="table-cell">{{ coupon.publishCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.receiveCount }}</el-col>
        <el-col :span="4" class="table-cell">{{
          coupon.publishCount - coupon.receiveCount
        }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.useCount }}</el-col>
        <el-col :span="4" class="table-cell">{{
          coupon.publishCount - coupon.useCount
        }}</el-col>
      </el-row>
    </div>

    <!-- 筛选搜索 -->
    <filter-search
      @handleSearch="handleSearch"
      @handleReset="handleReset"
      class="filter-container"
    >
      <el-form
        :inline="true"
        :model="filterConditions"
        size="small"
        label-width="140px"
      >
        <el-form-item label="使用状态：">
          <el-select
            v-model="filterConditions.useStatus"
            placeholder="全部"
            clearable
            class="input-width"
          >
            <el-option
              v-for="item in useTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-input
            v-model="filterConditions.orderSn"
            class="input-width"
            placeholder="订单编号"
          ></el-input>
        </el-form-item>
      </el-form>
    </filter-search>

    <!-- 领取列表 -->
    <div class="table-container">
      <el-table
        ref="couponHistoryTable"
        :data="dataTableList"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="优惠码" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.couponCode }}</template>
        </el-table-column>
        <el-table-column label="领取会员" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.memberNickname }}</template>
        </el-table-column>
        <el-table-column label="领取方式" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.getType | formatGetType
          }}</template>
        </el-table-column>
        <el-table-column label="领取时间" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="当前状态" width="140" align="center">
          <template slot-scope="scope">{{
            scope.row.useStatus | formatCouponHistoryUseType
          }}</template>
        </el-table-column>
        <el-table-column label="使用时间" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.useTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">{{
            scope.row.orderSn === null ? "N/A" : scope.row.orderSn
          }}</template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 页码 -->
    <div class="pagination-container">
      <pagination
        :pageConfig="pageConfig"
        :total="historyList.length"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import {
  COUPON_TYPE_OPTIONS,
  COUPON_USE_STATUS_OPTIONS,
} from "@/utils/constants";
import Pagination from "@/components/pagination/Pagination.vue";
import FilterSearch from "@/components/filterSearch/FilterSearch.vue";
import { couponDetailApi, couponHistoryApi } from "@/api/marketing";
import { dataTableList } from "@/utils/logic";

export default {
  components: { Pagination, FilterSearch },
  name: "CouponHistory",
  data() {
    return {
      coupon: {},
      defaultFilterConditions: {
        useStatus: null,
        orderSn: null,
        couponId: null,
      },
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
      },
      filterConditions: Object.assign({}, this.defaultFilterConditions),
      useTypeOptions: Object.assign({}, COUPON_USE_STATUS_OPTIONS),
      historyList: [],
      dataTableList: [],
      listLoading: false,
    };
  },
  created() {
    this.getCouponDetail();
    this.getCouponHistoryList();
  },
  filters: {
    formatType(type) {
      let temp = "";
      COUPON_TYPE_OPTIONS.forEach((element) => {
        if (type == element.value) {
          temp = element.label;
        }
      });

      return temp;
    },
    formatUseType(useType) {
      if (useType === 0) {
        return "全场通用";
      } else if (useType === 1) {
        return "指定分类";
      } else {
        return "指定商品";
      }
    },
    formatPlatform(platform) {
      if (platform === 1) {
        return "移动平台";
      } else if (platform === 2) {
        return "PC平台";
      } else {
        return "全平台";
      }
    },
    formatDate(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    formatStatus(endTime) {
      let now = new Date().getTime();
      if (endTime > now) {
        return "未过期";
      } else {
        return "已过期";
      }
    },
    formatGetType(type) {
      if (type === 1) {
        return "主动获取";
      } else {
        return "后台赠送";
      }
    },
    formatCouponHistoryUseType(useType) {
      if (useType === 0) {
        return "未使用";
      } else if (useType === 1) {
        return "已使用";
      } else {
        return "已过期";
      }
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    // 获取优惠券详情
    getCouponDetail() {
      couponDetailApi(this.$route.query.id).then((response) => {
        this.coupon = response.data;
      });
    },

    // 获取领取历史记录
    getCouponHistoryList() {
      this.listLoading = true;
      couponHistoryApi(this.$route.query.id).then((response) => {
        this.historyList = response.data.list;
        this.dataTableList = this.historyList;
        this.listLoading = false;
      });
    },

    // 重置
    handleReset() {
      this.filterConditions = Object.assign({}, this.defaultFilterConditions);
    },

    // 查询搜索
    handleSearch() {
      this.pageConfig.pageNum = 1;
      this.dataTableList = dataTableList(
        this.historyList,
        this.pageConfig,
        this.filterConditions
      );
    },

    // 改变列表展示数量
    handleSizeChange(value) {
      this.pageConfig = value;
      this.dataTableList = dataTableList(
        this.historyList,
        this.pageConfig,
        this.filterConditions
      );
    },

    // 改变页码
    handleCurrentChange(value) {
      this.pageConfig = value;
      this.dataTableList = dataTableList(
        this.historyList,
        this.pageConfig,
        this.filterConditions
      );
    },
  },
};
</script>
<style scoped>
.coupon-history {
  width: 80%;
  margin: 20px auto;
}

.filter-container {
  margin-top: 20px;
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
}

.table-container {
  margin-top: 20px;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  background: #f2f6fc;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
.pagination-container {
  float: right;
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>


