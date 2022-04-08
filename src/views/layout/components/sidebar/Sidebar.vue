<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 13:41:24
 * @FilePath: \vue_manage\src\views\layout\components\sidebar\Sidebar.vue
-->
<template>
  <div class="sidebar">
    <el-menu
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :router="true"
      :default-active="$route.path"
      :collapse="false"
    >
      <sidebar-item
        v-for="(item, index) in filterRoutes(routers)"
        :key="index"
        :route="item"
      />
    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SidebarItem from "./SidebarItem.vue";
export default {
  name: "Sidebar",
  components: { SidebarItem },
  computed: {
    ...mapState("pemission", ["routers"]),
    ...mapState("app", ["sidebarStatus"]),
  },
  methods: {
    // 过滤不需要展示在侧边栏的路由
    filterRoutes(routers) {
      let filter = [];
      routers.forEach((element) => {
        if (element.hasOwnProperty("children")) {
          filter.push(element);
        }
      });
      return filter;
    },
  },
};
</script>

<style lang="less" scoped>
.sidebar {
  display: block;
  height: 100%;
  background-color: #304156;
}
</style>