<template>
  <div class="role-list">
    <datasheets
      :all-data="allData"
      :filter-data="filterData"
      :operate-data="operateData"
      :total="allData.length"
    >
      <template v-slot="prop">
        <el-table :data="prop.tableData" border>
          <el-table-column prop="id" label="编号" width="100" align="center" />
          <el-table-column prop="name" label="角色名称" width="120" align="center" />
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="adminCount" label="用户数" width="100" align="center" />
          <el-table-column label="添加时间" width="160" align="center">
            <template v-slot="scope">
              <p>
                {{ scope.row.createTime | formatDate }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="100" align="center">
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
          <el-table-column label="操作" align="center" >
            <template v-slot="scope">
              <el-button
                size="mini"
                @click="handleAllocMenu(scope.row)"
                >分配菜单</el-button
              >
              <el-button
                size="mini"
                @click="handleAllocResource(scope.row)"
                >分配资源</el-button
              >
              <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="addDialogVisible"
      width="40%"
      class="dialog"
    >
      <div class="wrap">
        <el-form :model="addRoleInfo" label-width="100px" class="dialog-form">
          <el-form-item label="角色名称：">
            <el-input size="mini" v-model="addRoleInfo.name" />
          </el-form-item>
          <el-form-item label="描述：">
            <el-input
              type="textarea"
              :rows="5"
              v-model="addRoleInfo.description"
            />
          </el-form-item>
          <el-form-item label="是否启用：">
            <el-radio v-model="addRoleInfo.status" :label="1">是</el-radio>
            <el-radio v-model="addRoleInfo.status" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleDialogConfirm" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Datasheets from "@/components/datasheets/Datasheets";

import { roleListApi } from "@/api/permissions";
export default {
  name: "RoleList",
  components: { Datasheets },
  created() {
    this.getRoleList();
  },
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: "角色名称：",
            keyword: "name",
            placeholder: "请输入名称",
          },
        ],
      },
      operateData: [
        {
          btnName: "添加",
          callback: this.handleAdd,
        },
      ],
      addDialogVisible: false,
      defaultRoleInfo: {
        id: 0,
        name: null,
        description: null,
        status: 1,
        createTime: "2018-09-30T07:53:45.000+00:00",
        sort: 0,
        adminCount: 0,
      },
      addRoleInfo: {
        id: 0,
        name: null,
        description: null,
        status: 1,
        createTime: "2018-09-30T07:53:45.000+00:00",
        sort: 0,
        adminCount: 0,
      },

      isEdit: false,
    };
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      roleListApi().then((response) => {
        console.log(response);
        this.allData = response.data;
      });
    },

    // 是否启用
    handleStatusChange(row) {
      this.$message({
        type: "success",
        message: "已更改",
      });
    },

    // 添加
    handleAdd() {
      this.isEdit = false;
      this.addDialogVisible = true;
      this.addRoleInfo = this.defaultRoleInfo;
    },

    // 编辑或添加确认
    handleDialogConfirm() {
      if (this.isEdit) {
        this.allData.forEach((element, index) => {
          if (element.id === this.addRoleInfo.id) {
            this.$set(this.allData, index, this.addRoleInfo);
          }
        });
      } else {
        this.allData.push(
          Object.assign(this.addRoleInfo, { id: this.allData.length + 1 })
        );
      }
      this.addDialogVisible = false;
    },

    // 分配菜单
    handleAllocMenu(row) {
      this.$router.push({
        path: "allocMenu",
        query: {
          id: row.id,
        },
      });
    },

    // 分配资源
    handleAllocResource(row) {
      this.$router.push({
        path: "allocResource",
        query: {
          id: row.id,
        },
      });
    },

    // 编辑
    handleEdit(row) {
      this.isEdit = true;
      this.addDialogVisible = true;
      this.addRoleInfo = { ...this.allData[row.id - 1] };
    },

    // 删除
    handleDelete(row) {
      this.$message({
        type: "success",
        message: "删除",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.role-list {
  .dialog {
    .wrap {
      width: 70%;
      margin: 0 auto;
    }
    .dialog-form {
    }
  }
}
</style>