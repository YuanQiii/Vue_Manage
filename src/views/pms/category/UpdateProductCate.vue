<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-07 15:28:55
 * @FilePath: \vue_manage\src\views\pms\category\UpdateProductCate.vue
-->
<template>
  <div class="update-product-cate">
    <product-cate-detail :isEdit="true" />
  </div>
</template>

<script>
import ProductCateDetail from "./components/ProductCateDetail.vue";
export default {
  components: { ProductCateDetail },
  name: "UpdateProducteCate",
};
</script>

<style>
.update-product-cate {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>