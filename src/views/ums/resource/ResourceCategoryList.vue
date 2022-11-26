<template>
  <div class="resource-category-list">
    <el-card shadow="never">
      <datasheets
        :all-data="allData"
        :operate-data="operateData"
        :total="allData.length"
      >
        <template v-slot="prop">
          <el-table :data="prop.tableData" border>
            <el-table-column
              prop="id"
              label="编号"
              width="100"
              align="center"
            />
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column label="创建时间" align="center">
              <template v-slot="scope">
                <p>
                  {{ scope.row.createTime | formatDate }}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              label="排序"
              width="100"
              align="center"
            />
            <el-table-column label="操作" align="center" width="150">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" @click="handleDelete()"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </datasheets>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="resourceCategoryForm" label-width="100px" class="form">
        <el-form-item label="名称：">
          <el-input v-model="resourceCategoryDetail.name" />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="resourceCategoryDetail.sort" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Datasheets from "@/components/datasheets/Datasheets.vue";
import { roleResourceCategoryListApi } from "@/api/permissions";
import { updateItem } from "@/utils/logic";
export default {
  name: "ResourceCategoryList",
  components: { Datasheets },
  created() {
    this.getRoleResourceCategoryList();
  },
  data() {
    return {
      allData: [],
      operateData: [
        {
          btnName: "添加",
          callback: this.handleAdd,
        },
      ],
      defaultResourceCategoryDetail: {
        name: "",
        sort: 0,
      },
      resourceCategoryDetail: { ...this.defaultResourceCategoryDetail },
      dialogVisible: false,
      dialogTitle: "",
    };
  },
  methods: {
    // 获取分类列表
    getRoleResourceCategoryList() {
      roleResourceCategoryListApi().then((response) => {
        this.allData = response.data;
        console.log(this.allData);
      });
    },

    // 添加
    handleAdd() {
      this.dialogTitle = "添加分类";
      this.dialogVisible = true;
      this.resourceCategoryDetail = this.defaultResourceCategoryDetail;
    },

    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑分类";
      this.dialogVisible = true;
      this.resourceCategoryDetail = row;
    },

    // 删除
    handleDelete() {
      this.$message({
        message: "删除",
        type: "warning",
      });
    },

    // 取消
    handleCancel() {
      this.dialogVisible = false;
    },

    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      if (this.dialogTitle == "添加分类") {
        this.resourceCategoryDetail = {
          createTime: "2020-02-05T02:21:44.000+00:00",
          id: this.allData.length + 1,
          ...this.resourceCategoryDetail,
        };
        this.allData.push(this.resourceCategoryDetail);
      } else {
        updateItem(this.allData, this.resourceCategoryDetail);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.resource-category-list {
  .form {
    width: 70%;
    margin: 0 auto;
  }
}
</style>