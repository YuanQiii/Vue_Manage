<template>
  <div class="brand-recommend">
    <datasheets :all-data="allData" :total="allData.length" :filter-data="filterData" :multiple-selection="multipleSelection" :batchOperateOptions="batchOperateOptions">
      <template v-slot="prop">
        <el-table
            :data="prop.tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border
        >
          <el-table-column
              type="selection"
              width="60"
              align="center"
          ></el-table-column>
          <el-table-column prop="id" label="编号" width="120" align="center" />
          <el-table-column prop="name" label="品牌名称" width="120" align="center" />
          <el-table-column label="是否推荐"  align="center">
            <template v-slot="scope">
              <el-switch
                  @change="
                handleRecommendStatusStatusChange(scope.row)
              "
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.recommendStatus"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="120" align="center" />
          <el-table-column label="状态" width="160" align="center">
            <template v-slot="scope">{{
                scope.row.recommendStatus | formatRecommendStatus
              }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button
                  size="mini"
                  @click="handleSort(scope.row)"
              >设置排序
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>
    <el-dialog title="设置排序" :visible.sync="sortDialogVisible" width="40%">
      <el-form :model="sortDialogData" label-width="150px">
        <el-form-item label="排序：">
          <el-input
            v-model="sortDialogData.sort"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleUpdateSort" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { updateItem } from "@/utils/logic";
import { brandListApi } from "@/api/brand";
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  components: {Datasheets},
  name: "BrandRecommend",
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: '品牌名称',
            placeholder: '请输入品牌名称',
            keyword: 'name'
          }
        ],
        select: [
          {
            label: '推荐状态',
            placeholder: '全部',
            keyword: 'showStatus',
            options: [
              {
                label: "未推荐",
                value: 0,
              },
              {
                label: "推荐中",
                value: 1,
              },
            ]
          }
        ]
      },
      multipleSelection: [],
      batchOperateOptions: [
        {
          label: '设为推荐',
          key: 'recommendStatus',
          value: 1
        },
        {
          label: '取消推荐',
          key: 'recommendStatus',
          value: 0
        }
      ],

      sortDialogVisible: false,
      sortDialogData: { sort: 0, id: null },
    };
  },
  created() {
    this.getBrandList();
  },
  filters: {
    formatRecommendStatus(status) {
      if (status === 1) {
        return "推荐中";
      } else {
        return "未推荐";
      }
    },
  },
  methods: {
    // 获取品牌列表
    getBrandList() {
      brandListApi().then((response) => {
        this.allData = response.data;
      });
    },

    // 列表多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 推荐切换按钮
    handleRecommendStatusStatusChange(index, row) {
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },

    // 设置排序
    handleSort(row){
      this.sortDialogVisible = true;
      this.sortDialogData.sort = row.sort;
      this.sortDialogData.id = row.id;
    },

    // 删除按钮
    handleDelete(row) {
      this.$confirm("是否进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    // 更新排序
    handleUpdateSort(){
      this.allData = updateItem(this.allData, this.sortDialogData)
      this.sortDialogVisible = false
    }
  },
};
</script>
<style lang="less" scoped>
.filter-container {
  margin-top: 40px;
  margin-bottom: 20px;
}
.table-container {
  margin-top: 20px;
}
.bottom-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>


