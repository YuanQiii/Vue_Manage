<template>
  <div class="role-menu-list">
    <datasheets :all-data="allData"
                :operate-data="operateData">
      <template v-slot="prop">
        <el-table :data="prop.tableData" border>
          <el-table-column prop="id" label="编号" width="100" align="center" />
          <el-table-column label="菜单名称" align="center">
            <template v-slot="scope">
              <p>
                {{scope.row.name | formatMenuName(scope.row.title)}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="菜单级数" align="center">
            <template v-slot="scope">
              <p>
                {{scope.row.level | formatMenuLevel}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="前端名称" align="center" />
          <el-table-column label="图标" align="center">
            <template v-slot="scope">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column label="是否显示" align="center">
            <template v-slot="scope">
             <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" />
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center" />
          <el-table-column label="操作" align="center" width="300">
            <template v-slot="scope">
              <el-button size="mini" @click="handleNext(scope.row.id)" :disabled="scope.row.id > 4">查看下级</el-button>
              <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

    </datasheets>
  </div>
</template>

<script>
import Datasheets from "@/components/datasheets/Datasheets";
import {roleMenuListApi, roleMenuChildrenApi} from '@/api/permissions'
export default {
  name: "RoleMenuList",
  components: {Datasheets},
  created() {
    this.getRoleMenuList()
  },

  // 监听路由是否添加参数
  watch: {
      $route(to, from){
        this.getRoleMenuList()
      }
  },
  filters: {
    formatMenuName(value, title) {
      if (value === 'pms') {
        return '商品'
      } else if (value === 'oms') {
        return '订单'
      } else if (value === 'sms') {
        return '营销'
      } else if (value === 'ums') {
        return '权限'
      }else{
        return title
      }
    },
    formatMenuLevel(value) {
      return value ? '二级' : '一级'
    }
  },
  data() {
    return {
      allData: [],
      operateData: [
        {
          btnName: '添加',
          callback: this.handleAdd
        }
      ]
    }
  },
  methods: {
    // 获取菜单列表
    getRoleMenuList() {
      let parentId = this.$route.query.parentId
      if (!parentId) {
        roleMenuListApi(1).then(response => {
          this.handleMenuData(response.data)
        })
      } else {
        roleMenuChildrenApi(parentId).then(response => {
          this.allData = response.data
        })
      }
    },

    // 处理菜单数据
    handleMenuData(list) {
      if (this.$route.query.parentId) {
      } else {
        this.allData = list.filter(element => {
          return element.parentId === 0
        })
      }
    },

    // 添加
    handleAdd() {
      this.$router.push({
        path: 'addRoleMenu'
      })
    },

    // 查看下级
    handleNext(id) {
      this.$router.push({
        path: 'roleMenuList',
        query: {
          parentId: id
        }
      })
    },

    // 编辑
    handleEdit(id){
      this.$router.push({
        path: 'updateRoleMenu',
        query: {
          id
        }
      })
    },

    handleDelete(id){
      this.$message({
        message: '删除',
        type: "warning"
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>