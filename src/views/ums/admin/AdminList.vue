<template>
  <div class="admin-list">

    <datasheets :all-data="allData" :total="allData.length" :filter-data="filterData" :operate-data="operateData">
      <template v-slot="prop">
        <el-table
            :data="prop.tableData"
            style="width: 100%"
            border>
          <el-table-column prop="id" label="编号" width="70" align="center" />
          <el-table-column prop="username" label="账号" width="150" align="center" />
          <el-table-column prop="nickName" label="姓名" width="120" align="center" />
          <el-table-column prop="email" label="邮箱" width="200" align="center" />
          <el-table-column prop="createTime" label="添加时间" align="center" />
          <el-table-column label="是否启用" width="100" align="center">
            <template v-slot="scope">
              <el-switch
                  @change="handleStatusChange(scope.row)"
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
              >
              </el-switch
              ></template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button
                  size="mini"
                  @click="handleAssign(scope.row)"
              >分配角色</el-button
              >
              <el-button
                  size="mini"
                  @click="handleUpdate(scope.row)"
              >
                编辑</el-button
              >
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>
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
        :title="isUpdate ? '编辑用户' : '添加用户'"
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
import {
  deleteItemById,
  updateItem,
  addItem,
} from "@/utils/logic";

import {
  adminListApi,
  roleListApi,
  adminDetailApi,
} from "@/api/permissions.js";
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  name: "AdminList",
  components: {Datasheets},
  created() {
    this.getAdminList();
    this.getRoleList();
  },
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: '输入姓名',
            placeholder: '请输入输入姓名',
            keyword: 'nickName'
          }
        ]
      },
      operateData: [
        {
          btnName: '添加',
          callback: this.handleAdd
        }
      ],

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
      isUpdate: false,
      dialogVisible: false,
      adminDetail: {},
    };
  },
  methods: {
    // 获取管理员列表
    getAdminList() {
      adminListApi().then((response) => {
        this.allData = response.data.list
      });
    },

    // 获取角色列表
    getRoleList() {
      roleListApi().then((response) => {
        this.roleList = response.data;
      });
    },

    // 添加按钮
    handleAdd() {
      this.adminDetail = { status: 1 };
      this.dialogVisible = true;
      this.isUpdate = false;
    },

    // 是否启用
    handleStatusChange(row) {
      console.log(row)
    },

    // 分配角色
    handleAssign(row) {
      this.assginDialogVisible = true;
      this.assginRoleIds = [row.id];
    },

    // 编辑按钮
    handleUpdate(row) {
      adminDetailApi(row.id).then((response) => {
        this.dialogVisible = true;
        this.isUpdate = true;
        this.adminDetail = response.data;
      });
    },

    // 删除
    handleDelete(index, row) {
      this.allData = deleteItemById(this.allData, row.id);
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
        if (this.isUpdate) {
          this.allData = updateItem(this.allData, this.adminDetail);
          this.dialogVisible = false;
          this.$message({
            message: "更新成功",
            type: "success",
          });
        }

        // 添加
        else {
          this.dialogVisible = false;
          this.adminDetail.id = this.allData.length + 1;
          this.adminDetail.createTime = "2018-10-08T05:32:47.000+00:00";
          this.allData = addItem(this.allData, this.adminDetail);
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
</style>