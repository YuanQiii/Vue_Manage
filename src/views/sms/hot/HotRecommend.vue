<template>
  <div class="hot-recommend">

    <datasheets :all-data="showData" :total="showData.length" :filter-data="filterData" :operate-data="operateData" :multiple-selection="multipleSelection" :batch-operate-options="batchOperateOptions">
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
          <el-table-column prop="name" label="商品名称" align="center" />
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

    <select-dialog
      :productList="dialogData"
      :dialogVisible.sync="dialogVisible"
      @closeDialog="closeDialog"
    />

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
import { productListApi } from "@/api/product";
import {updateItem} from "@/utils/logic";
import SelectDialog from "./components/SelectDialog.vue";
import Datasheets from "@/components/datasheets/Datasheets";
export default {
  name: "HotRecommend",
  components: {Datasheets,SelectDialog},
  created() {
    this.getProductList();
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
  data() {
    return {
      allData: [],
      showData: [],
      dialogData: [],
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
            keyword: 'recommendStatus',
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
      operateData: [
        {
          btnName: '选择商品',
          callback: this.handleSelectProduct
        }
      ],
      batchOperateOptions: [
        {
          label: '取消推荐',
          key: 'recommendStatus',
          value: 0
        }
      ],


      productList: [],
      otherProductList: [],
      tableDataList: [],
      filterConditions: {},
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
      },
      dialogVisible: false,
      recommendOptions: [
        {
          label: "未推荐",
          value: 0,
        },
        {
          label: "推荐中",
          value: 1,
        },
      ],
      listLoading: false,
      multipleSelection: [],
      sortDialogVisible: false,
      sortDialogData: {
        id: 0,
        sort: 0,
      },
      operates: [
        {
          label: "设为推荐",
          value: 0,
        },
        {
          label: "取消推荐",
          value: 1,
        },
        {
          label: "删除",
          value: 2,
        },
      ],
      operateType: null,
    };
  },
  methods: {
    // 获取商品数据
    getProductList() {
      productListApi().then((response) => {
        this.allData = response.data.list
        this.handleRecommendData()
      });
    },

    // 选择商品
    handleSelectProduct() {
      this.dialogVisible = true;
      this.handleRecommendData()
    },

    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 推荐切换按钮
    handleRecommendStatusStatusChange(row) {
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },

    // 设置排序按钮
    handleSort(row) {
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

    // 排序确定
    handleUpdateSort() {
      this.allData = updateItem(this.allData, this.sortDialogData)
      this.sortDialogVisible = false
      this.handleRecommendData()
    },

    // 关闭对话框,添加数据
    closeDialog(value) {
      this.dialogVisible = false;

      value.forEach((element) => {
        for (let i = 0; i < this.showData.length; i++) {
          if (this.showData[i].id !== element.id) {
            element.recommendStatus = 1
            this.showData.push(element);
            break;
          }
        }
      });


    },

    // 处理推荐数据
    handleRecommendData(){
      this.showData = this.allData.filter(element => {
        return element.recommendStatus
      })

      this.dialogData = this.allData.filter(element => {
        return !element.recommendStatus
      })
    },
  },
};
</script>

<style lang="less" scoped>
.filter-container {
  margin-top: 40px;
  margin-bottom: 20px;
}
.operate-container {
  margin-bottom: 20px;
  .btn-add {
    float: right;
  }
}
.footer {
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
}
</style>