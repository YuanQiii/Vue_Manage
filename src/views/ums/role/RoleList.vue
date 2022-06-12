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
          <el-table-column prop="name" label="角色名称" align="center" />
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="adminCount" label="用户数" align="center" />
          <el-table-column label="添加时间" align="center">
            <template v-slot="scope">
              <p>
                {{ scope.row.createTime | formatDate }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" align="center">
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
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="text" @click="handleAssignMenu(scope.row)"
                >分配菜单</el-button
              >
              <el-button type="text" @click="handleAssignSource(scope.row)"
                >分配资源</el-button
              >
              <el-button type="text" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>

    <el-dialog
      title="添加角色"
      :visible="addDialogVisible"
      width="40%"
      class="dialog"
    >
      <el-form :model="addRoleInfo" label-width="80px" class="dialog-form">
        <el-form-item label="角色名称">
          <el-input v-model="addRoleInfo.name" />
        </el-form-item>
      </el-form>
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
            label: "姓名：",
            keyword: "name",
            placeholder: "请输入姓名",
          },
        ],
      },
      operateData: [
        {
          btnName: "添加",
          callback: this.handleAdd,
        },
      ],
      addDialogVisible: true,
      addRoleInfo: {},
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
      console.log("handleAdd");
    },

    // 分配菜单
    handleAssignMenu(row) {
      console.log("handleAssignMenu");
    },

    // 分配资源
    handleAssignSource(row) {
      console.log("handleAssignSource");
    },

    // 编辑
    handleEdit(row) {
      console.log("handleEdit");
    },

    // 删除
    handleDelete(row) {
      console.log("handleDelete");
    },
  },
};
</script>

<style lang="less" scoped>
.role-list {
  .dialog {
    text-align: center;
    .dialog-form {
    }
  }
}
</style>