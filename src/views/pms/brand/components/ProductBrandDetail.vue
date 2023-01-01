<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-08 17:21:14
 * @FilePath: \vue_manage\src\views\pms\brand\components\ProductBrandDetail.vue
-->
<template>
  <div class="product-brand-detail">
    <el-card class="form-container" shadow="never">
      <el-form
        :model="brand"
        :rules="rules"
        ref="brandFrom"
        label-width="150px"
      >
        <el-form-item label="品牌名称：" prop="name">
          <el-input v-model="brand.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母：">
          <el-input v-model="brand.firstLetter"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO：" prop="logo">
          <single-upload v-model="brand.logo"></single-upload>
        </el-form-item>
        <el-form-item label="品牌专区大图：">
          <single-upload v-model="brand.bigPic"></single-upload>
        </el-form-item>
        <el-form-item label="品牌故事：">
          <el-input
            placeholder="请输入内容"
            type="textarea"
            v-model="brand.brandStory"
            :autosize="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model.number="brand.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-radio-group v-model="brand.showStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品牌制造商：">
          <el-radio-group v-model="brand.factoryStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="primary" @click="onSubmit('brandFrom')"
          >提交</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')"
          >重置</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import SingleUpload from "@/components/upload/SingleUpload";
import { brandListApi } from "@/api/brand";

export default {
  name: "ProductBrandDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultBrand: {
        bigPic: "",
        brandStory: "",
        factoryStatus: 0,
        firstLetter: "",
        logo: "",
        name: "",
        showStatus: 0,
        sort: 0,
      },
      brand: {
        bigPic: "",
        brandStory: "",
        factoryStatus: 0,
        firstLetter: "",
        logo: "",
        name: "",
        showStatus: 0,
        sort: 0,
      },
      rules: {
        name: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        logo: [{ required: true, message: "请输入品牌logo", trigger: "blur" }],
        sort: [{ type: "number", message: "排序必须为数字" }],
      },
    };
  },
  created() {
    this.getBrand();
  },
  methods: {
    // 获取品牌数据
    getBrand() {
      if (this.isEdit) {
        brandListApi().then((response) => {
          response.data.forEach((element) => {
            if (element.id == this.$route.query.id) {
              this.brand = element;
            }
          });
        });
      } else {
        this.brand = this.defaultBrand;
      }
    },

    // 提交
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            if (this.isEdit) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$router.back();
            } else {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$router.back();
            }
          });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
          });
        }
      });
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.brand = this.defaultBrand;
    },
  },
};
</script>

<style lang="less" scoped>
.product-brand-detail {
  margin-top: 40px;
  width: 800px;
  .form-container {
    padding: 40px;
    .btn {
      display: flex;
      justify-content: center;
    }
  }
}
</style>


