<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-07 15:28:36
 * @FilePath: \vue_manage\src\views\pms\category\AddProductCate.vue
-->
<template>
  <div class="add-product-cate">
    <product-cate-detail :isEdit="false" />
  </div>
</template>

<script>
import ProductCateDetail from "./components/ProductCateDetail.vue";
export default {
  name: "AddProductCate",
  components: {
    ProductCateDetail,
  },
};
</script>


 <style>
.add-product-cate {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>