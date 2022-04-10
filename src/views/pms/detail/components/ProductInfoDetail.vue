<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      :rules="rules"
      ref="productInfoForm"
      label-width="120px"
      style="width: 600px"
      size="small"
    >
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions"
        >
        </el-cascader>
      </el-form-item>

      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select
          v-model="value.brandId"
          @change="handleBrandChange"
          placeholder="请选择品牌"
        >
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input v-model="value.productSn"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="value.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="商品重量：">
        <el-input v-model="value.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button
          type="primary"
          size="medium"
          @click="handleNext('productInfoForm')"
          >下一步，填写商品促销</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { productFilterCateApi, productChildCateApi } from "@/api/product";
import { brandListApi } from "@/api/brand";

export default {
  name: "ProductInfoDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasEditCreated: false,

      //选中商品分类的值
      selectProductCateValue: [],

      productCateOptions: [],
      brandOptions: [],

      // 校验规则
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        subTitle: [
          { required: true, message: "请输入商品副标题", trigger: "blur" },
        ],
        productCategoryId: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
        brandId: [
          { required: true, message: "请选择商品品牌", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入商品介绍", trigger: "blur" },
        ],
        requiredProp: [
          { required: true, message: "该项为必填项", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getProductCateList();
    this.getBrandList();
  },
  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    },
  },
  watch: {
    // 商品分类选择
    selectProductCateValue(newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.productCategoryId = newValue[1];
        this.value.productCategoryName = this.getCateNameById(
          this.value.productCategoryId
        );
      } else {
        this.value.productCategoryId = null;
        this.value.productCategoryName = null;
      }
    },
  },

  methods: {
    // 获取商品分类
    getProductCateList() {
      productFilterCateApi().then((response) => {
        let temp = [];
        let requestList = [];
        response.data.forEach((element) => {
          requestList.push(productChildCateApi(element.id));
          temp.push({
            label: element.name,
            value: element.id,
          });
        });

        Promise.all(requestList).then((values) => {
          values.forEach((element, index) => {
            let children = [];
            element.data.forEach((item) => {
              children.push({
                label: item.name,
                value: item.id,
              });
            });
            temp[index].children = children;
          });
          this.productCateOptions = temp;
          if (this.productId != null) {
            this.handleEditCreated();
          }
        });
      });
    },

    // 获取商品品牌
    getBrandList() {
      brandListApi().then((response) => {
        let temp = [];
        response.data.forEach((element) => {
          temp.push({
            label: element.name,
            value: element.id,
          });
        });
        this.brandOptions = temp;
      });
    },

    //处理编辑逻辑
    handleEditCreated() {
      // 更新商品时，赋值分类选择项
      if (this.value.productCategoryId != null) {
        let temp = [this.value.cateParentId, this.value.productCategoryId];
        this.selectProductCateValue = temp;
      }
      this.hasEditCreated = true;
    },

    // 根据id获取对应类名
    getCateNameById(id) {
      let name = "";
      this.productCateOptions.forEach((element) => {
        element.children.forEach((child) => {
          if (child.value == id) {
            name = child.label;
          }
        });
      });
      return name;
    },

    // 品牌选择
    handleBrandChange(value) {
      let brandName = "";
      this.brandOptions.forEach((element) => {
        if (element.value == value) {
          brandName = element.label;
        }
      });
      return brandName;
    },

    // 下一步
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
