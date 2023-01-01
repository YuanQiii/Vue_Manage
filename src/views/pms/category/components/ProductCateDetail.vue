<template>
  <div class="product-cate-detail">
    <el-card class="form-container" shadow="never">
      <el-form
        :model="productCate"
        :rules="rules"
        ref="productCateFrom"
        label-width="150px"
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="productCate.name"></el-input>
        </el-form-item>

        <el-form-item label="上级分类：">
          <el-select v-model="productCate.parentId" placeholder="请选择分类">
            <el-option
              v-for="item in selectProductCateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量单位：">
          <el-input v-model="productCate.productUnit"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="productCate.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-radio-group v-model="productCate.showStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示在导航栏：">
          <el-radio-group v-model="productCate.navStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="分类图标：">
          <single-upload v-model="productCate.icon"></single-upload>
        </el-form-item>

        <el-form-item
          v-for="(filterProductAttr, index) in filterProductAttrList"
          :label="index | filterLabelFilter"
          :key="filterProductAttr.key"
        >
          <el-cascader
            clearable
            v-model="filterProductAttr.value"
            :options="filterAttrsOptions"
          >
          </el-cascader>
          <el-button
            style="margin-left: 20px"
            @click.prevent="removeFilterAttr(filterProductAttr)"
            >删除</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleAddFilterAttr()"
            >新增</el-button
          >
        </el-form-item>
        <el-form-item label="关键词：">
          <el-input v-model="productCate.keywords"></el-input>
        </el-form-item>
        <el-form-item label="分类描述：">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="productCate.description"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('productCateFrom')"
            >提交</el-button
          >
          <el-button v-if="!isEdit" @click="resetForm('productCateFrom')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  productFilterCateApi,
  productAttrCateListApi,
  productChildCateApi,
  productParamsApi,
} from "@/api/product";

import SingleUpload from "@/components/upload/SingleUpload.vue";

export default {
  name: "ProductCateDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: this.$route.query.id,

      // 默认数据
      defaultProductCate: {
        description: "",
        icon: "",
        keywords: "",
        name: "",
        navStatus: 0,
        parentId: 0,
        productUnit: "",
        showStatus: 0,
        sort: 0,
        productAttributeIdList: [],
      },

      // 产品分类和属性数据
      productCate: {
        description: "",
        icon: "",
        keywords: "",
        name: "",
        navStatus: 0,
        parentId: 0,
        productUnit: "",
        showStatus: 0,
        sort: 0,
        productAttributeIdList: [],
      },

      // 分类选择器
      selectProductCateList: [],

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
      },

      // 属性选择器选项
      filterAttrsOptions: [],

      // 属性选择器列表
      filterProductAttrList: [
        {
          value: [],
        },
      ],
    };
  },
  filters: {
    filterLabelFilter(index) {
      if (index === 0) {
        return "筛选属性：";
      } else {
        return "";
      }
    },
  },
  created() {
    // 获取分类的数据
    if (this.isEdit) {
      // 获取一级分类的数据
      productFilterCateApi().then((response) => {
        let requestList = [];
        response.data.forEach((element) => {
          if (element.id == this.id) {
            this.productCate = element;
          } else {
            requestList.push(productChildCateApi(element.id));
          }
        });

        // 获取二级级分类的数据
        Promise.all(requestList).then((values) => {
          values.forEach((value) => {
            value.data.forEach((item) => {
              if (item.id == this.id) {
                this.productCate = item;
              }
            });
          });
        });
      });
    }

    this.getSelectProductCateList();
    this.getProductAttrCateList();
  },
  methods: {
    // 分类选择器
    getSelectProductCateList() {
      productFilterCateApi().then((response) => {
        this.selectProductCateList = response.data;
        this.selectProductCateList.unshift({ id: 0, name: "无上级分类" });
      });
    },

    // 属性选择器
    getProductAttrCateList() {
      productAttrCateListApi().then((response) => {
        let temp = [];
        let requestList = [];

        response.data.list.forEach((element) => {
          temp.push({
            label: element.name,
            value: element.id,
          });
          requestList.push(productParamsApi(element.id));
        });

        Promise.all(requestList).then((values) => {
          values.forEach((value, index) => {
            let children = [];
            value.data.list.forEach((element) => {
              children.push({
                label: element.name,
                value: element.id,
              });
            });
            temp[index].children = children;
          });

          this.filterAttrsOptions = temp;
          this.filterProductAttrList = [
            {
              key: Date.now(),
              value: temp,
            },
          ];
        });
      });
    },

    // 提交数据
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
      this.productCate = this.defaultProductCate;
      this.getSelectProductCateList();
      this.filterProductAttrList = [
        {
          value: [],
        },
      ];
    },

    // 删除筛选属性
    removeFilterAttr(productAttributeId) {
      if (this.filterProductAttrList.length === 1) {
        this.$message({
          message: "至少要留一个",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      var index = this.filterProductAttrList.indexOf(productAttributeId);
      if (index !== -1) {
        this.filterProductAttrList.splice(index, 1);
      }
    },

    // 属性数量超出
    handleAddFilterAttr() {
      if (this.filterProductAttrList.length === 3) {
        this.$message({
          message: "最多添加三个",
          type: "warning",
        });
        return;
      }

      this.filterProductAttrList.push({
        value: null,
        key: Date.now(),
      });
    },
  },
};
</script>

<style lang="less" scoped>
.product-cate-detail {
  width: 800px;
  .form-container {
    padding: 40px;
  }
}
</style>
