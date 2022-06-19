<template>
  <el-card shadow="never" style="padding-left: 80px">
    <el-tree
      ref="menuTree"
      :data="roleMenuTree"
      show-checkbox
      node-key="id"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
    />

    <div class="bottom">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">清空</el-button>
    </div>
  </el-card>
</template>

<script>
import { roleMenuListApi } from "@/api/permissions";

export default {
  name: "AllocMenu",
  created() {
    this.getRoleMenuList();
  },
  data() {
    return {
      roleMenuTree: [],
      checkedKeys: [],
    };
  },
  methods: {
    // 获取菜单列表
    getRoleMenuList() {
      roleMenuListApi(this.$route.query.id).then((response) => {
        this.roleMenuTree = this.handleListToTree(response.data);
      });
    },

    // 列表转树形
    handleListToTree(list) {
      let temp = [];
      list.forEach((item) => {
        this.handleCheckedKeys(item);

        if (item.parentId === 0) {
          temp.push({
            id: item.id,
            label: item.title,
            children: [],
          });
        } else {
          temp.forEach((value, index) => {
            if (value.id === item.parentId) {
              temp[index].children.push({
                id: item.id,
                label: item.title,
              });
            }
          });
        }
      });
      return temp;
    },

    // 已选择的列表
    handleCheckedKeys(value) {
      if (value.status) {
        this.checkedKeys.push(value.id);
      }
    },

    // 保存
    handleSave() {
      this.$confirm("是否分配菜单？")
        .then(() => {
          this.$router.back();
        })
        .catch(() => {});
    },

    // 清空
    handleCancel() {
      this.$refs.menuTree.setCheckedKeys([]);
    },
  },
};
</script>

<style lang="less" scoped>
.bottom {
  text-align: center;
  margin-top: 40px;
}
</style>