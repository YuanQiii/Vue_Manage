<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 13:41:24
 * @FilePath: \vue_manage\src\views\layout\components\sidebar\SidebarItem.vue
-->
<template>
  <div class="sidebar-item">
    <el-submenu :index="route.path" v-if="route.children.length != 1">
      <template slot="title">
        <svg-icon :icon-class="route.meta.icon" class="icon" />
        <span slot="title">{{ route.meta.title }}</span>
      </template>

      <el-menu-item
        :index="getRoutePath(route.path, item.path)"
        v-for="(item, index) in filterRouteChildren(route.children)"
        :key="index"
      >
        <svg-icon :icon-class="item.meta.icon" class="icon" />
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-submenu>

    <el-menu-item
      :index="getRoutePath(route.path, route.children[0].path)"
      class="submenu"
      @click.native="select(getRoutePath(route.path, route.children[0].path))"
      v-else
    >
      <template slot="title">
        <svg-icon :icon-class="route.children[0].meta.icon" class="icon" />
        <span slot="title">{{ route.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    route: {
      type: Object,
      default: {},
    },
  },
  methods: {
    // 过滤部分不需要展示侧边栏的路由
    filterRouteChildren(routeChildren) {
      let filter = [];
      routeChildren.forEach((element) => {
        if (element.meta.hasOwnProperty("icon")) {
          filter.push(element);
        }
      });
      return filter;
    },
    getRoutePath(parent, child) {
      return `${parent}/${child}`;
    },
    select(path) {
      this.$router.push({ path });
    },
  },
};
</script>

<style lang="less" scoped>
.sidebar-item {
  .icon {
    margin-right: 20px;
  }
}
// .el-menu-item {
//   background-color: #1f2d3d !important;
// }
// .el-menu-item:hover {
//   background-color: #001528 !important;
// }
</style>