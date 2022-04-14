<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-14 09:39:34
 * @FilePath: \vue_manage\src\views\oms\apply\OrderReturnApplyReason.vue
-->
<template>
  <div class="order-return-apply-reason">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" @click="handleAdd" class="btn-add"
        >添加
      </el-button>
    </el-card>

    <div class="table-container">
      <el-table
        ref="returnReasonTable"
        :data="currentList"
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
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="原因类型" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="是否可用" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="180" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatCreateTime
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="bottom">
      <div class="batch-operate-container">
        <el-select size="small" v-model="operateType" placeholder="批量操作">
          <el-option
            v-for="item in operateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 20px"
          class="search-button"
          @click="handleBatchOperate"
          type="primary"
          size="small"
        >
          确定
        </el-button>
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
          :total="returnReasonList.length"
        >
        </el-pagination>
      </div>
    </div>

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

export default {
  name: "OrderReturnApplyReason",
  created() {
    this.getReturnReasonList();
  },
  data() {
    return {
      returnReasonList: [],
      multipleSelection: [],
      listLoading: true,
      pageConfig: {
        pageNum: 1,
        pageSize: 5,
      },
      operateType: null,
      operateOptions: [
        {
          label: "删除",
          value: 1,
        },
      ],
      dialogVisible: false,
      defaultReturnReason: {
        name: null,
        sort: 0,
        status: 1,
        createTime: null,
      },
      returnReason: Object.assign({}, this.defaultReturnReason),
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
      this.listLoading = true;
      orderReturnReasonListApi().then((response) => {
        this.listLoading = false;
        this.returnReasonList = response.data.list;
      });
    },

    // 添加按钮
    handleAdd() {
      this.dialogVisible = true;
      this.returnReason = Object.assign({}, this.defaultReturnReason);
    },

    // 确认
    handleConfirm() {
      this.dialogVisible = false;
      this.$message({
        message: "修改成功！",
        type: "success",
      });
    },

    // 编辑按钮
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.returnReason = row;
    },

    // 删除按钮
    handleDelete(index, row) {
      this.deleteReason([row.id]);
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 是否可用
    handleStatusChange(index, row) {
      this.$message({
        message: "是否可用",
        type: "info",
      });
    },

    // 批量操作
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的条目",
          type: "warning",
        });
        return;
      }

      // 删除
      if (this.operateType === 1) {
        let ids = [];
        this.multipleSelection.forEach((element) => {
          ids.push(element.id);
        });
        this.deleteReason(ids);
      }
    },

    // 列表展示数量
    handleSizeChange(value) {
      this.pageConfig.pageNum = 1;
      this.pageConfig.pageSize = value;
    },

    // 改变页码
    handleCurrentChange(value) {
      this.pageConfig.pageNum = value;
    },

    // 删除逻辑
    deleteReason(ids) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let temp = [];
        this.returnReasonList.forEach((element) => {
          temp.push(element);
          ids.forEach((id) => {
            if (element.id == id) {
              temp.pop();
            }
          });
        });
        this.returnReasonList = temp;
        this.$message({
          message: "删除成功！",
          type: "success",
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.operate-container {
  margin-top: 40px;
  margin-bottom: 20px;
  .el-icon-tickets {
    margin-right: 5px;
  }
  .btn-add {
    float: right;
  }
}

.bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 40px;
}
.input-width {
  width: 80%;
}
</style>


