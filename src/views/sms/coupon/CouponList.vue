<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-14 21:20:01
 * @FilePath: \vue_manage\src\views\sms\coupon\CouponList.vue
-->
<template>
   
  <div class="coupon-couponList">
    <coupon-search @searchResult="searchResult" />

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd">添加</el-button>
    </el-card>

    <div class="table-container">
      <el-table
        ref="couponTable"
        :data="dataTableList"
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="优惠劵名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="优惠券类型" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.type | formatType(typeOptions)
          }}</template>
        </el-table-column>
        <el-table-column label="可使用商品" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.useType | formatUseType
          }}</template>
        </el-table-column>
        <el-table-column label="使用门槛" width="140" align="center">
          <template slot-scope="scope"
            >满{{ scope.row.minPoint }}元可用</template
          >
        </el-table-column>
        <el-table-column label="面值" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.amount }}元</template>
        </el-table-column>
        <el-table-column label="适用平台" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.platform | formatPlatform
          }}</template>
        </el-table-column>
        <el-table-column label="有效期" width="210" align="center">
          <template slot-scope="scope"
            >{{ scope.row.startTime | formatDate }} 至
            {{ scope.row.endTime | formatDate }}</template
          >
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.endTime | formatStatus
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleView(scope.$index, scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
        :total="couponList.length"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { couponListApi } from "@/api/marketing";
import { formatDate } from "@/utils/date";
import { dataTableList } from "@/utils/logic";
import CouponSearch from "./components/CouponSearch.vue";

export default {
  components: { CouponSearch },
  name: "CouponList",
  data() {
    return {
      filterConditions: {},
      couponList: [],
      listLoading: false,
      multipleSelection: [],
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
      },
      typeOptions: [
        {
          label: "全场赠券",
          value: 0,
        },
        {
          label: "会员赠券",
          value: 1,
        },
        {
          label: "购物赠券",
          value: 2,
        },
        {
          label: "注册赠券",
          value: 3,
        },
      ],
    };
  },
  created() {
    this.getCouponList();
  },
  filters: {
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
    formatType(type, typeOptions) {
      let temp = "";
      typeOptions.forEach((element) => {
        if (type == element.value) {
          temp = element.label;
        }
      });

      return temp;
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
      let endDate = new Date(endTime);
      if (endDate > now) {
        return "未过期";
      } else {
        return "已过期";
      }
    },
  },
  computed: {
    dataTableList() {
      return dataTableList(
        this.couponList,
        this.pageConfig,
        this.filterConditions
      );
    },
  },
  methods: {
    //  获取优惠券数据
    getCouponList() {
      this.listLoading = true;
      couponListApi().then((response) => {
        this.listLoading = false;
        this.couponList = response.data.list;
      });
    },

    // 搜索
    searchResult(value) {
      this.filterConditions = value;
      this.pageConfig.pageNum = 1;
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 页面展示数量
    handleSizeChange(value) {
      this.pageConfig = {
        pageNum: 1,
        pageSize: value,
      };
    },

    // 改变页码
    handleCurrentChange(value) {
      this.pageConfig.pageNum = value;
    },

    // 跳转到添加页面
    handleAdd() {
      this.$router.push({ path: "/sms/addCoupon" });
    },

    // 跳转到领取记录页面
    handleView(index, row) {
      this.$router.push({ path: "/sms/couponHistory", query: { id: row.id } });
    },

    // 跳转到编辑页面
    handleUpdate(index, row) {
      this.$router.push({ path: "/sms/updateCoupon", query: { id: row.id } });
    },

    // 删除
    handleDelete(index, row) {
      this.$confirm("是否进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let temp = [];
        this.couponList.forEach((element) => {
          temp.push(element);
          if (element.id == row.id) {
            temp.pop();
          }
        });
        this.couponList = temp;

        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
  },
};
</script>


<style lang="less" scoped>
.coupon-couponList {
  margin-top: 40px;
  .operate-container {
    margin-top: 20px;
    margin-bottom: 20px;
    .btn-add {
      float: right;
      margin-top: -5px;
    }
  }
  .pagination-container {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 20px;
    margin-bottom: 40px;
  }
}
.input-width {
  width: 203px;
}
</style>



