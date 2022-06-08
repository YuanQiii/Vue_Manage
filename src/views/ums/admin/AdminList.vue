<template>
  <div class="admin-list">
    <filter-search @handleSearch="handleSearch" @handleReset="handleReset">
      <el-form
        :inline="true"
        :model="filterConditions"
        size="small"
        label-width="140px"
      >
        <el-form-item label="输入姓名：">
          <el-input
            v-model="filterConditions.nickName"
            class="input-width"
            placeholder="姓名"
          ></el-input>
        </el-form-item>
      </el-form>
    </filter-search>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd">添加</el-button>
    </el-card>

    <div class="table-container">
      <el-table
        ref="adminTable"
        :data="dataTableList"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.nickName }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">{{
            formatDate(scope.row.createTime)
          }}</template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch
          ></template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleAssign(scope.$index, scope.row)"
              >分配角色</el-button
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

    <div class="pagination">
      <pagination :pageConfig="pageConfig" :total="dataTableList.length" />
    </div>

    <div class="dialog">
      <el-dialog
        title="分配角色"
        :visible.sync="assginDialogVisible"
        width="30%"
      >
        <el-select
          v-model="assginRoleIds"
          multiple
          placeholder="请选择"
          size="small"
          style="width: 80%"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
          <el-button @click="assginDialogVisible = false" size="small"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="handleAssginDialogConfirm"
            size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        :title="isEdit ? '编辑用户' : '添加用户'"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <el-form
          :model="adminDetail"
          :rules="adminRules"
          ref="adminForm"
          label-width="150px"
          size="small"
        >
          <el-form-item label="帐号：">
            <el-input
              v-model="adminDetail.username"
              :validate-event="true"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input
              v-model="adminDetail.nickName"
              :validate-event="true"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input
              v-model="adminDetail.email"
              :validate-event="true"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input
              v-model="adminDetail.password"
              :validate-event="true"
              type="password"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              v-model="adminDetail.note"
              type="textarea"
              :rows="5"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否启用：">
            <el-radio-group v-model="adminDetail.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleDialogConfirm" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FilterSearch from "@/components/filterSearch/FilterSearch.vue";
import {
  dataTableList,
  deleteItemById,
  updateItem,
  addItem,
} from "@/utils/logic";

import {
  adminListApi,
  roleListApi,
  adminDetailApi,
} from "@/api/permissions.js";
import Pagination from "@/components/pagination/Pagination.vue";

export default {
  name: "AdminList",
  components: { FilterSearch, Pagination },
  created() {
    this.getAdminList();
    this.getRoleList();
  },
  data() {
    return {
      filterConditions: {},
      pageConfig: {
        pageSize: 10,
        pageNum: 1,
      },
      dataTableList: [],
      listLoading: false,
      assginDialogVisible: false,

      adminRules: {
        adminForm: [
          {
            require: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
        ],
      },

      roleList: [],
      assginRoleIds: [],

      isEdit: false,
      dialogVisible: false,
      adminDetail: {},
    };
  },
  methods: {
    // 获取管理员列表
    getAdminList() {
      adminListApi().then((response) => {
        console.log(response);
        this.dataTableList = dataTableList(
          response.data.list,
          this.pageConfig,
          this.filterConditions
        );
      });
    },

    // 获取角色列表
    getRoleList() {
      roleListApi().then((response) => {
        this.roleList = response.data;
      });
    },

    // 查询搜索
    handleSearch() {
      this.dataTableList = dataTableList(
        this.dataTableList,
        this.pageConfig,
        this.filterConditions
      );
    },

    // 重置
    handleReset() {
      this.filterConditions = {};
    },

    // 添加按钮
    handleAdd() {
      this.adminDetail = { status: 1 };
      this.dialogVisible = true;
      this.isEdit = false;
    },

    // 是否启用
    handleStatusChange(index, row) {
      this.$confirm("是否要修改该状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row.status);
        })
        .catch(() => {
          row.status = !row.status * 1;
        });
    },

    // 分配角色
    handleAssign(index, row) {
      this.assginDialogVisible = true;
      this.assginRoleIds = [row.id];
    },

    // 编辑按钮
    handleUpdate(index, row) {
      adminDetailApi(row.id).then((response) => {
        this.dialogVisible = true;
        this.isEdit = false;
        this.adminDetail = response.data;
      });
    },

    // 删除
    handleDelete(index, row) {
      this.dataTableList = deleteItemById(this.dataTableList, row.id);
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },

    // 管理员详情确认
    handleDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 编辑
        if (this.isEdit) {
          this.dataTableList = updateItem(this.dataTableList, this.adminDetail);
          this.dialogVisible = false;
          this.$message({
            message: "更新成功",
            type: "success",
          });
        }

        // 添加
        else {
          this.dialogVisible = false;
          this.adminDetail.id = this.dataTableList.length + 1;
          this.adminDetail.createTime = "2018-10-08T05:32:47.000+00:00";
          this.dataTableList = addItem(this.dataTableList, this.adminDetail);
        }
      });
    },

    // 分配角色对话框确定
    handleAssginDialogConfirm() {
      this.assginDialogVisible = false;
    },

    // 格式化时间
    formatDate(date) {
      return date.replace("T", " ").slice(0, -10);
    },
  },
};
</script>

<style lang="less" scoped>
.admin-list {
  margin-top: 40px;
  .operate-container {
    margin-top: 20px;
    .btn-add {
      float: right;
    }
  }
  .el-icon-tickets {
    margin-right: 5px;
  }
  .table-container {
    margin-top: 20px;
  }

  .pagination {
    float: right;
    margin-top: 20px;
    margin-bottom: 40px;
  }
}
</style>