<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-14 21:20:01
 * @FilePath: \vue_manage\src\views\sms\coupon\CouponList.vue
-->
<template>
  <div class="coupon-couponList">

    <datasheets :all-data="allData" :total="allData.length" :filter-data="filterData" :operate-data="operateData">
      <template v-slot="prop">
        <el-table
            :data="prop.tableData"
            style="width: 100%"
            border>
          <el-table-column prop="id" label="编号" width="100" align="center"/>
          <el-table-column prop="name" label="优惠劵名称" align="center"/>
          <el-table-column label="优惠券类型" width="100" align="center">
            <template v-slot="scope">
              {{scope.row.type | formatType(filterData.select[0].options)}}
            </template>
          </el-table-column>
          <el-table-column label="可使用商品" width="100" align="center">
            <template v-slot="scope">{{
                scope.row.useType | formatUseType
              }}
            </template>
          </el-table-column>

          <el-table-column label="使用门槛" width="140" align="center">
            <template v-slot="scope"
            >满{{scope.row.minPoint}}元可用
            </template
            >
          </el-table-column>
          <el-table-column label="面值" width="100" align="center">
            <template v-slot="scope">{{scope.row.amount}}元</template>
          </el-table-column>
          <el-table-column label="适用平台" width="100" align="center">
            <template v-slot="scope">{{
                scope.row.platform | formatPlatform
              }}
            </template>
          </el-table-column>
          <el-table-column label="有效期" width="210" align="center">
            <template v-slot="scope"
            >{{scope.row.startTime | formatDate}} 至
              {{scope.row.endTime | formatDate}}
            </template
            >
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template v-slot="scope">{{
                scope.row.endTime | formatStatus
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button
                  size="mini"
                  @click="handleView(scope.row)"
              >查看
              </el-button>
              <el-button
                  size="mini"
                  @click="handleUpdate(scope.row)"
              >
                编辑
              </el-button
              >
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
              >删除
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>

  </div>
</template>
<script>
import {couponListApi} from "@/api/marketing";
import {formatDate} from "@/utils/date";
import {dataTableList} from "@/utils/logic";
import FilterSearch from "@/components/filterSearch/FilterSearch.vue";
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  components: {Datasheets, FilterSearch},
  name: "CouponList",
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: '优惠券名称',
            placeholder: '请输入优惠券名称',
            keyword: 'name'
          }
        ],
        select: [
          {
            label: '优惠券类型',
            placeholder: '全部',
            keyword: 'type',
            options: [
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
              }
            ]
          }
        ]
      },
      operateData: [
        {
          btnName: '添加',
          callback: this.handleAdd
        }
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
    formatType(type, options) {
      let temp = "";
      options.forEach((element) => {
        if (type === element.value) {
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
  methods: {
    //  获取优惠券数据
    getCouponList() {
      couponListApi().then((response) => {
        this.allData = response.data.list
      });
    },

    // 跳转到添加页面
    handleAdd() {
      this.$router.push({path: "/sms/addCoupon"});
    },

    // 跳转到领取记录页面
    handleView(row) {
      this.$router.push({path: "/sms/couponHistory", query: {id: row.id}});
    },

    // 跳转到编辑页面
    handleUpdate(row) {
      this.$router.push({path: "/sms/updateCoupon", query: {id: row.id}});
    },

    // 删除
    handleDelete(row) {
      this.$confirm("是否进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
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

    .el-icon-tickets {
      margin-right: 5px;
    }

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



