<template>
  <div class="role-list">
    <datasheets :all-data="allData"
                :table-data-structure="tableDataStructure"
                :filter-data="filterData"
                :operate-data="operateData"
                :batch-operate-options="batchOperateOptions"
                @handleBatchOperate="handleBatchOperate"
                @handleSizeChange="handleSizeChange" />
  </div>
</template>

<script>
import Datasheets from "@/components/datasheets/Datasheets";

import {roleListApi} from '@/api/permissions'
import {productListApi} from '@/api/product'
export default {
  name: "RoleList",
  components: {Datasheets},
  created() {
    this.getRoleList()
  },
  data(){
    return {
      allData: [],
      filterData: {
        input: [
          {
            label: '姓名：',
            keyword: 'name',
            placeholder: '请输入姓名'
          }
        ],
        select: [
          {
            label: '品牌：',
            keyword: 'brand',
            placeholder: '请选择品牌',
            options: [
              {
                label: '小米',
                value: 'xiaomi'
              }
            ]
          }
        ],
        cascader: [
          {
            label: '分类：',
            keyword: 'category',
            placeholder: '请选择分类',
            options: [
              {
                value: 'shejiyuanze',
                label: '设计原则',
                children: [{
                  value: 'yizhi',
                  label: '一致'
                }, {
                  value: 'fankui',
                  label: '反馈'
                }, {
                  value: 'xiaolv',
                  label: '效率'
                }, {
                  value: 'kekong',
                  label: '可控'
                }]
              }
            ]
          }
        ]

      },
      operateData: [
        {
          btnName: '添加',
          callback: () => {
            console.log('添加')
          }
        },
      ],
      batchOperateOptions: [
        {
          label: "商品上架",
          value: "publishOn",
        },
      ],
      tableDataStructure: [
        {
          type: 'selection'
        },
        {
          type: 'text',
          label: '编号',
          prop: 'id',
          width: 100
        },
        {
          type: 'image',
          label: '商品图片',
          prop: 'pic',
          width: 120,
          picStyle: 'height: 80px'
        },
        [
          {
            type: 'switch',
            label: '标签',
            keyword: '上架',
            prop: 'publishStatus',
            callback: () => {}
          },
          {
            type: 'switch',
            label: '标签',
            keyword: '新品',
            prop: 'newStatus',
            callback: () => {}
          },
          {
            type: 'switch',
            label: '标签',
            keyword: '推荐',
            prop: 'recommandStatus',
            callback: () => {}
          },
        ],
        [
          {
            type: 'text',
            label: '审核状态',
            prop: 'verifyStatus',
          },
          {
            type: 'button-text',
            label: '审核状态',
            prop: 'verifyStatus',
            callback: () => {}
          }
        ],
        [
          {
            type: 'button-mini',
            label: '编辑',
            callback: () => {}
          },
          {
            type: 'button-mini-danger',
            label: '编辑',
            callback: () => {}
          },
        ]
      ]
    }
  },
  methods: {

    // 获取角色列表
    getRoleList() {
      // roleListApi().then(response => {
      //   console.log(response)
      //   this.allData = response.data
      // })
      productListApi().then(response => {
        console.log(response)
        this.allData = response.data.list
      })
    },

    handleBatchOperate(value){
      console.log(value)
    },
    handleSizeChange(value){
      console.log(value)
    },
    handleCurrentChange(value){
      console.log(value)
    }
  }
}
</script>

<style lang="less" scoped>
.role-list{
  margin-top: 40px;
}
</style>