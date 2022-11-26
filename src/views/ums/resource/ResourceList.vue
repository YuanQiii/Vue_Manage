<template>
  <div class="resource-list">
    <el-card shadow="never">
      <datasheets
        :all-data="allData"
        :filter-data="filterData"
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
            <el-table-column
              prop="name"
              label="资源名称"
              width="300"
              align="center"
            />
            <el-table-column
              prop="url"
              label="资源路径"
              width="300"
              align="center"
            />
            <el-table-column prop="description" label="描述" align="center" />
            <el-table-column label="添加时间" align="center">
              <template v-slot="scope">
                <p>
                  {{ scope.row.createTime | formatDate }}
                </p>
              </template>
            </el-table-column>
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
      <el-form ref="addResourceForm" label-width="100px" class="form">
        <el-form-item label="资源名称：">
          <el-input v-model="addResourceDetail.name" />
        </el-form-item>
        <el-form-item label="资源路由：">
          <el-input v-model="addResourceDetail.url" />
        </el-form-item>
        <el-form-item label="资源分类：">
          <el-select
            v-model="addResourceDetail.categoryId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input type="textarea" v-model="addResourceDetail.description" />
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
import { updateItem } from "@/utils/logic";

import {
  roleResourceCategoryListApi,
  roleResourceListApi,
} from "@/api/permissions";
export default {
  name: "ResourceList",
  components: { Datasheets },
  created() {
    this.getRoleResourceCategoryList();
    this.getRoleResourceList();
  },
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: "资源名称",
            keyword: "name",
            placeholder: "请输入资源名称",
          },
          {
            label: "资源路径",
            keyword: "url",
            placeholder: "请输入资源路径",
          },
        ],
        select: [
          {
            label: "资源分类",
            keyword: "categoryId",
            placeholder: "全部",
            options: [],
          },
        ],
      },
      operateData: [
        {
          btnName: "资源分类",
          callback: this.handleResourceCategoryList,
        },
        {
          btnName: "添加",
          callback: this.handleAdd,
        },
      ],
      dialogTitle: "",
      dialogVisible: false,
      defaultAddResourceDetail: {
        name: "",
        url: "",
        categoryId: 1,
        description: "",
      },
      addResourceDetail: { ...this.defaultAddResourceDetail },
      categoryOptions: [],
    };
  },
  methods: {
    // 获取资源分类
    getRoleResourceCategoryList() {
      roleResourceCategoryListApi().then((response) => {
        let options = response.data.map((element) => {
          return {
            label: element.name,
            value: element.id,
          };
        });
        this.filterData.select[0].options = options;
        this.categoryOptions = options;
      });
    },

    // 获取资源列表
    getRoleResourceList() {
      roleResourceListApi().then((response) => {
        console.log(response);
        this.allData = response.data;
      });
    },

    // 资源分类
    handleResourceCategoryList() {
      console.log("handleResourceCategoryList");
      this.$router.push({
        path: "resourceCategoryList",
      });
    },

    // 添加
    handleAdd() {
      this.addResourceDetail = this.defaultAddResourceDetail;
      this.dialogTitle = "添加资源";
      this.dialogVisible = true;
    },

    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑资源";
      this.addResourceDetail = row;
      this.dialogVisible = true;
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
      if (this.dialogTitle == "添加资源") {
        this.addResourceDetail = {
          createTime: "2020-02-04T09:04:55.000+00:00",
          id: this.allData.length + 5,
          status: 1,
          ...this.addResourceDetail,
        };
        this.allData.push(this.addResourceDetail);
      } else {
        updateItem(this.allData, this.addResourceDetail);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.resource-list {
  .form {
    width: 70%;
    margin: 0 auto;
  }
}
</style>