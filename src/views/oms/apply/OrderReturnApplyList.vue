<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-12 15:46:01
 * @FilePath: \vue_manage\src\views\oms\apply\OrderReturnApplyList.vue
-->
<template>
  <div class="order-return-apply-list">
    <datasheets :all-data="allData" :total="allData.length" :filter-data="filterData">
      <template v-slot="prop">
        <el-table
            :data="prop.tableData"
            style="width: 100%"
            border
        >
          <el-table-column prop="id" label="服务单号" width="100" align="center"/>
          <el-table-column label="申请时间" align="center">
            <template v-slot="scope">
              {{scope.row.createTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column prop="memberUsername" label="用户账号" width="100" align="center"/>
          <el-table-column label="退款金额" align="center">
            <template v-slot="scope">
              {{`￥${scope.row.productRealPrice * scope.row.productCount}`}}
            </template>
          </el-table-column>
          <el-table-column label="申请状态" width="100" align="center">
            <template v-slot="scope">
              {{scope.row.status | formatStatus}}
            </template>
          </el-table-column>
          <el-table-column label="处理时间" align="center">
            <template v-slot="scope">
              {{scope.row.handleTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button
                  size="mini"
                  @click="handleViewDetail(scope.row)"
              >查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import ApplyFilter from "./components/ApplyFilter.vue";
import { orderRetuenApplyListApi } from "@/api/order";
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  components: {Datasheets, ApplyFilter },
  name: "OrderReturnApplyList",
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: '服务单号',
            placeholder: '请输入服务单号',
            keyword: 'id'
          },
          {
            label: '用户账户',
            placeholder: '请输入用户账户',
            keyword: 'memberUsername'
          },
        ],
        select: [
          {
            label: '处理状态',
            placeholder: '全部',
            keyword: 'status',
            options: [
              {
                label: "待处理",
                value: 0,
              },
              {
                label: "退货中",
                value: 1,
              },
              {
                label: "已完成",
                value: 2,
              },
              {
                label: "已拒绝",
                value: 3,
              }
            ]
          }
        ],
        date: [
          {
            label: '申请日期',
            placeholder: '请选择时间',
            keyword: 'createTime'
          },
          {
            label: '处理日期',
            placeholder: '请选择时间',
            keyword: 'handleTime'
          },
        ]
      },
    };
  },
  created() {
    this.getOrderReturnApplyList();
  },
  filters: {
    formatStatus(status) {
      if(status === 0){
        return '待处理'
      }
      if(status === 1){
        return '退货中'
      }
      if(status === 2){
        return '已完成'
      }
      if(status === 3){
        return '已拒绝'
      }
    },

    formatReturnAmount(row) {
      return row.productRealPrice * row.productCount;
    },
  },
  methods: {
    // 获取退货申请列表
    getOrderReturnApplyList() {
      orderRetuenApplyListApi().then((response) => {
        this.allData = response.data.list;
      });
    },

    // 退货申请详情
    handleViewDetail(row) {
      this.$router.push({
        path: "/oms/returnApplyDetail",
        query: { id: row.id },
      });
    },
  },
};
</script>
<style lang="less" scoped>

</style>


