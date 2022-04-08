<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-08 17:17:43
 * @FilePath: \vue_manage\src\views\pms\brand\UpdateProductBrand.vue
-->
<template>
  <div class="update-product-brand">
    <product-brand-detail :isEdit="true" />
  </div>
</template>

<script>
import ProductBrandDetail from "./components/ProductBrandDetail.vue";
export default {
  components: { ProductBrandDetail },
  name: "UpdateProductBrand",
};
</script>

<style>
</style>