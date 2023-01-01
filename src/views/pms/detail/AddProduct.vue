<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 13:56:02
 * @FilePath: \vue_manage\src\views\pms\detail\AddProduct.vue
-->

<template>
  <div class="product-add">
    <product-detail :isEdit="false" />
  </div>
</template>

<script>
import ProductDetail from "./components/ProductDetail.vue";
export default {
  name: "AddProduct",
  components: { ProductDetail },
};
</script>

<style>
</style>