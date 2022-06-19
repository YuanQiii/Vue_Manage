<template>
  <el-card shadow="never" style="padding-left: 80px">
    <el-tree
      ref="resourceTree"
      :data="resourceTree"
      show-checkbox
      node-key="id"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
    />
    <div class="bottom">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">清空</el-button>
      {{ checkedKeys }}
    </div>
  </el-card>
</template>

<script>
import {
  roleResourceCategoryListApi,
  roleResourceListApi,
} from "@/api/permissions";

export default {
  name: "AllocResource",
  created() {
    this.getRoleResourceList();
  },
  data() {
    return {
      resourceTree: [],
      checkedKeys: [],
    };
  },
  methods: {
    // 获取资源列表
    getRoleResourceList() {
      let p1 = roleResourceCategoryListApi();
      let p2 = roleResourceListApi(this.$route.query.id);

      Promise.all([p1, p2]).then((values) => {
        console.log(values);
        this.resourceTree = this.handleListToTree(
          values[0].data,
          values[1].data
        );
      });
    },

    // 列表转树形
    handleListToTree(parent, children) {
      let temp = [];
      parent.forEach((element) => {
        temp.push({
          id: element.id,
          label: element.name,
          children: [],
        });
      });
      children.forEach((element1) => {
        this.handleCheckedKeys(element1);

        temp.forEach((element2) => {
          if (element1.categoryId === element2.id) {
            element2.children.push({
              id: element1.id,
              label: element1.name,
            });
          }
        });
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
      this.$confirm("是否分配资源？")
        .then(() => {
          this.$router.back();
        })
        .catch(() => {});
    },

    // 清空
    handleCancel() {
      this.$refs.resourceTree.setCheckedKeys([]);
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