<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 13:56:17
 * @FilePath: \vue_manage\src\views\pms\detail\UpdateProduct.vue
-->

<template>
  <div class="product-add">
    <product-detail :isEdit="true" />
  </div>
</template>

<script>
import ProductDetail from "./components/ProductDetail.vue";
export default {
  name: "UpdateProduct",
  components: { ProductDetail },
};
</script>

<style>
</style>