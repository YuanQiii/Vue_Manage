<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-08 17:16:09
 * @FilePath: \vue_manage\src\views\pms\brand\AddProductBrand.vue
-->
<template>
  <div class="add-product-brand">
    <product-brand-detail :isEdit="false" />
  </div>
</template>

<script>
import ProductBrandDetail from "./components/ProductBrandDetail.vue";
export default {
  components: { ProductBrandDetail },
  name: "AddProductBrand",
};
</script>

<style>
</style>