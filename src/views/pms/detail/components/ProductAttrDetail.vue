<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 14:05:09
 * @FilePath: \vue_manage\src\views\pms\detail\components\ProductAttrDetail.vue
-->
<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      ref="productAttrForm"
      label-width="120px"
      style="width: 720px"
      size="small"
    >
      <el-form-item label="属性类型：">
        <el-select
          v-model="value.productAttributeCategoryId"
          placeholder="请选择属性类型"
          @change="handleProductCateChange"
        >
          <el-option
            v-for="item in productAttrCateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品规格：">
        <el-card shadow="never" class="card-bg">
          <div v-for="(productAttr, idx) in selectProductAttr" :key="idx">
            {{ productAttr.name }}：

            <!-- 规格多选框 -->
            <div v-if="productAttr.handAddStatus == 0">
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <el-checkbox
                  v-for="item in productAttr.inputList.split(',')"
                  :label="item"
                  :key="item"
                  class="littleMarginLeft"
                ></el-checkbox>
              </el-checkbox-group>
            </div>

            <!-- 规格填写 -->
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div
                  v-for="(item, index) in selectProductAttr[idx].values"
                  :key="index"
                  style="display: inline-block"
                  class="littleMarginLeft"
                >
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button
                    type="text"
                    class="littleMarginLeft"
                    @click="handleRemoveProductAttrValue(idx, index)"
                    >删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input
                v-model="addProductAttrValue"
                style="width: 160px; margin-left: 10px"
                clearable
              ></el-input>
              <el-button
                class="littleMarginLeft"
                @click="handleAddProductAttrValue(idx)"
                >增加</el-button
              >
            </div>
          </div>
        </el-card>
      </el-form-item>

      <el-form-item label="商品参数：">
        <el-card shadow="never" class="card-bg">
          <div
            v-for="(item, index) in selectProductParam"
            :key="index"
            class="param-select"
          >
            <div class="param-input-label">{{ item.name }}:</div>

            <!-- 下拉选择 -->
            <el-select
              v-if="item.inputType === 1"
              class="param-input"
              v-model="selectProductParam[index].value"
            >
              <el-option
                v-for="item in item.inputList.split(',')"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-input
              v-else
              class="param-input"
              v-model="selectProductParam[index].value"
            ></el-input>
          </div>
        </el-card>
      </el-form-item>

      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics" />
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev"
          >上一步，填写商品促销</el-button
        >
        <el-button type="primary" size="medium" @click="handleNext"
          >下一步，选择商品关联</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  productAttrCateListApi,
  productSpecificationsApi,
  productParamsApi,
} from "@/api/product";
import SingleUpload from "@/components/upload/singleUpload";
import MultiUpload from "@/components/upload/multiUpload";

export default {
  name: "ProductAttrDetail",
  components: { SingleUpload, MultiUpload },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //编辑模式时是否初始化成功
      hasEditCreated: false,
      //商品属性分类下拉选项
      productAttrCateOptions: [],
      //选中的商品属性
      selectProductAttr: [],
      //选中的商品参数
      selectProductParam: [],
      //选中的商品属性图片
      selectProductAttrPics: [],
      //可手动添加的商品属性
      addProductAttrValue: "",
      //商品富文本详情激活类型
      activeHtmlName: "pc",
    };
  },
  computed: {
    //是否有商品属性图片
    hasAttrPic() {
      if (this.selectProductAttrPics.length < 1) {
        return false;
      }
      return true;
    },
    //商品的编号
    productId() {
      return this.value.id;
    },
    //商品的主图和画册图片
    selectProductPics: {
      get: function () {
        console.log(this.value.pic);

        let pics = [];
        if (
          this.value.pic === undefined ||
          this.value.pic == null ||
          this.value.pic === ""
        ) {
          return pics;
        }
        pics.push(this.value.pic);
        if (
          this.value.albumPics === undefined ||
          this.value.albumPics == null ||
          this.value.albumPics === ""
        ) {
          return pics;
        }

        this.value.albumPics.split(",").forEach((element) => {
          pics.push(element);
        });

        return pics;
      },
      set: function (newValue) {
        console.log(this.value.pic);

        if (newValue == null || newValue.length === 0) {
          this.value.pic = null;
          this.value.albumPics = null;
        } else {
          this.value.pic = newValue[0];
          this.value.albumPics = "";
          if (newValue.length > 1) {
            newValue.forEach((element, index) => {
              this.value.albumPics += element;
              if (index < newValue.length - 1) {
                this.value.albumPics += ",";
              }
            });
          }
        }
      },
    },
  },

  created() {
    this.getProductAttrCateList();
  },
  watch: {
    productId(newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
  },
  methods: {
    handleEditCreated() {
      //根据商品属性分类id获取属性和参数
      if (this.value.productAttributeCategoryId != null) {
        this.handleProductCateChange(this.value.productAttributeCategoryId);
      }
      this.hasEditCreated = true;
    },

    // 获取商品属性分类
    getProductAttrCateList() {
      productAttrCateListApi().then((response) => {
        let temp = [];
        response.data.list.forEach((element) => {
          temp.push({
            label: element.name,
            value: element.id,
          });
        });
        this.productAttrCateOptions = temp;
      });
    },

    //获取设置的可手动添加属性值
    getEditAttrOptions(id) {
      let options = [];
      for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
        let attrValue = this.value.productAttributeValueList[i];
        if (attrValue.productAttributeId === id) {
          let strArr = attrValue.value.split(",");
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j]);
          }
          break;
        }
      }
      return options;
    },

    //获取选中的属性值
    getEditAttrValues(index) {
      let values = new Set();
      if (index === 0) {
        for (let i = 0; i < this.value.skuStockList.length; i++) {
          let sku = this.value.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 1) {
            values.add(spData[0].value);
          }
        }
      } else if (index === 1) {
        for (let i = 0; i < this.value.skuStockList.length; i++) {
          let sku = this.value.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 2) {
            values.add(spData[1].value);
          }
        }
      } else {
        for (let i = 0; i < this.value.skuStockList.length; i++) {
          let sku = this.value.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 3) {
            values.add(spData[2].value);
          }
        }
      }
      return Array.from(values);
    },

    //获取属性的值
    getEditParamValue(id) {
      for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
        if (id === this.value.productAttributeValueList[i].productAttributeId) {
          return this.value.productAttributeValueList[i].value;
        }
      }
    },

    // 选择分类，获取分类和属性
    handleProductCateChange(value) {
      productSpecificationsApi(value).then((response) => {
        this.selectProductAttr = response.data.list;
      });
      productParamsApi(value).then((response) => {
        this.selectProductParam = response.data.list;
      });
    },

    // 添加属性
    handleAddProductAttrValue(idx) {
      let values = this.selectProductAttr[idx].values;
      if (this.addProductAttrValue == null || this.addProductAttrValue == "") {
        this.$message({
          message: "属性值不能为空",
          type: "warning",
        });
        return;
      }
      if (values.indexOf(this.addProductAttrValue) !== -1) {
        this.$message({
          message: "属性值不能重复",
          type: "warning",
        });
        return;
      }
      this.$set(
        this.selectProductAttr[idx].values,
        values.length,
        this.addProductAttrValue
      );
      this.addProductAttrValue = null;
    },

    // 移除属性
    handleRemoveProductAttrValue(idx, index) {
      this.selectProductAttr[idx].values.splice(index, 1);
    },

    refreshProductAttrPics() {
      this.selectProductAttrPics = [];
      if (this.selectProductAttr.length >= 1) {
        let values = this.selectProductAttr[0].values;
        for (let i = 0; i < values.length; i++) {
          let pic = null;
          if (this.isEdit) {
            //编辑状态下获取图片
            pic = this.getProductSkuPic(values[i]);
          }
          this.selectProductAttrPics.push({ name: values[i], pic: pic });
        }
      }
    },

    //获取商品相关属性的图片
    getProductSkuPic(name) {
      for (let i = 0; i < this.value.skuStockList.length; i++) {
        let spData = JSON.parse(this.value.skuStockList[i].spData);
        if (name === spData[0].value) {
          return this.value.skuStockList[i].pic;
        }
      }
      return null;
    },

    //合并商品属性和参数
    mergeProductAttrAndParam() {
      let temp = [];

      this.selectProductAttr.forEach((element) => {
        if (
          element.handAddStatus === 1 &&
          element.options != null &&
          element.options.length > 0
        ) {
          temp.push({
            productAttributeId: attr.id,
            value: this.getOptionStr(attr.options),
          });
        }
      });

      this.selectProductParam.forEach((element) => {
        temp.push({
          productAttributeId: element.id,
          value: element.value,
        });
      });

      this.value.productAttributeValueList.push(temp);
    },

    //合并商品属性图片
    mergeProductAttrPics() {
      for (let i = 0; i < this.selectProductAttrPics.length; i++) {
        for (let j = 0; j < this.value.skuStockList.length; j++) {
          let spData = JSON.parse(this.value.skuStockList[j].spData);
          if (spData[0].value === this.selectProductAttrPics[i].name) {
            this.value.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
          }
        }
      }
    },

    // 获取选项对应的值
    getOptionStr(arr) {
      let str = "";

      arr.forEach((element, index) => {
        str += element;
        if (index != arr.length - 1) {
          str += ",";
        }
      });

      return str;
    },

    handleRemoveProductSku(index, row) {
      let list = this.value.skuStockList;
      if (list.length === 1) {
        list.pop();
      } else {
        list.splice(index, 1);
      }
    },

    handlePrev() {
      this.$emit("prevStep");
    },
    handleNext() {
      this.mergeProductAttrAndParam();
      this.mergeProductAttrPics();
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}
.param-input {
  width: 250px;
}

.param-select {
  margin-top: 10px;
}

.param-input-label {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.card-bg {
  background: #f8f9fc;
}
</style>
