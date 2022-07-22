<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-14 09:39:34
 * @FilePath: \vue_manage\src\views\oms\apply\OrderReturnApplyReason.vue
-->
<template>
  <div class="order-return-apply-reason">

    <datasheets :all-data="allData" :total="allData.length" :operate-data="operateData">
      <template v-slot="prop">
        <el-table
            :data="prop.tableData"
            style="width: 100%"
            border
        >
          <el-table-column
              type="selection"
              width="60"
              align="center"
          ></el-table-column>
          <el-table-column prop="id" label="编号" width="80" align="center" />
          <el-table-column prop="name" label="原因类型"  align="center" />
          <el-table-column prop="sort" label="排序" width="100" align="center" />
          <el-table-column label="是否可用" align="center">
            <template v-slot="scope">
              <el-switch
                  v-model="scope.row.status"
                  @change="handleStatusChange(scope.row)"
                  :active-value="1"
                  :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" width="180" align="center">
            <template v-slot="scope">{{
                scope.row.createTime | formatCreateTime
              }}</template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template v-slot="scope">
              <el-button
                  size="mini"
                  @click="handleUpdate(scope.row)"
              >编辑</el-button>
              <el-button
                  size="mini"
                  @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>

    <!-- 添加/编辑 -->
    <el-dialog title="添加退货原因" :visible.sync="dialogVisible" width="30%">
      <el-form :model="returnReason" ref="reasonForm" label-width="150px">
        <el-form-item label="原因类型：">
          <el-input v-model="returnReason.name" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="returnReason.sort" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch
            v-model="returnReason.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import { orderReturnReasonListApi } from "@/api/order";
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  name: "OrderReturnApplyReason",
  components: {Datasheets},
  created() {
    this.getReturnReasonList();
  },
  data() {
    return {
      allData: [],
      operateData: [
        {
          btnName: '添加',
          callback: this.handleAdd
        }
      ],
      dialogVisible: false,
      defaultReturnReason: {
        name: null,
        sort: 0,
        status: 1,
        createTime: null,
      },
      returnReason: {...this.defaultReturnReason},
      isAdd: false
    };
  },
  computed: {
    currentList() {
      let start = (this.pageConfig.pageNum - 1) * this.pageConfig.pageSize;
      let end = this.pageConfig.pageNum * this.pageConfig.pageSize;
      let max = this.returnReasonList.length;
      end = end > max ? max : end;

      return this.returnReasonList.slice(start, end);
    },
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },



  methods: {
    // 获取退货原因列表
    getReturnReasonList() {
      orderReturnReasonListApi().then((response) => {
        this.returnReasonList = response.data.list;
        this.allData = response.data.list
      });
    },

    // 添加按钮
    handleAdd() {
      this.dialogVisible = true;
      this.isAdd = true
      this.returnReason = {...this.defaultReturnReason};
    },

    // 是否可用
    handleStatusChange(row) {
      this.$message({
        message: "是否可用",
        type: "info",
      });
    },

    // 编辑按钮
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isAdd = false
      this.returnReason = {...row};
    },

    // 删除按钮
    handleDelete(index, row) {
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

    // 确认
    handleConfirm() {
      this.dialogVisible = false;
      if(this.isAdd){
        this.$message({
          message: "添加成功！",
          type: "success",
        });
      }else{
        this.$message({
          message: "修改成功！",
          type: "success",
        });
      }

    },
  },
};
</script>

<style lang="less" scoped>
.input-width {
  width: 80%;
}
</style>


