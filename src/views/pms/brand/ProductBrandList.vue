<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-08 17:04:09
 * @FilePath: \vue_manage\src\views\pms\brand\ProductBrandList.vue
-->
<template>
  <div class="brand-list">
    <datasheets
      :all-data="allData"
      :filter-data="filterData"
      :total="allData.length"
      :operate-data="operateData"
      :batch-operate-options="batchOperateOptions"
      :multipleSelection="multipleSelection"
    >
      <template v-slot="prop">
        <el-table :data="prop.tableData" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column prop="id" label="编号" width="100" align="center" />
          <el-table-column prop="name" label="品牌名称" align="center" />
          <el-table-column
            prop="firstLetter"
            label="品牌首字母"
            width="100"
            align="center"
          />
          <el-table-column
            prop="sort"
            label="排序"
            width="100"
            align="center"
          />
          <el-table-column label="品牌制造商" align="center" width="100">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.factoryStatus"
                @change="handleFactoryStatusChange(scope.row)"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否显示" align="center" width="100">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.showStatus"
                @change="handleShowStatusChange(scope.row)"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button size="mini" @click="handleUpdate(scope.row)"
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
  </div>
</template>
<script>
import { brandListApi } from "@/api/brand";
import Datasheets from "@/components/datasheets/Datasheets.vue";

export default {
  components: { Datasheets },
  name: "ProductBrandList",
  created() {
    this.getBrandList();
  },
  data() {
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: "输入搜索",
            placeholder: "品牌名称",
            keyword: "name",
          },
        ],
      },
      operateData: [
        {
          btnName: '添加',
          callback: this.handleAdd
        }
      ],
      batchOperateOptions: [
        {
          label: "显示品牌",
          key: 'showStatus',
          value: 1
        },
        {
          label: "隐藏品牌",
          key: 'showStatus',
          value: 0
        },
      ],
      multipleSelection: [],
    };
  },
  methods: {
    // 获取品牌数据
    getBrandList() {
      brandListApi().then((response) => {
        this.allData = response.data;
        console.log(this.allData);
      });
    },

    // 选择
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },

    // 制造商
    handleFactoryStatusChange(row) {
      this.$message({
        message: "品牌制造商",
        type: "info",
      });
    },

    // 是否显示
    handleShowStatusChange(row) {
      console.log(this.brandList);
    },

    // 跳转到更新页面
    handleUpdate(row) {
      this.$router.push({ path: "/pms/updateBrand", query: { id: row.id } });
    },

    // 删除
    handleDelete(row) {
      this.$confirm("是否要删除该品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
      });
    },

    // 跳转到添加页面
    handleAdd() {
      this.$router.push({ path: "/pms/addBrand" });
    },
  },
};
</script>
<style lang="less" scoped>
.brand-list {
  margin-left: 20px;
  margin-top: 40px;
  .el-icon-search {
    margin-right: 5px;
  }
  .el-icon-tickets {
    margin-right: 5px;
  }
  .btn {
    margin-top: 30px;
  }
  .btn-add {
    float: right;
  }
  .operate-container {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 40px;
  }
}
</style>

