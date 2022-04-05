<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-05 16:02:50
 * @FilePath: \vue_manage\src\views\pms\list\ProductOperate.vue
-->
<template>
  <div class="product-operate">
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate"
        type="primary"
        size="small"
      >
        确定
      </el-button>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="pageConfig.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="pageConfig.pageNum"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductOperate",
  props: {
    total: {
      type: Number,
      default: 0,
    },
    selectList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      operateType: null,
      operates: [
        {
          label: "商品上架",
          value: "publishOn",
        },
        {
          label: "商品下架",
          value: "publishOff",
        },
        {
          label: "设为新品",
          value: "newOn",
        },
        {
          label: "取消新品",
          value: "newOff",
        },
        {
          label: "设为推荐",
          value: "recommendOn",
        },
        {
          label: "取消推荐",
          value: "recommendOff",
        },
      ],
      pageConfig: {
        pageSize: 5,
        pageNum: 1,
      },
    };
  },
  methods: {
    handleBatchOperate() {
      if (this.selectList.length) {
        let temp = [];
        this.selectList.forEach((element) => {
          if (this.operateType == "publishOn") {
            element.publishStatus = 1;
            temp.push(element);
          }
          if (this.operateType == "publishOff") {
            element.publishStatus = 0;
            temp.push(element);
          }
          if (this.operateType == "recommendOn") {
            element.recommandStatus = 1;
            temp.push(element);
          }
          if (this.operateType == "recommendOff") {
            element.recommandStatus = 0;
            temp.push(element);
          }
          if (this.operateType == "newOn") {
            element.newStatus = 1;
            temp.push(element);
          }
          if (this.operateType == "newOff") {
            element.newStatus = 0;
            temp.push(element);
          }
        });

        this.$emit("batchOperate", temp);
      } else {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000 * 3,
        });
      }
    },
    handleSizeChange(value) {
      this.pageConfig.pageSize = value;
      this.$emit("pageConfigChange", this.pageConfig);
    },
    handleCurrentChange(value) {
      this.pageConfig.pageNum = value;
      this.$emit("pageConfigChange", this.pageConfig);
    },
  },
};
</script>

<style lang="less" scoped>
.product-operate {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-top: 20px;
}
</style>