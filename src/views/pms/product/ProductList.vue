<!--
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-05 14:41:10
 * @FilePath: \vue_manage\src\views\pms\list\ProductList.vue
-->
<template>
  <div class="product-list">
    <datasheets :all-data="allData" :filter-data="filterData" :total="total" :operate-data="operateData" :batch-operate-options="batchOperateOptions" @handleBatchOperate="handleBatchOperate">
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
          <el-table-column prop="id" label="编号" width="100" align="center" />

          <el-table-column label="商品图片" width="120" align="center">
            <template v-slot="scope">
              <img style="height: 80px" :src="scope.row.pic"/>
            </template>
          </el-table-column>

          <el-table-column label="商品名称" align="center">
            <template v-slot="scope">
              <p>{{ scope.row.name }}</p>
              <p>品牌：{{ scope.row.brandName }}</p>
            </template>
          </el-table-column>

          <el-table-column label="价格/货号" width="140" align="center">
            <template v-slot="scope">
              <p>价格：{{ scope.row.price | moneyFormat }}</p>
              <p>货号：{{ scope.row.productSn }}</p>
            </template>
          </el-table-column>

          <el-table-column label="标签" width="140" align="center">
            <template v-slot="scope">
              <p>
                上架：
                <el-switch
                    @change="handlePublishStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.publishStatus"
                >
                </el-switch>
              </p>
              <p>
                新品：
                <el-switch
                    @change="handleNewStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.newStatus"
                >
                </el-switch>
              </p>
              <p>
                推荐：
                <el-switch
                    @change="handleRecommendStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.recommandStatus"
                >
                </el-switch>
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="sort" label="排序" width="100" align="center" />
          <el-table-column prop="sale" label="销量" width="100" align="center" />

          <el-table-column label="审核状态" width="100" align="center">
            <template v-slot="scope">
              <p>{{ scope.row.verifyStatus | verifyStatusFilter }}</p>
              <p>
                <el-button
                    type="text"
                    @click="handleShowVerifyDetail(scope.$index, scope.row)"
                >审核详情
                </el-button>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template v-slot="scope">
              <p>
                <el-button
                    size="mini"
                    @click="handleUpdateProduct(scope.row)"
                >编辑
                </el-button>
              </p>
              <p>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete"
                >删除
                </el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </datasheets>
  </div>
</template>

<script>
import {productListApi, productFilterCateApi, productChildCateApi} from "@/api/product";
import {brandListApi} from '@/api/brand'
import Datasheets from "@/components/datasheets/Datasheets";

export default {
  name: "ProductList",
  components: {
    Datasheets
  },
  created() {
    this.getProductList();
    this.getProductFilterCate()
    this.getBrandListApi()
  },
  data() {
    return {
      allData: [],
      total: 0,
      filterData: {
        input: [
          {
            label: '商品名称',
            placeholder: '请输入商品名称',
            keyword: 'name'
          },
          {
            label: '商品货号',
            placeholder: '请输入商品货号',
            keyword: 'productSn'
          },
        ],
        cascader: [
          {
            label: '商品分类',
            placeholder: '请选择',
            keyword: 'productCategoryId',
            options: []
          }
        ],
        select: [
          {
            label: '商品品牌',
            placeholder: '请选择',
            keyword: 'brandId',
            options: []
          },
          {
            label: '上架状态',
            placeholder: '请选择',
            keyword: 'publishStatus',
            options: [
              {
                value: 1,
                label: "上架",
              },
              {
                value: 0,
                label: "下架",
              },
            ]
          },
          {
            label: '审核状态',
            placeholder: '请选择',
            keyword: 'verifyStatus',
            options: [
              {
                value: 1,
                label: "审核通过",
              },
              {
                value: 0,
                label: "未审核",
              }
            ]
          },
        ]
      },
      operateData: [
        {
          btnName: '添加',
          callback: this.handleAdd
        }
      ],
      batchOperateOptions: [
        {
          label: '商品上架',
        },
        {
          label: '商品下架',
        },
        {
          label: '设为推荐',
        },
        {
          label: '取消推荐',
        },
        {
          label: '设为新品',
        },
        {
          label: '取消新品',
        },
      ],
      selectList: []
    };
  },

  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return "审核通过";
      } else {
        return "未审核";
      }
    },
  },

  methods: {
    //  获取商品
    getProductList() {
      productListApi().then((response) => {
        console.log(response)
        this.allData = response.data.list
        this.total = response.data.total
      });
    },

    // 获取商品分类
    getProductFilterCate() {
      productFilterCateApi().then(response => {
        let ids = []
        let options = []
        response.data.forEach(element => {
          ids.push(element.id)
          options.push({
            label: element.name,
            value: element.id,
            children: []
          })
        })
        this.getProductChildCate(ids, options)
      })
    },

    // 获取商品子分类
    getProductChildCate(ids, options){
      let pList = []
      ids.forEach(element => {
        pList.push(productChildCateApi(element))
      })

      Promise.all(pList).then(response => {
        response.forEach((element, index) => {
          element.data.forEach(item => {
            options[index].children.push({
              label: item.name,
              value: item.id
            })
          })
        })
        this.filterData.cascader[0].options = options
      })
    },

    // 获取品牌
    getBrandListApi(){
      brandListApi().then(response => {
        let temp = []
        response.data.forEach(element => {
          temp.push({
            label: element.name,
            value: element.id
          })
        })
        this.filterData.select[0].options = temp
      })
    },

    // 审核详情
    handleShowVerifyDetail(){
      this.$message({
        message: '审核详情',
        type: "warning"
      })
    },

    // 添加
    handleAdd(){
      this.$router.push({ name: "addProduct" });
    },

    // 编辑
    handleUpdateProduct(row){
      this.$router.push({
        path: "/pms/updateProduct",
        query: {
          id: row.id,
        },
      });
    },

    // 删除
    handleDelete(){
      this.$message({
        message: '删除',
        type: "warning"
      })
    },

    // 批量操作
    handleBatchOperate(value){
      if (this.selectList.length) {
        let temp = [];
        this.selectList.forEach((element) => {
          if (value === "商品上架") {
            element.publishStatus = 1;
            temp.push(element);
          }else if (value === "商品下架") {
            element.publishStatus = 0;
            temp.push(element);
          }else if (value === "设为推荐") {
            element.recommandStatus = 1;
            temp.push(element);
          }else if (value === "取消推荐") {
            element.recommandStatus = 0;
            temp.push(element);
          }else if (value === "设为新品") {
            element.newStatus = 1;
            temp.push(element);
          }else if (value === "取消新品") {
            element.newStatus = 0;
            temp.push(element);
          }
        });
      } else {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
        });
      }
    },

    // 选择
    handleSelectionChange(value){
      this.selectList = value
    },

    handlePublishStatusChange(){
      console.log('handlePublishStatusChange')
    },

    handleNewStatusChange(){
      console.log('handleNewStatusChange')
    },

    handleRecommendStatusChange(){
      console.log('handleRecommendStatusChange')
    },
  },
};
</script>

<style lang="less" scoped>
.product-list {
  .filter {
    margin-top: 60px;
    margin-left: 20px;
  }
  .operate-container {
    margin-left: 20px;
    margin-top: 20px;
    .left {
      display: inline-block;
      .el-icon-tickets {
        margin-right: 5px;
      }
    }
    .btn-add {
      margin-left: 91%;
    }
  }
  .list {
    margin-left: 20px;
    margin-top: 20px;
  }
  .product-operate {
    margin-bottom: 40px;
  }
}
</style>
