<template>
   
  <el-card class="form-container" shadow="never">
    <el-form
      :model="coupon"
      :rules="rules"
      ref="couponFrom"
      label-width="150px"
      size="small"
    >
      <!-- 优惠券类型 -->
      <el-form-item label="优惠券类型：">
        <el-select v-model="coupon.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 优惠券名称 -->
      <el-form-item label="优惠券名称：" prop="name">
        <el-input v-model="coupon.name" class="input-width" />
      </el-form-item>

      <!-- 适用平台 -->
      <el-form-item label="适用平台：">
        <el-select v-model="coupon.platform">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 总发行量 -->
      <el-form-item label="总发行量：" prop="publishCount">
        <el-input
          v-model.number="coupon.publishCount"
          placeholder="只能输入正整数"
          class="input-width"
        ></el-input>
      </el-form-item>

      <!-- 面额 -->
      <el-form-item label="面额：" prop="amount">
        <el-input
          v-model.number="coupon.amount"
          placeholder="面值只能是数值, 限2位小数"
          class="input-width"
        >
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <!-- 每人限领 -->
      <el-form-item label="每人限领：">
        <el-input
          v-model="coupon.perLimit"
          placeholder="只能输入正整数"
          class="input-width"
        >
          <template slot="append">张</template>
        </el-input>
      </el-form-item>

      <!-- 使用门槛 -->
      <el-form-item label="使用门槛：" prop="minPoint">
        <el-input
          v-model.number="coupon.minPoint"
          placeholder="只能输入正整数"
          class="input-width"
        >
          <template slot="prepend">满</template>
          <template slot="append">元可用</template>
        </el-input>
      </el-form-item>

      <!-- 领取日期 -->
      <el-form-item label="领取日期：" prop="enableTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="coupon.enableTime"
          class="input-width"
        ></el-date-picker>
      </el-form-item>

      <!-- 有效期 -->
      <el-form-item label="有效期：">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="coupon.startTime"
          style="width: 150px"
        ></el-date-picker>
        <span style="margin-left: 20px; margin-right: 20px">至</span>
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="coupon.endTime"
          style="width: 150px"
        ></el-date-picker>
      </el-form-item>

      <!-- 可使用商品 -->
      <el-form-item label="可使用商品：">
        <el-radio-group v-model="coupon.useType">
          <el-radio-button :label="0">全场通用</el-radio-button>
          <el-radio-button :label="1">指定分类</el-radio-button>
          <el-radio-button :label="2">指定商品</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 指定分类 -->
      <el-form-item v-show="coupon.useType === 1">
        <el-cascader
          clearable
          placeholder="请选择分类名称"
          v-model="selectProductCate"
          :options="productCategoryOptions"
        >
        </el-cascader>

        <el-button class="btn-add" @click="handleAddProductCategoryRelation"
          >添加</el-button
        >

        <el-table
          ref="productCateRelationTable"
          :data="coupon.productCategoryRelationList"
          style="width: 100%; margin-top: 20px"
          border
        >
          <el-table-column label="分类名称" align="center">
            <template slot-scope="scope"
              >{{ scope.row.parentCategoryName }}>{{
                scope.row.productCategoryName
              }}</template
            >
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="
                  handleDeleteProductCateRelation(scope.$index, scope.row)
                "
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 指定商品 -->
      <el-form-item v-show="coupon.useType === 2">
        <el-select
          v-model="selectProduct"
          filterable
          remote
          reserve-keyword
          placeholder="商品名称/商品货号"
          :remote-method="searchProductMethod"
        >
          <el-option
            v-for="item in selectProductOptions"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId"
          >
            <span style="float: left">{{ item.productName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px"
              >NO.{{ item.productSn }}</span
            >
          </el-option>
        </el-select>
        <el-button class="btn-add" @click="handleAddProductRelation"
          >添加</el-button
        >
        <el-table
          ref="productRelationTable"
          :data="coupon.productRelationList"
          style="width: 100%; margin-top: 20px"
          border
        >
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">{{ scope.row.productName }}</template>
          </el-table-column>
          <el-table-column label="货号" align="center" width="120">
            <template slot-scope="scope">NO.{{ scope.row.productSn }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDeleteProductRelation(scope.$index, scope.row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="coupon.note"
        >
        </el-input>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit('couponFrom')"
          >提交</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('couponFrom')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import {
  COUPON,
  COUPON_TYPE_OPTIONS,
  COUPON_PLATFORM_OPTIONS,
} from "@/utils/constants";

import { couponDetailApi } from "@/api/marketing";
import { productCategoryApi, productListApi } from "@/api/product";
import {
  productCategory,
  getProductById,
  getProductCategoryByIds,
} from "@/utils/logic";

export default {
  name: "CouponDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    if (this.isEdit) {
      this.getCouponDetail();
    }
    this.getProductCategory();
    this.getProductList();
  },
  data() {
    return {
      coupon: Object.assign({}, COUPON),
      typeOptions: COUPON_TYPE_OPTIONS,
      platformOptions: COUPON_PLATFORM_OPTIONS,
      rules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        publishCount: [
          {
            type: "number",
            required: true,
            message: "只能输入正整数",
            trigger: "blur",
          },
        ],
        amount: [
          {
            type: "number",
            required: true,
            message: "面值只能是数值, 0.01-10000, 限2位小数",
            trigger: "blur",
          },
        ],
        minPoint: [
          {
            type: "number",
            required: true,
            message: "只能输入正整数",
            trigger: "blur",
          },
        ],
      },

      // 选择的商品的索引
      selectProduct: null,

      // 筛选出的商品列表选择
      selectProductOptions: [],

      // 商品列表
      productList: [],

      // 选择的商品分类索引
      selectProductCate: null,

      // 商品分类选项
      productCategoryOptions: [],
    };
  },

  methods: {
    // 获取优惠券详情
    getCouponDetail() {
      couponDetailApi(this.$route.query.id).then((response) => {
        this.coupon = response.data;
      });
      this.getProductCategory();
    },

    // 获取商品分类
    getProductCategory() {
      productCategoryApi().then((response) => {
        this.productCategoryOptions = productCategory(response.data);
      });
    },

    // 商品列表
    getProductList() {
      productListApi().then((response) => {
        this.productList = response.data.list;
      });
    },

    // 搜索商品
    searchProductMethod(query) {
      if (query !== "") {
        let temp = [];
        this.productList.forEach((element) => {
          if (element.name.includes(query)) {
            temp.push({
              productId: element.id,
              productName: element.name,
              productSn: element.productSn,
            });
          }
        });
        this.selectProductOptions = temp;
      } else {
        this.selectProductOptions = [];
      }
    },

    // 添加分类
    handleAddProductCategoryRelation() {
      if (
        this.selectProductCate === null ||
        this.selectProductCate.length === 0
      ) {
        this.$message({
          message: "请先选择商品分类",
          type: "warning",
        });
        return;
      }
      this.coupon.productCategoryRelationList.push(
        getProductCategoryByIds(
          this.productCategoryOptions,
          this.selectProductCate
        )
      );
      this.selectProductCate = [];
    },

    // 添加商品
    handleAddProductRelation() {
      if (this.selectProduct === null) {
        this.$message({
          message: "请先选择商品",
          type: "warning",
        });
        return;
      }
      this.coupon.productRelationList.push(
        getProductById(this.selectProductOptions, this.selectProduct)
      );
      this.selectProduct = null;
    },

    // 删除商品分类
    handleDeleteProductCateRelation(index, row) {
      this.coupon.productCategoryRelationList.splice(index, 1);
    },

    // 删除商品信息
    handleDeleteProductRelation(index, row) {
      this.coupon.productRelationList.splice(index, 1);
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
            this.resetForm(formName);

            let message = "提交成功";
            if (this.isEdit) {
              message = "修改成功";
            }

            this.$message({
              message: message,
              type: "success",
            });
            this.$router.back();
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
      this.coupon = Object.assign({}, COUPON);
    },
  },
};
</script>
<style lang='less' scoped>
.form-container {
  width: 800px;
  margin-left: 150px;
  margin-top: 40px;
}
.input-width {
  width: 60%;
}

.btn-add {
  margin-left: 10px;
}
</style>


