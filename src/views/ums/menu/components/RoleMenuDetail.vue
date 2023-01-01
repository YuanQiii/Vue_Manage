<template>
  <div>
    <el-card style="padding: 40px 100px; width: 40%; margin: 0 auto" shadow="never">
      <el-form ref="menuForm" label-position="right" label-width="80px" :model="menuDetail" :rules="rules">
        <el-form-item label="菜单名称" prop="title" required>
          <el-input v-model="menuDetail.title"/>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="menuDetail.parentId" placeholder="请选择">
            <el-option
                v-for="item in parentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="前端名称" prop="name" required>
          <el-input v-model="menuDetail.name"/>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon" required>
          <el-input v-model="menuDetail.icon" style="width: 300px; margin-right: 10px"/>
          <svg-icon :icon-class="menuDetail.icon" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio v-model="menuDetail.hidden" :label="0">是</el-radio>
          <el-radio v-model="menuDetail.hidden" :label="1">否</el-radio>
        </el-form-item>
        <el-form-item label="排序" prop="sort" required>
          <el-input v-model="menuDetail.sort"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleRest">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import {roleMenuListApi} from '@/api/permissions'
export default {
  name: "RoleMenuDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
  },
  created() {
    this.getRoleMenuDetail()
  },
  data(){
    return {
      defaultMenuDetail: {
        title: '',
        parent: 0,
        name: '',
        icon: '',
        hidden: 0,
        sort: 0
      },
      menuDetail: Object.assign({}, this.defaultMenuDetail),
      parentOptions: [
        {
          label: '无上级菜单',
          value: 0
        },
        {
          label: '商品',
          value: 1
        },
        {
          label: '订单',
          value: 2
        },
        {
          label: '营销',
          value: 3
        },
        {
          label: '权限',
          value: 4
        },
      ],
      rules: {
        title: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 140,
            message: '长度在 2 到 140 个字符'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入前端名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 140,
            message: '长度在 2 到 140 个字符'
          }
        ],
        icon: [
          {
            required: true,
            message: '请输入前端图标',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 140,
            message: '长度在 2 到 140 个字符'
          }
        ],
      },
      dialogVisible: true
    }
  },
  methods: {

    // 获取菜单详情
    getRoleMenuDetail(){
      if(this.isEdit){
        roleMenuListApi().then(response => {
          response.data.forEach(element => {
            if(element.id === Number(this.$route.query.id)){
              this.menuDetail = element
              console.log(this.menuDetail)
            }
          })
        })
      }
    },
    // 提交
    handleSubmit(){
      this.$refs.menuForm.validate(valid => {
        if(valid){
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
          }).then(() => {
            this.dialogVisible = false
            if(this.isEdit){
              this.$message({
                message: '修改成功',
                type: 'success',
              });
            }else{
              this.$message({
                message: '提交成功',
                type: 'success',
              });
            }
            this.$router.back()
          }).catch(error => {
            console.log(error)
          })
        }else{
          return false
        }
      })
    },

    // 充值
    handleRest(){
      this.$refs.menuForm.resetFields()
    },
  }
}
</script>

<style lang="less" scoped>

</style>