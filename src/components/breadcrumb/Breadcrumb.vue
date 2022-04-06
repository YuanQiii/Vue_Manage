<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 13:41:24
 * @FilePath: \vue_manage\src\components\Breadcrumb\Breadcrumb.vue
-->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <transition-group name="list">
        <el-breadcrumb-item
          :to="{ path: item.path }"
          v-for="item in pathList"
          :key="item.path"
          >{{ item.meta.title }}</el-breadcrumb-item
        >
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      basePath: "home",
    };
  },
  computed: {
    pathList() {
      let matched = this.$route.matched.filter((item) => item.name);
      const first = matched[0];
      if (first && first.name !== "home") {
        matched = [{ path: "/home", meta: { title: "首页" } }].concat(matched);
      }
      return matched;
    },
  },
};
</script>

<style lang="less" scoped>
.breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;
}
.list-enter-active {
  transition: all 0.5s;
}
.list-leave-active {
  transition: all 0.5s;
}
.list-enter {
  opacity: 0;
  transform: translateX(50px);
}
.list-leave {
  opacity: 0;
  transform: translateX(50px);
}
</style>